document.addEventListener("DOMContentLoaded", function() {
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
    // Object.entries(clList).forEach(entry => {
    //     const [key, value] = entry;
    //     const colDiv = document.createElement('div');
    //     colDiv.classList = value;
    //     colDiv.id = key;
    //     cardDiv.appendChild(colDiv);
    // })
    createMyDivs(clList, cardDiv)
    const tourId = document.getElementById('tour_id_field');
    document.getElementById('tour_id_field_div').style.display = 'none';
    loadTourData(tourId.innerHTML);
}

/** this function fetches Tour data from db 
 * and creates a Bootstrap Card for the Tour details fetched
*/
function loadTourData(tourId) {
    // fetching data bout the Tour
    
    fetch(`/get_tour_details/${tourId}`)
    .then(response => response.json())
    .then(data => {
        if ('error' in data) {
            document.getElementById('main').innerHTML = data['error'];
            return;
        }
        else {
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
            cardBody.id = 'cardbody';
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
                    // creating li for every entry
                    const liElement = document.createElement('li');
                    liElement.classList = 'list-group-item';
                    liElement.innerHTML = `${sideDetDict[key]} ${value}`;
                    listGr.appendChild(liElement);
                    
                }
            })
            // Load the list of destinations
            loadDestinationList(data['tour_id'], data['destination_count'], data['truck_id']);
        }
    })
}

/** this fucntions creates a table of destination point = destinations
 * and generates schema for pallets visualization based on truck_id
 */
function loadDestinationList(tour_id, destinations, truck_id) {
    const mainCont = document.getElementById('load_details_container');
    // add a row and children div x2  for Truck load and Delivery points
    const detailRow = document.createElement('div');
    detailRow.classList = 'row';
    mainCont.appendChild(detailRow);

    const dictToLoad = {'truck_field':'col-6 col-md-4', 'delivery_points':'col-12 col-md-8'}
    createMyDivs(dictToLoad, detailRow);

    const deliveryDiv = document.getElementById('delivery_points');
    const listTableHeaders = ['Nr.', 'Destination', 'time', 'frozen', 'chilled', 'dry', 'total']
    //create a table
    const tableT = document.createElement('table');
    tableT.classList = 'table table-hover';
    deliveryDiv.appendChild(tableT);
    const tHead = document.createElement('thead');
    tableT.appendChild(tHead);
    const tBody = document.createElement('tbody');
    tableT.appendChild(tBody)
    for (let i = 0; i <= destinations; i++) {
        if (i == 0){
            //create Table head and headder row
            
            const headR = document.createElement('tr');
            tHead.appendChild(headR);
            listTableHeaders.forEach(item => {
                const tHeadEl = document.createElement('th');
                tHeadEl.scope = 'col';
                tHeadEl.innerHTML = item;
                headR.appendChild(tHeadEl);
            })

        }
        else {
            const tRoww = document.createElement('tr');
            tBody.appendChild(tRoww);
            listTableHeaders.forEach(item => {
                const tdElement = document.createElement('td');
                (item == 'Nr.') ? tdElement.innerHTML = `${i}.` : tdElement.innerHTML = item;
                tdElement.id = `${item}:${i}`;
                tRoww.appendChild(tdElement);
            })
        }
    }

    /** fetch data about truck: zones adn pallet_size
     * use this data to generate Turck load simulation
     */
    
    fetch(`/get_truck_details/${truck_id}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        const truckField = document.getElementById('truck_field');
        const truckDivcont = document.createElement('div');
        truckDivcont.style = 'border:1px solid black;';
        truckField.appendChild(truckDivcont);
        if ('error' in data) {
            truckField.innerHTML = data['error'];
            return;
        }
        else {
            // we get keys: truck_id, pallet_size, zones 
            const pallet_size = data['pallet_size'];
            const zones = data['zones'];
            const truckHeadRow = document.createElement('div');
            truckHeadRow.classList = 'row';
            truckDivcont.appendChild(truckHeadRow);
            const truckHeadDiv = document.createElement('div');
            truckHeadDiv.innerHTML = `Truck ${data['truck_id']} fit ${pallet_size} and has ${zones} temperature zones.`;
            truckDivcont.appendChild(truckHeadDiv);

            //generate truck pallet cells
            generateTruckCells(pallet_size, zones);
        }
        // populate the table with data from db
        populateDetailsDelPoints(tour_id);
    })

}

/** function generates two Div and appendChild them to given div.row */
function createMyDivs(dictionary_f, parentRow) {
    Object.entries(dictionary_f).forEach(entry => {
        const [key, value] = entry;
        const colDiv = document.createElement('div');
        colDiv.classList = value;
        colDiv.innerHTML = value;
        colDiv.id = key;
        parentRow.appendChild(colDiv);
    })
}

/** function generates pallet cells inside the truck/Reefer 
 * takes two arguments: pallet_size and zones
 * structure for every line is:
 * <row .row g-2><div .col-md><div .form-floating> <div r(nr)_(r or l )>+LABEL</...
*/
function generateTruckCells(pallet_size, zones) {
    //Nr of rows = pallet_size/2
    const truckField = document.getElementById('truck_field');
        // div to set up border 
        const borderDiv = document.createElement('div');
        borderDiv.style = 'border:5px solid black; padding: 0.2rem';
        truckField.appendChild(borderDiv);
    for ( let i = 1; i <= pallet_size/2; i++) {
        const rowG2 = document.createElement('row');
        rowG2.classList = 'row g-2';
        borderDiv.appendChild(rowG2);

        // pallets in row: <div #r(nr)_l> <div #r(nr)_r>
        const solu_rl = ['l','r'];
        solu_rl.forEach(item => {
            const divCol = document.createElement('div');
            divCol.classList = 'col-md';
            rowG2.appendChild(divCol);
            const divFFl = document.createElement('div');
            divFFl.classList = 'form-floating';
            divCol.appendChild(divFFl);
            const r_l = document.createElement('div');
            r_l.id = `r${i}_${item}`;
            r_l.classList = 'form-control';
            divFFl.appendChild(r_l);
            const label_r_l = document.createElement('label');
            label_r_l.for = `r${i}_${item}`;
            label_r_l.classList = 'form-label';
            label_r_l.innerHTML = 'destination_id'; // change this later
            divFFl.appendChild(label_r_l);
        })
    }
}


/** function fetches data from db and populates the table od Destinations
 * 
 */
function populateDetailsDelPoints(tour_id) {


    fetch(`/get_delivery_point_table/${tour_id}`)
    .then(response => response.json())
    .then(data => {
        //console.log(data);
        Object.entries(data).forEach(entry => {
            const [key, value] = entry;
            //console.log(value);
            const rowNr = key;
            let totalRowWalue = document.getElementById(`total:${rowNr}`);
            let totalValueInt = 0;
            
            Object.entries(value).forEach(entry => {
                const [key, value] = entry
                //console.log(key);
                // td id = key:rowNr
                const targetTd = document.getElementById(`${key}:${rowNr}`);
                targetTd.innerHTML = value;
                
                
                if (['frozen', 'chilled', 'dry'].includes(key)) {
                    totalValueInt += value;
                    console.log(totalValueInt);
                }

            })
            //updating total value
            totalRowWalue.innerHTML = totalValueInt;
                
        })
            
    })
}