from email.policy import default
from pyexpat import model
from random import choices
from unittest.util import _MAX_LENGTH
from django.db import models
from django.contrib.auth.models import AbstractUser

# Models

class User(AbstractUser):
    pass


class Truck(models.Model):
    truck_id = models.CharField(max_length=3, blank=False)  # Truck identification number in the organizetion
    zones = models.IntegerField(blank=False) # Reefer zones in the truck 
    pallet_count = models.IntegerField(blank=False)  # Number of palets in full load 


class Driver(models.Model):
    username = models.ForeignKey(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=30, blank=False) 
    last_name = models.CharField(max_length=30, blank=False)
    driver_id = models.CharField(max_length=3, blank=True) # driver_initials or driver ID
    is_planer = models.BooleanField(default=False)  # Admin can change this to True, to give planer access to user
    is_driver = models.BooleanField(default=False)  # Planer can change this to true, to verify driver