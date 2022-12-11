from django import forms
from .models import Truck, Driver, Destination

class TruckForm(forms.ModelForm):
    zones = forms.TypedChoiceField(choices=[(2, 2), (3, 3)], coerce=int)
    pallet_size = forms.TypedChoiceField(choices=[(20, 20), (14, 14)], coerce=int)
    truck_id = forms.CharField(label="", required=True, help_text="", )
    class Meta:
        model = Truck
        fields = ["truck_id", "pallet_size", "zones"]
        

    
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
        fields = ["destination_id", "address", "contact_number"]
        destinationid = forms.CharField()
        address = forms.CharField()
        contact_number = forms.CharField()

   