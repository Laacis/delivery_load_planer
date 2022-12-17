import json

from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse

from .models import *
from .forms import *
from .util import *


def index(request):
    # if user authenticated
    if (request.user.is_authenticated):

        if is_req_planner(request):
            return HttpResponseRedirect((reverse("tour_planning")))
        elif is_req_driver(request):
            return HttpResponseRedirect((reverse("your_plan")))
        else:
            return HttpResponseRedirect(reverse("profile", kwargs={'profileid':request.user.id }))

    else:
        return render(request, "load_planer/index.html")


@login_required(login_url="login")
def gateway(request):
    """
        if authenticated user is Planner or Driver redirect to index, else
        render gateway.html
    """
    if is_req_planner(request) or is_req_driver(request):
        return HttpResponseRedirect((reverse("index")))
    else:
        driver_form = DriverForm()
        return render(request,"load_planer/gateway.html", {"driver": "You are not verified as Driver/Planer.", "driver_form": driver_form})


@login_required
def your_plan(request):
    if is_req_planner(request):
        # Planner can't have a tour plan, redirect to Tour planning page
       return HttpResponseRedirect(reverse("tour_planning"))
    elif is_req_driver(request):
        return render(request, "load_planer/your_plan.html")
    else:
        # not a driver/planner redirected to own profile
        return HttpResponseRedirect(reverse("profile", kwargs={'profileid':request.user.id }))

@login_required(login_url="login")
def tour_planning(request):
    if (is_req_planner(request)):
        return render(request, "load_planer/tour_planning.html")

    else:
        # not a planner redirected to own profile
        return HttpResponseRedirect(reverse("profile", kwargs={'profileid':request.user.id }))
 

@login_required(login_url="login")
def trucks(request):
    """ Only Planner should have access to this page"""
    form = TruckForm()
    trucks = Truck.objects.all()
    if (is_req_planner(request)):
        if request.method == 'POST':
            truck_form = TruckForm(request.POST)
            if truck_form.is_valid():
                truck_id = truck_form.cleaned_data['truck_id']
                pallet_size = truck_form.cleaned_data['pallet_size']
                zones = truck_form.cleaned_data['zones']
                try:
                    add_truck = Truck(truck_id=truck_id, pallet_size=pallet_size, zones=zones)
                    add_truck.save()
                    return render(request, 'load_planer/trucks.html', {"truck_form": form, 'trucks':trucks})
                except: 
                    return HttpResponse("Error: Unable to save this truck!")
            
            else:
                return HttpResponse("Error: Form not valid!")

        else:
            # if GET method:
            return render(request, 'load_planer/trucks.html', {"truck_form": form,'trucks':trucks})
    else:
        # not Planner redirected to own profile
        return HttpResponseRedirect(reverse("profile", kwargs={'profileid':request.user.id }))


@login_required(login_url="login")
def drivers(request):
    """
        return two lists of Queary sets:
        verified and unverified drivers
        Unverified drivers are limited to one result.
        Only Planner should have access to drivers page
    """
    if (is_req_planner(request)):
        driver_list = Driver.objects.all()
        verified_drivers = []
        un_verified_drivers = []
        for x in driver_list:
            try:
                driver_verify = Profile.objects.get(username=x.username)
            except:
                driver_verify.is_driver = False

            if (driver_verify.is_driver): 
                verified_drivers.append(x)
            else:
                un_verified_drivers.append(x)
        # sort the lists to display the new registred first
        def sortUnVerif(e):
            return e.username.id
        un_verified_drivers.sort(reverse=True, key=sortUnVerif)
        verified_drivers.sort(reverse=True, key=sortUnVerif)
        # we only return first results
        un_verified_drivers = un_verified_drivers[0:1]

        return render(request, 'load_planer/drivers.html', {"driver_list":driver_list, "verified_drivers":verified_drivers, "un_verified_drivers":un_verified_drivers})
    else:
        # not Planner redirected to own profile
        return HttpResponseRedirect(reverse("profile", kwargs={'profileid':request.user.id }))


