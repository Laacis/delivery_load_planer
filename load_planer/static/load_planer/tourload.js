document.addEventListener("DOMContentLoaded", function() {
    console.log("LOADED!");
    createTourDetailsStruct();
});

/** this function is loading the details about the Tour in general
 * like details whos the driver, what Truck, later some aditional 
 * information about the Load will be add
 */
function createTourDetailsStruct() {
    //finding the div to start building
    const containerDiv = document.getElementById('tour_details_container');
    const rowDiv = document.createElement('div');
    rowDiv.classList = 'row';
    containerDiv.appendChild(rowDiv);

    const clList = {'main':'col-12 col-md-8', 'side':'col-6 col-md-4'}
    Object.entries(clList).forEach(entry => {
        const [key, value] = entry;
        const colDiv = document.createElement('div');
        colDiv.classList = value;
        colDiv.id = key;
        colDiv.innerHTML = value;
        rowDiv.appendChild(colDiv);
    })
    loadTourData();
}

/** this function fetches Tour data from db */
function loadTourData() {
    // fetching data bout the Tour
    const tourId = document.getElementById('tour_id_field').innerHTML;
    fetch(`/get_tour_details/${tourId}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const sideDetList = ['driver_id', 'truck_id']
        const sideDiv = document.getElementById('side');
        Object.entries(data).forEach(entry => {
            const [key, value] = entry;
            if (sideDetList.includes(key)){
                console.log(value);
            }
        })

    })

}