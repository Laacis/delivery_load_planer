from django.db import models
from django.contrib.auth.models import AbstractUser

# Models

class User(AbstractUser):
    def is_planer(self):
        try:
            planer = Profile.objects.get(username=self)
            return planer.is_planer
        except:
            return False

    def is_driver(self):
        try:
            driver = Profile.objects.get(username=self)
            return driver.is_driver
        except:
            return False
        

class Driver(models.Model):
    username = models.ForeignKey(User, on_delete=models.CASCADE)
    first_name = models.CharField(max_length=30, blank=False) 
    last_name = models.CharField(max_length=30, blank=False)
    driver_id = models.CharField(max_length=3, blank=False, primary_key=True) # driver_initials or driver ID

    def __str__(self):
        return f"user: {self.username} is {self.first_name} {self.last_name} and has driver ID: {self.driver_id}"

    def uid(self):
        user = User.objects.get(pk=self.username.id)
        return user.id


class Profile(models.Model):
    username = models.ForeignKey(User, on_delete=models.CASCADE)
    is_planer = models.BooleanField(default=False)  # Admin can change this to True, to give planer access to user
    is_driver = models.BooleanField(default=False)  # Planer can change this to true, to verify driver
    
    def __str__(self):
        if self.is_driver == False:
            return f"Driver with id: {self.username} is NOT verified as Driver."
        else:
            return f"Driver with id: {self.username} is verified as Driver."
        


class Truck(models.Model):
    # All trucks are Reefers, have 2 or 3 zones of temperature control
    truck_id = models.CharField(max_length=5, primary_key=True) # Truck identicifation number for inner audit, not Number plates
    pallet_size = models.IntegerField(blank=False) # Number of EUROPALLETS full load 
    zones = models.IntegerField(blank=False) # Number of temperature controll zones(2 or 3)

    def __str__(self):
        return f"Reefer truck with id: {self.truck_id} fits {self.pallet_size} pallets and has {self.zones} temperature zones."


class Destination(models.Model):
    destination_id = models.CharField(max_length=30, blank=False, unique=True)
    address = models.CharField(max_length=90, blank=False) 
    # Add more detailed address fields if you need to, since this project is not going to have map related components - I don't need more details

    def __str__(self):
        return f"id: {self.destination_id} and address {self.address}."


class Delivery_plan(models.Model):
    # sequesnce of Destinations to build a delivery route
    # Delivery plans are made for a period of 3-4 month, to keep a stable schedule for the customers
    # For this project we're going to use Q1 to Q4 asd Quarters for delivery plans
    class Quarter(models.IntegerChoices):
        Q1 = 1, "'Q1' 01.01 - 31.03"
        Q2 = 2, "'Q2' 01.04 - 31.06"
        Q3 = 3, "'Q3' 01.07 - 30.09"
        Q4 = 4, "'Q4' 01.10 - 31.12"

    delivery_id = models.CharField(max_length=30, blank=False)
    querter = models.PositiveSmallIntegerField(choices=Quarter.choices, default=Quarter.Q1)
    year = models.PositiveSmallIntegerField()
    # del_order is delivery order sequesnce
    del_order = models.PositiveSmallIntegerField()
    del_loc = models.ForeignKey(Destination, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("del_order", "del_loc")

    def __str__(self):
        return f"Delivery ID: {self.delivery_id} Q: {self.querter} Y:{self.year} odrer NR:{self.del_order} destination: {self.del_loc}"