@login_required(login_url="login")
def reg_driver(request):
    if request.method != 'POST':
        return HttpResponse("Error: Forbidden method!")
    else:
        form = DriverForm(request.POST)
        if form.is_valid():
            username = User.objects.get(pk=request.user.id)
            first_name = form.cleaned_data["first_name"]
            last_name = form.cleaned_data["last_name"]
            driver_id = form.cleaned_data["driver_id"]
            # checking if driver_id
            try:
                driver = Driver(
                    username=username,
                    first_name=first_name,
                    last_name=last_name,
                    driver_id=driver_id
                    )
                driver.save()
                prof = Profile(username=username)
                prof.save()
                return render(request, 'load_planer/gateway.html')
            except:
                return HttpResponse("Error: Form could not be saved!")
        return HttpResponse("Error: form is not valid!")

@login_required(login_url="login")
def delivery_plan(request, delivery_plan_id):
    # Only Planner can request this
    if(is_req_planner(request)):
        try:
            plan = Delivery_plan.objects.get(delivery_id=delivery_plan_id)
            context = {
                "plan": plan
            }
            return render(request, 'load_planer/delivery_plan.html', context)
        except:
           return HttpResponseRedirect(reverse("delivery_plans"))
    else:
        # not Planner redirected to own profile
        return HttpResponseRedirect(reverse("profile", kwargs={'profileid':request.user.id }))


@login_required(login_url="login")
def delivery_plans(request):
    # make sure it's only viewed by Planner
    if(is_req_planner(request)):
        return render(request, 'load_planer/delivery_plans.html')
    else:
        # not Planner redirected to own profile
        return HttpResponseRedirect(reverse("profile", kwargs={'profileid':request.user.id }))


@login_required(login_url="login")
def destinations(request):
    # make sure it's only viewed by Planner
    if(is_req_planner(request)):
        destination_form = DestinationForm()
        destination_list = Destination.objects.all()
        context = {
            "destination_form": destination_form,
            "destination_list": destination_list,
            }
        return render(request, 'load_planer/destinations.html', context)
    else:
        # not Planner redirected to own profile
        return HttpResponseRedirect(reverse("profile", kwargs={'profileid':request.user.id }))

@login_required(login_url="login")
def destination(request, destination_id):
    # checking if the destination id exists
    try:
        destination = Destination.objects.get(destination_id=destination_id)
    except:
        return HttpResponse(f"Destination  id: {destination_id} doesn't exist!")
    # checking who's reqeusting
    if is_req_planner(request) or is_req_driver(request):
        context = {
            "destination_id":destination.destination_id,
            "address":destination.address,
            "zipcode":destination.zipcode,
            "contact_number":destination.contact_number
        }
        return render(request, 'load_planer/destination_details.html', context)

    else:
        # not Driver/Planner redirected to own profile
        return HttpResponseRedirect(reverse("profile", kwargs={'profileid':request.user.id}))


@login_required(login_url="login")
def reg_destination(request):
    # only Planner may send request and only POST reqest is accepted
    try:
        if request.method != 'POST' or not is_req_planner(request):
            return HttpResponse("Error: Forbidden method or wrong user!")
        else:
            # Register a new Destination
            form = DestinationForm(request.POST)
            if form.is_valid():
                id = form.cleaned_data["destination_id"]
                address = form.cleaned_data["address"]
                zipcode = form.cleaned_data['zipcode']
                contact_number = form.cleaned_data['contact_number']
                destination = Destination(destination_id = id, address = address, contact_number=contact_number, zipcode=zipcode)
                destination.save()
                return HttpResponseRedirect(reverse("destination", kwargs={'destination_id':id}))
            else:
                # if the "destination_id" field is not unique, it will drop this Response as well as form is not valid.
                return HttpResponse("Error: Form is not valid!")
            
    except:
        # if user is not verified as Driver nor Planner
        return HttpResponse("Error: Forbidden action!")



