document.addEventListener("DOMContentLoaded", function() {
    setPlaceholder();
});

function setPlaceholder(){
    const charFIeldId = document.getElementById('id_truck_id');
    charFIeldId.setAttribute('placeholder', "Truck ID");
    charFIeldId.classList.add('form-control');

    const PalSize = document.getElementById('id_pallet_size');
    PalSize.classList.add('form-control');

    const zonesId = document.getElementById('id_zones');
    zonesId.classList.add('form-control');


}