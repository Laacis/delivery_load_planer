from django.db import models
from django.contrib.auth.models import AbstractUser

# Models

class User(AbstractUser):
    def is_planner(self):
        try:
            planer = Profile.objects.get(username=self)
            return planer.is_planner
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
    is_planner = models.BooleanField(default=False)  # Admin can change this to True, to give planer access to user
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

    def serialize(self):
        return {
            'truck_id':self.truck_id,
            'pallet_size':self.pallet_size,
            'zones':self.zones
        }

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

    class YearChoices(models.IntegerChoices):
        Y2022 = 2022, "2022"
        Y2023 = 2023, "2023"
        Y2024 = 2024, "2024"

    delivery_id = models.CharField(max_length=30, blank=False, primary_key=True)
    quarter = models.PositiveSmallIntegerField(choices=Quarter.choices, default=Quarter.Q1)
    year = models.PositiveSmallIntegerField(choices=YearChoices.choices, default=YearChoices.Y2022)
    del_order = models.JSONField()

    def __str__(self):
        return f"Delivery ID: {self.delivery_id} Q:{self.quarter} Year:{self.year} number of destinations: {len(self.del_order)}"





"""
    TOUR model:
    Tour is a compiled data of Delivery plan, executed on a special date
    it has a defined Driver and a Truck
    To the Delivery Plan is add information about Palets for each Destination(delivery plan order sequence)
    Palets are 3 type: 
    (f) Frozen goods, -22 C
    (c) Chilled goods +2 C
    and (d) Dry goods (may be stored with chilled goods)

    #####
    tour_id = PK   let's agree we construct it as (delivery_id + exec_date)
    delivery_id = FK from Delivery_plan
    driver_id = FK from Driver 
    truck_id = FK from Truck
    exec_date = Date of Tour execution
"""
class Tour(models.Model):
    tour_id = models.CharField(max_length=30, blank=False, primary_key=True)
    delivery_id = models.ForeignKey(Delivery_plan, on_delete=models.CASCADE)
    driver_id = models.ForeignKey(Driver, on_delete=models.CASCADE)
    truck_id = models.ForeignKey(Truck, on_delete=models.CASCADE)
    exec_date = models.DateField()

    
    def __str__(self):
        return f"delivery:{self.delivery_id} on {self.exec_date} driver {self.driver_id} on truck {self.truck_id}."

    def serialize(self):
        # destination counte returns number of destinations having this Tour_id
        destination_count = DeliveryPoint.objects.filter(tour_id = self.tour_id).count()
        return {
            'tour_id':self.tour_id,
            'delivery_id':self.delivery_id.delivery_id,
            'driver_id':self.driver_id.driver_id,
            'truck_id':self.truck_id.truck_id,
            'destination_count': destination_count,
        }

"""
DeliveryPoint 
    tour_id = FK from Tour
    delivery_time = Time the destination should be reached and goods unloaded
    destination = FK from Destination
    f_pallets = Number of FROZEN GOODS EUROpallets
    c_pallets = Number of CHILLED GOODS EUROpallets
    d_pallets = Number of DRY GOODS EUROpallets

"""
class DeliveryPoint(models.Model):
    tour_id = models.ForeignKey(Tour, on_delete=models.CASCADE)
    delivery_time = models.TimeField()
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE)
    f_pallets = models.PositiveSmallIntegerField()
    c_pallets = models.PositiveSmallIntegerField()
    d_pallets = models.PositiveSmallIntegerField()