@login_required(login_url="login")
def profile(request, profileid):
    # if the user is requesting own profile
    if is_req_planner(request):
        # Planner requesting
        try:
            #checking if profile exists:
            profile_data = User.objects.get(pk=profileid)
        except:
            return HttpResponse("Requested ID doesn't exist!")
        try:
            # checking if the user has supplied details for Driver registration
            driver_data = Driver.objects.get(username=profileid)
            verification_data = Profile.objects.get(username=profileid)
        except:
            # if the planner is viewing own profile it will have no driver_data
            if profileid == request.user.id:
                driver_data = None
                verification_data = Profile.objects.get(username=profileid)
            else:
                driver_data = None
                verification_data = None
        context = {
            "profile":profile_data,
            "profile_details": driver_data,
            "verified": verification_data,
            "driver_form": None
        }
        return render(request, 'load_planer/profile.html', context)
    else:
        try:
            #checking if profile exists:
            profile_data = User.objects.get(pk=profileid)
        except:
            return HttpResponse("Requested ID doesn't exist!")
        # If not a Planner, user can only view own account
        requesting_user = User.objects.get(pk = profileid)
        if profileid != request.user.id:
            #if the user is trying to view another users profile, redirect back to own profile
            return HttpResponseRedirect(reverse("profile", kwargs={'profileid':request.user.id}))
        # Checking if the user has given details for Driver registration
        try:
            driver_data = Driver.objects.get(username=requesting_user)
            verification_data = Profile.objects.get(username=requesting_user)
            context = {
                "profile":requesting_user,
                "profile_details": driver_data,
                "verified": verification_data,
                "driver_form": None
            }
        # if no Driver details provided, giving user the Form to fill out.
        except:
            context = {
                "profile":requesting_user,
                "profile_details": 0,
                "verified": 0,
                "driver_form": DriverForm()
            }
        return render(request, 'load_planer/profile.html', context)


@login_required(login_url="login")
def tour(request, tour_id):
    # should only be accessed by Driver and Planner
    if(is_req_planner(request) or is_req_driver(request)):
        # WE only check if the tour exists
        try:
            Tour.objects.get(pk=tour_id)
        except:
            return HttpResponse("Error: Tour not found!")
        # The rest is generated by .js files, only need to give tour_id
        context = {
            "tour_id":tour_id
            }
        return render(request, "load_planer/tour.html", context=context)
    else:
        # not Driver/Planner redirected to own profile
        return HttpResponseRedirect(reverse("profile", kwargs={'profileid':request.user.id}))


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("gateway"))
        else:
            return render(request, "load_planer/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "load_planer/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "load_planer/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "load_planer/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("gateway"))
    else:
        return render(request, "load_planer/register.html")
  
# API

@login_required
@csrf_exempt
def verify_driver(request, profileid):
    """ 
        verifies or removes a Driver in the db, changing the is_driver value to True/False
        Only Planner should have be able to request this.
    """
    if request.method != 'POST':
        # Only POST method allowed
        return HttpResponse("Error: Forbidden method!")
    else:
        # Only planner should be able to verify drivers
        if is_req_planner(request):
            try:
                user = User.objects.get(pk=profileid)
                driver = Profile.objects.get(username=user)
                if driver.is_driver:
                    # Going to remove the driver from the Verified Drivers
                    driver.is_driver = False
                    driver.save()
                    return JsonResponse({"response":"Driver removed!"})
                else:
                    # Going to verify driver
                    driver.is_driver = True
                    driver.save()
                    return JsonResponse({"response":"Driver verified!"})
            except:
                return JsonResponse({"Error": "Uanbale to register user!"})
        else:
            return JsonResponse({"Error": "Only Planner can verify Drivers!"})
  

@login_required
def get_destination_list(request):
    """
        Returns a list if Destination_id's to /delivery_plans,
        while registring a new Delivery plan.
        Helps Planner to select existing destination ID.
        Only Planner can request this.
    """
    if (is_req_planner(request)):
        destinations = list(Destination.objects.values('destination_id'))
        result = json.dumps(destinations)
        return  JsonResponse(result, safe=False)
    else:
        return  JsonResponse({"error":"You are not a planner."})
    

