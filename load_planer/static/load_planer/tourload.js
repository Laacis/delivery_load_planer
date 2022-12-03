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
    const cardDiv = document.createElement('div');
    cardDiv.classList = 'row';
    containerDiv.appendChild(cardDiv);

    const clList = {'main':'col-12 col-md-8', 'side':'col-6 col-md-4'}
    Object.entries(clList).forEach(entry => {
        const [key, value] = entry;
        const colDiv = document.createElement('div');
        colDiv.classList = value;
        colDiv.id = key;
        colDiv.innerHTML = value;
        cardDiv.appendChild(colDiv);
    })
    loadTourData();
}

/** this function fetches Tour data from db 
 * and creates a Bootstrap Card for the Tour details fetched
*/
function loadTourData() {
    // fetching data bout the Tour
    const tourId = document.getElementById('tour_id_field').innerHTML;
    fetch(`/get_tour_details/${tourId}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const sideDetDict = {
            'delivery_id':"Delivery:", 
            'driver_id':'Driver:', 
            'truck_id': 'Truck:',
            'destination_count':'Number of destinations:'
        };
        const mainDiv = document.getElementById('main');

        const cardDiv = document.createElement('div');
        cardDiv.classList = 'card text-center';
        // cardDiv.style = 'width: 18rem;';
        mainDiv.appendChild(cardDiv);

        const cardHead = document.createElement('div');
        cardHead.classList = 'card-header';
        cardHead.innerHTML = 'Tour details';
        cardHead.id = 'card_header'
        cardDiv.appendChild(cardHead);

        const cardBody = document.createElement('div');
        cardBody.classList = 'card-body';
        cardBody.id = 'card_body';
        cardDiv.appendChild(cardBody);

        // card title 
        const cardTitle = document.createElement('h5');
        cardTitle.classList = 'card-title';
        cardTitle.innerHTML = `Tour id: ${data['tour_id']}`;
        cardBody.appendChild(cardTitle);


        // creating group list for details
        const listGr = document.createElement('ul');
        listGr.classList = 'list-group list-group-flush';
        cardBody.appendChild(listGr);


        Object.entries(data).forEach(entry => {
            const [key, value] = entry;
            if (key in sideDetDict){
                console.log(sideDetDict[key]);
                // creating li for every entry
                const liElement = document.createElement('li');
                liElement.classList = 'list-group-item';
                liElement.innerHTML = `${sideDetDict[key]} ${value}`;
                listGr.appendChild(liElement);
                
            }
        })

    })

}