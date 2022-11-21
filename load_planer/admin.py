from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(User)
admin.site.register(Driver)
admin.site.register(Profile)
admin.site.register(Truck)
admin.site.register(Destination)
admin.site.register(Delivery_plan)
admin.site.register(Tour)
admin.site.register(DeliveryPoint)