@login_required
@csrf_exempt
def reg_delivery_plan(request):
    """ 
        Register a Delivery plan.
        Can only be registred by Planner.
    """
    if (not is_req_planner(request)): 
        HttpResponse("Error: You are not a planner.")
    elif request.method == 'POST':
        data = json.loads(request.body)
        delivery_id = data.get("delivery_id")
        quarter = data.get("quarter")
        year = data.get('year')
        del_order = data.get("del_order")
        try:
            record = Delivery_plan.objects.create(
                delivery_id = delivery_id,
                quarter = quarter,
                year = year,
                del_order = del_order
            )
            record.save()
            return JsonResponse({"Success": "True"})
        except:
            return JsonResponse({"Success": "False"})
    else:
        return HttpResponse("Error: Forbidden method!")


@login_required
def get_delivery_plan_list(request, delivery_id, details):
    """
        Returns a JSON del_order
        containing sequesnce number  and destination id
        used in /tour_planning for last part of Tour registration, 
        drawing table for pallet type and time schedule.
        details contains an integer: 0 or 1, other options are wrong
        in case of details==0, only del_order information is returned.
        details == 1: returns more compex information, used in /delivery_pla/<id>
        Only Planner can request this.

    """
    if (details >= 2):
        return JsonResponse({'error': "wrong details option"})
    if(is_req_planner(request) or is_req_driver(request)):
        try:
            data_list = Delivery_plan.objects.get(pk=delivery_id)
        except:
            return JsonResponse({"error":f"Delivery plan {delivery_id} doesn't exist."})
        if (details == 0):
            result = json.dumps(data_list.del_order)
            
        else:
            result = []
            jsondata = data_list.del_order
            counter = 0
            for item in jsondata:
                counter = counter+1
                try:
                    destination = Destination.objects.get(destination_id=item)
                    destination = {
                        'nr':counter,
                        'destination_id': destination.destination_id,
                        'address': destination.address,
                        'zipcode':destination.zipcode,
                        'contact_number':destination.contact_number
                    }
                except:
                    destination = [{'destination':'empty'}]
                result.append(destination)
            result = json.dumps(result)
        return JsonResponse(result, safe=False)
    else:
        return JsonResponse({"error":"You are not a planner."})


@login_required
def delete_delivery_plan(request, delivery_id):
    """
        Deletes requested delivery from db
        Only Planner can request this. 
    """
    if(is_req_planner(request)):
        try:
            delivery = Delivery_plan.objects.get(delivery_id=delivery_id)
            delivery.delete()
            return JsonResponse({'success': True})
        except:
            return JsonResponse({'success': False, 'message': f"delivery:{delivery_id} doesn't exist."})
        
    else:
        return JsonResponse({"error":"Not a Planner!"})
    

    


@login_required
def get_delivery_list_by_details(request,year, quarter):
    """ 
        Returns a JSON of Destination plan 
        is used to help Planner fill out the Delivery id field 
        while Registring new tour /tour_planning and in delivery_plans, 
        filter and display Plans for selected year and Quarter
        Only Planner can request this.    
    """
    if(is_req_planner(request)):
        data = Delivery_plan.objects.filter(year=year,quarter=quarter)
        result = []
        for item in data:
            # result.append(item[0])
            result.append({
                'delivery_id':item.delivery_id,
                'year':item.year,
                'quarter': item.quarter,
                'del_order': len(item.del_order)
            })
        result = json.dumps(result)
        return JsonResponse(result, safe=False)
    else:
        return JsonResponse({"error":"Not a Planner!"})


@login_required
def get_driver_list(request, date):
    """
        Returns a list of Driver Ids  for /tour_planning
        to display Drivers who are available on the selected date
        drivers being registred on a Tour, are not in returned list
        Only Planner can request this.
    """
    if(is_req_planner(request)):
        try:
            drivers_busy = list(Tour.objects.filter(exec_date = date).values_list("driver_id"))
        except:
            drivers_busy = []
        drivers_busy_clean = []
        for i in drivers_busy:
            drivers_busy_clean.append(i[0])
        drivers =  Driver.objects.all()
        result = []
        for e in drivers:
            if e.username.is_driver() and e.driver_id not in drivers_busy_clean:
                result.append(e.driver_id)
        result = json.dumps(result)
        return JsonResponse(result, safe=False)
    else:
        return JsonResponse({"error":"Not a Planner!"})


