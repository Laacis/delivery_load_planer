from django import forms
from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse

from .models import *

# Create your views here.

def index(request):
    tours = []
    return render(request, "load_planer/index.html", {"tours":tours})


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


def drivers(request):
    return render(request, 'load_planer/drivers.html')


def delivery_plans(request):
    return render(request, 'load_planer/delivery_plans.html')


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
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
        return HttpResponseRedirect(reverse("index"))
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