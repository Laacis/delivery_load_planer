import json
from django import forms
from django.core.serializers import serialize
from django.forms import formset_factory
from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse

from .models import *

# Create your views here.

def index(request):
    return render(request, "load_planer/index.html")


@login_required
def gateway(request):
    try:
        is_driver = Profile.objects.get(username = request.user.id)
        return render(request,"load_planer/gateway.html", {"driver": is_driver})
    except:
        driver_form = DriverForm()
        return render(request,"load_planer/gateway.html", {"driver": "You are not verified as Driver/Planer.", "driver_form": driver_form})


def tour_planing(request):
    return render(request, "load_planer/tour_planing.html")

@login_required
def trucks(request):
    form = TruckForm()
    trucks = Truck.objects.all()
    if request.method == 'POST':
        # REMEMBER TO MAKE SURE THE USER ADDING Truck is A PLANER, not a driver!!!
        truck_form = TruckForm(request.POST)
        if truck_form.is_valid():
            truck_id = truck_form.cleaned_data['truck_id']
            pallet_size = truck_form.cleaned_data['pallet_size']
            zones = truck_form.cleaned_data['zones']
            try:
                add_truck = Truck(truck_id=truck_id, pallet_size=pallet_size, zones=zones)
                add_truck.save()
                return render(request, 'load_planer/trucks.html', {"truck_form": form, "trucks": trucks})
            except: 
                return HttpResponse("Error: Unable to save this truck!")
        
        else:
            return HttpResponse("Error: Form not valid!")

    else:
        
        return render(request, 'load_planer/trucks.html', {"truck_form": form, "trucks": trucks})

@login_required
def drivers(request):
    driver_list = Driver.objects.all()
    # Only show drivers verified of not, don't show planers
    verified_drivers = Profile.objects.filter(is_planer=False)
    return render(request, 'load_planer/drivers.html', {"driver_list":driver_list, "verified_drivers":verified_drivers})

@login_required
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

@login_required
def delivery_plan(request, delivery_plan_id):
    return HttpResponse(f"Delivery plan{delivery_plan_id} requested!")


@login_required
def delivery_plans(request):
    # make sure it's only viewed by Planer

    try:
        delivery_plan_list = Delivery_plan.objects.all()
    except:
        delivery_plan_list = []

    context = {
        "delivery_plan_list": delivery_plan_list,
        }
    return render(request, 'load_planer/delivery_plans.html', context)


@login_required
def destinations(request):
    # make sure it's only viewed by Planer
    destination_form = DestinationForm()
    destination_list = Destination.objects.all()
    context = {
        "destination_form": destination_form,
        "destination_list": destination_list,
        }
    return render(request, 'load_planer/destinations.html', context)

@login_required
@require_http_methods(["GET"])
def destination(request, destination_id):
    # checking if the destination id exists
    try:
        destination = Destination.objects.get(destination_id=destination_id)
    except:
        return HttpResponse(f"Destination  id: {destination_id} doesn't exist!")

    user = User.objects.get(pk=request.user.id)
    if user.is_planer() or user.is_driver():
        context = {
            "destination_id":destination.destination_id,
            "address":destination.address
        }
        return render(request, 'load_planer/destination_details.html', context)

    else:
        return HttpResponseRedirect(reverse("profile", kwargs={'profileid':request.user.id}))


@login_required
def reg_destination(request):
    # only Planer may send request and only POST reqest is accepted
    try:
        planer = User.objects.get(pk=request.user.id)
        if request.method != 'POST' or not planer.is_planer():
            return HttpResponse("Error: Forbidden method or wrong user!")
        else:
            # Register a new Destination
            form = DestinationForm(request.POST)
            if form.is_valid():
                id = form.cleaned_data["destination_id"]
                address = form.cleaned_data["address"]
                destination = Destination(destination_id = id, address = address)
                destination.save()
                return HttpResponseRedirect(reverse("destination", kwargs={'destination_id':id}))
            else:
                # if the "destination_id" field is not unique, it will drop this Response as well as form is not valid.
                return HttpResponse("Error: Form is not valid!")
            
    except:
        # if user is not verified as Driver nor Planer
        return HttpResponse("Error: Forbidden action!")



@login_required
def profile(request, profileid):
    # if the user is requesting own profile
    requesting_user = User.objects.get(pk=request.user.id)
    # Checking if the user is a planer
    if requesting_user.is_planer():
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
            # if the planer is viewing own profile it will have no driver_data
            if profileid == requesting_user.id:
                driver_data = None
                verification_data = Profile.objects.get(username=profileid)
                # return HttpResponse("Planer viewing own profile")
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
        # return HttpResponse(f"IS Planer {requesting_user.is_planer()}")
    else:
        # If not a Planer, user can only view own account
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
        except:
            context = {
                "profile":requesting_user,
                "profile_details": 0,
                "verified": 0,
                "driver_form": DriverForm()
            }
        return render(request, 'load_planer/profile.html', context)



@login_required
def verify_driver(request, profileid):
    if request.method != 'POST':
        # Only POST method allowed
        return HttpResponse("Error: Forbidden method!")
    else:
        # Only planer should be able to verify drivers
        planer = User.objects.get(pk=request.user.id)
        if planer.is_planer():
            try:
                user = User.objects.get(pk=profileid)
                driver = Profile.objects.get(username=user)
                if driver.is_driver:
                    # Going to remove the driver from the Verified Drivers
                    driver.is_driver = False
                    driver.save()
                    return HttpResponseRedirect(reverse("profile", kwargs={'profileid':profileid}))
                else:
                    # Going to verify driver
                    driver.is_driver = True
                    driver.save()
                    return HttpResponseRedirect(reverse("profile", kwargs={'profileid':profileid}))
            except:
                return HttpResponse("Error: Uanbale to register user!")
        else:
            return HttpResponse("Error: Only Planer can verify Drivers!")
        

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


# FORMS

class TruckForm(forms.ModelForm):
    zones = forms.TypedChoiceField(choices=[(2, 2), (3, 3)], coerce=int)
    pallet_size = forms.TypedChoiceField(choices=[(20, 20), (33, 33)], coerce=int)

    class Meta:
        model = Truck
        fields = ["truck_id", "pallet_size", "zones"]
        truck_id = forms.CharField(label="Truck ID", required=True, )
        widgets = {
            'truck_id' : forms.Textarea(attrs={'placeholder':'Truck ID: AA000', 'rows':1, 'class':"form-control"}),
        }

    
class DriverForm(forms.ModelForm):
    class Meta:
        model = Driver
        fields = ["first_name", "last_name", "driver_id"]
        first_name = forms.CharField()
        last_name = forms.CharField()
        driver_id = forms.CharField()


class DestinationForm(forms.ModelForm):
    class Meta:
        model = Destination
        fields = ["destination_id", "address"]
        destinationid = forms.CharField()
        address = forms.CharField()



# API
def get_destination_list(request):
    # DOT: Check if the user sending request is a Planer?!
    destinations = list(Destination.objects.values('destination_id'))
    result = json.dumps(destinations)
    return  JsonResponse(result, safe=False)


@csrf_exempt
def reg_destination_plan(request):
    if request.method == 'POST':
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