@login_required
def get_truck_list(request, date):
    """
        Returns a list of Truck Ids  for /tour_planning
        to display Trucks available on the selected date
        Trucks being registred on a Tour, are not in returned list
        Only Planner can request this.
    """
    if(is_req_planner(request)):
        try:
            trucks_busy = list(Tour.objects.filter(exec_date = date).values_list("truck_id"))
        except:
            trucks_busy = []
        trucks_busy_clean = []
        for i in trucks_busy:
            trucks_busy_clean.append(i[0])
        trucks = Truck.objects.all()
        result = []
        for t in trucks:
            if t.truck_id not in trucks_busy_clean:
                result.append(t.truck_id)
        result = json.dumps(result)
        return JsonResponse(result, safe=False)
    else:
        return JsonResponse({"error":"Not a Planner!"})


@login_required
@csrf_exempt
def register_tour(request):
    """
        Register a Tour
        Only Planner can register this
    """
    if (request.method == 'POST' and is_req_planner(request)):
        try:
            data = json.loads(request.body)
            truck_id = data['truck_id']
            driver_id = data['driver_id']
            delivery_id = data['delivery_id']
            # checking if delivery exists
            try:
                delivery_id = Delivery_plan.objects.get(delivery_id=delivery_id)
            except:
                return JsonResponse({"error":"delivery_id doesn't exist"})
            # checking if driver_id exists
            try:
                driver_id = Driver.objects.get(pk=driver_id)
            except:
                return JsonResponse({"error":"driver_id doesn't exist"})
            #checking if truck exists
            try:
                truck_id = Truck.objects.get(pk=truck_id)
            except:
                return JsonResponse({"error":"truck_id doesn't exist"})
            # if all prev checks passed - register a new tour
            exec_date = data['exec_date']
            tour_id = f"{delivery_id.delivery_id}:{exec_date}"
            register = Tour.objects.create(
                tour_id = tour_id,
                delivery_id = delivery_id,
                driver_id = driver_id,
                truck_id = truck_id,
                exec_date = exec_date
            )
            register.save()
            return JsonResponse({"tour_id":tour_id})
        except:
            return JsonResponse({"tour_id":""})

    else:
        return JsonResponse({"response":"wrong request"})


@login_required
@csrf_exempt
def register_delivery_point(request):
    """
        Register a Delivery destination point for a Tour
        a part of Tour registration form, requests multiple times
        depending of the number of Destinations in the Delivery plan
        Only Planner can register this.
    """
    if (request.method == 'POST' and is_req_planner(request)):
        data = json.loads(request.body)
        tour_id = data.get('tour_id')
        delivery_time = data.get('delivery_time')
        destination = data.get('destination')
        fpallets = data.get('fpallets')
        cpallets = data.get('cpallets')
        dpallets = data.get('dpallets')
        try:
            tour_id = Tour.objects.get(pk=tour_id)
        except:
            return JsonResponse({"error":"provided tour_id is not registred"})

        try: 
            destination = Destination.objects.get(destination_id=destination)
        except:
            return JsonResponse({"error":"provided destination is not registred"})
        try:
            register = DeliveryPoint.objects.create(
                tour_id = tour_id, # FOREIGN KEY
                delivery_time = delivery_time, #%H:%M
                destination = destination, # FOREIGN KEY
                f_pallets = int(fpallets),
                c_pallets = int(cpallets),
                d_pallets = int(dpallets)
            )
            register.save()
            return JsonResponse({"destination":destination.destination_id, "tour_id":tour_id.tour_id})
        except:
            return JsonResponse({"error":"destination point not registred"})

    else:
        return JsonResponse({"response":"wrong request"})


@login_required
def get_tour_list(request, date):
    """
        Returns a list of Tour id matching the requested date
        used in /tour_planning page to generate table of Tour for selected date.
        Planner and driver can request it.
    """
    if (is_req_driver(request) or is_req_planner(request)):
        try:
            if (is_req_driver(request)):
                driver_id = Driver.objects.get(username=request.user.id).driver_id
                tour_list = Tour.objects.filter(exec_date = date, driver_id = driver_id)
            else:
                tour_list = Tour.objects.filter(exec_date = date)
            result = []
            for x in tour_list:
                result.append(x.serialize())        
            return JsonResponse(result, safe=False)
        except:
            return JsonResponse({"message":f"couldn't find Tour for: { Tour.objects.filter(exec_date = date).driver_id.driver_id.first()}"})
    else:
        return JsonResponse({'error':"You are not Driver nor Planner!"})

