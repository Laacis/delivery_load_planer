document.addEventListener("DOMContentLoaded", function() {
    setPlaceholder();
    loadTruckList();
});

/** Fucntion adds form-control class to django form elements
 */
function setPlaceholder(){
    const idList = ['id_truck_id', 'id_pallet_size', 'id_zones'];
    idList.forEach(item => {
        const targetIt = document.getElementById(item);
        targetIt.classList.add('form-control');
    })

}

function loadTruckList() {
    console.log('loading list of trucks');
    fetch('/trucks_list')
    .then(response => response.json())
    .then(data => {
        data = JSON.parse(data);
        console.log(data);
    })
}