# API related to load Tour:


@login_required
def get_truck_details(request, truck_id):
    """
        Returns json serialized info about  truck requested
        used in /tour/<tour id> to generate Reefer loading schema
        Driver and Planner can request this.
    """
    if (is_req_driver(request) or is_req_planner(request)):
        try:
            truck_data = Truck.objects.get(truck_id=truck_id)
            return JsonResponse(truck_data.serialize())
        except:
            return JsonResponse({'error':f'Truck {truck_id} not found!'})
    else:
        return JsonResponse({'error':"You are not Driver nor Planner!"})


@login_required
def get_tour_details(request, tour_id):
    """
        Returns json serialized information about the Tour
        used in /tour/<tour id> to generate information Card about the Tour
        Driver and Planner can request this.
    """ 
    if (is_req_driver(request) or is_req_planner(request)):
        try:
            tour_details = Tour.objects.get(pk=tour_id)
        except:
            return JsonResponse({"error":f"{tour_id} not found"})
        
        return JsonResponse(tour_details.serialize(), safe=False)
    else:
        return JsonResponse({'error':"You are not Driver nor Planner!"})


@login_required
def get_delivery_point_table(request, tour_id):
    """ 
        Returns a JSON data with information about every delivery point from tour_id
        is used in /tour/<tour_id> to populate the table of information about the load
        THis data is also used in the Load planning algorithms
        Planner and Driver may request this.
    """
    if (is_req_driver(request) or is_req_planner(request)):
        try:
            dest_point_list = DeliveryPoint.objects.filter(tour_id = tour_id)
            if dest_point_list.count() == 0 :
                return JsonResponse({"error": f"Tour id: {tour_id} generated list is empty."})
        except:
            return JsonResponse({"error": f"Delivery point with {tour_id} not found."})
        # getting the del_order JSON from Delivery plan 
        try:
            delivery_order = Tour.objects.get(pk=tour_id).delivery_id.del_order
        except:
            return JsonResponse({"error": f"Tour with {tour_id} not found."})

        # this builds up a JSON with details about  every delivery point.
        result = {}
        for item in dest_point_list:
            if item.destination.destination_id in delivery_order.keys():
                result[delivery_order[item.destination.destination_id]] = {
                    "Destination":  item.destination.destination_id,
                    "time": item.delivery_time,
                    "frozen": item.f_pallets,
                    "chilled": item.c_pallets,
                    "dry":item.d_pallets,
                    "total":item.f_pallets + item.c_pallets + item.d_pallets,
                }
        return JsonResponse(result)      
    else:
        return JsonResponse({'error':"You are not Driver nor Planner!"})


@login_required
def trucks_list(request):
    """ 
        Returns a list of truck as JSON serialized
        used to generate cards of Trucks on the /trucks page
        only Planner may request this.
    """
    if(is_req_planner(request)):
        trucks = Truck.objects.all()
        result = []
        for item in trucks:
            result.append(item.serialize())
        result = json.dumps(result)
        return JsonResponse(result, safe=False)
    else:
        return JsonResponse({"error":"No Planner status!"})


# API to verify status
@login_required
def am_i_planner(request):
    """ Returns True of False if requested user is Planner"""
    if is_req_planner(request):
        return JsonResponse({"planner":True})
    else:
        return JsonResponse({"planner":False})
    

# to delete Tour
@login_required
@csrf_exempt
def delete_tour(request, tour_id):
    """
        Deletes a tour in request, by tour_id.
        Only planner may request this.
    """
    if(is_req_planner(request) and (request.method == 'POST')):
        try:
            tour = Tour.objects.get(pk=tour_id)
            tour.delete()
            return JsonResponse({'delete':True})
        except:    
            return JsonResponse({'delete':False})
    else:
        return JsonResponse({"error":"Wrong request or wrong status."})