document.addEventListener("DOMContentLoaded", function() {
    console.log("LOADED!");
    loadDeliveryPlanPart1();
});

var listDeliveryIds = []

/* loads the first part of the Tour form:
    user has to select year and Quarter to load matching Delivery plans 
    for the selected period of Y/Q
*/
function loadDeliveryPlanPart1() {
    var formField = document.getElementById('tour_plan_form');
    const deliveryYearField = document.createElement('select');
    deliveryYearField.id = "delivery_plan_year";
    formField.appendChild(deliveryYearField);
    for (var i = 2022; i < 2025; i++) {
        const option = document.createElement('option')
        option.value = i;
        option.text = i;
        deliveryYearField.appendChild(option);
    }
    const deliveryQuarterField = document.createElement('select');
    deliveryQuarterField.id = "delivery_plan_quarter";
    formField.appendChild(deliveryQuarterField);
    for (var i = 1; i < 5; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = "Q"+i;
        deliveryQuarterField.appendChild(option);
    }
    // create and style button
    const loadButton = document.createElement('button');
    loadButton.classList = 'btn btn-primary';
    loadButton.type = 'submit';
    loadButton.textContent = "Load Plans";
    formField.appendChild(loadButton);
    loadButton.addEventListener('click', function(){
        fetch(`/get_delivery_list_by_details/${deliveryYearField.value}/${deliveryQuarterField.value}`)
        .then(response => response.json())
        .then(data => {
            // returns a list of values from delivery_id, now push values into listDeliveryIds
            data = JSON.parse(data);
            data.forEach(element => {
                listDeliveryIds.push(element);
            });
            console.log(listDeliveryIds);
            // when list is updated: create and update the form
            //disable selected fields
            deliveryYearField.disabled = true;
            deliveryQuarterField.disabled = true;
            loadButton.remove(); //remove button as we don't need it anymore
            loadDeliveryPlanPart2();
        })
    });
}

/* loads the second part of the Tour form: 
    loading date/delivery_id fields for the Tour to be executed
*/
function loadDeliveryPlanPart2() {
    console.log("loading second part of form.");
    const formField = document.getElementById('tour_plan_form');

    const deliveryIdField = document.createElement('input');
    deliveryIdField.placeholder = 'Delivery plan id: AAAA01';
    deliveryIdField.type = 'text';
    deliveryIdField.id = 'delivery_id_field';
    formField.appendChild(deliveryIdField);
    //adding event listeners to every input field of deliveryIdField
    deliveryIdField.addEventListener("keyup", suggestion_list);

    //adding ul field for destination list to display suggestions
    const destination_list = document.createElement('ul');
    destination_list.id = 'destination_list:';
    formField.appendChild(destination_list);

    const dateField = document.createElement('input');
    dateField.type = 'date';
    dateField.id = 'exec_date';
    dateField.placeholder = "select-date";
    dateField.min = new Date().toISOString().split('T')[0];
    formField.appendChild(dateField);

    const loadButton = document.createElement('button');
    loadButton.classList = 'btn btn-primary';
    loadButton.type = 'submit';
    loadButton.textContent = "Load Plans";

    formField.appendChild(loadButton);
    loadButton.addEventListener('click', function(){
        // let's checks if the delivery plan id is matching one from the list
        const checkingSet = new Set(listDeliveryIds);
        const isItemInSet = checkingSet.has(deliveryIdField.value);
        if (isItemInSet && dateField.value != "") {
            //if item is valid we disable the input fields, enamble button and listener
            dateField.disabled = true;
            deliveryIdField.disabled = true;
            loadButton.remove();
            loadDeliveryPlanPart3();
        }
        else {
            //if date was not chose set focus on it
            if(dateField.value === "") {
                dateField.focus();
            }
            else {
                //if delivery id not valid - set focus on it and write to console
                console.log("Wrong Delivery Plan ID!");
                deliveryIdField.focus();
                deliveryIdField.placeholder = "Valid Delivery plan id!";
            }
        }    
    })
}

/* loads the third part of the Tour form: */
function loadDeliveryPlanPart3() {
    const formField = document.getElementById('tour_plan_form');

    // create input field for Truck id
    const truckId = document.createElement('select'); 
    truckId.id = 'truck_id';
    formField.appendChild(truckId);
    const dOptionTruck = document.createElement('option');
    dOptionTruck.text = "select-truck";
    dOptionTruck.disabled = true;
    dOptionTruck.selected = true;
    truckId.appendChild(dOptionTruck);

    //create input field for driver id
    const driverId = document.createElement('select');
    driverId.id = 'driver_id';
    formField.appendChild(driverId);
    const dOption = document.createElement('option');
    dOption.text = "select-driver";
    dOption.disabled = true;
    dOption.selected = true;
    driverId.appendChild(dOption);

    // populate truckId and driverId with options from db
    loadSelectIdFields(); 
    // checking if users provided Delivery ID is in the list from db
    
    // create button
    const loadPlanButton = document.createElement('button');
    loadPlanButton.classList = 'btn btn-secondary';
    loadPlanButton.type = 'submit';
    loadPlanButton.textContent = "Load Delivery Plan";
    formField.appendChild(loadPlanButton);

    loadPlanButton.addEventListener('click', function(){
        //let's make sure driver/truck is selected
        if (!driverId.value.includes("select") && !truckId.value.includes("select")) {
            loadDeliveryPlanPart4();
        }
        else {
            console.log("Select driver and/or truck id!");
        }
    })  
}

function suggestion_list(event) {
    clean_list();
    for ( let item of listDeliveryIds){
        //convert to lover case and comapre to each item in destination list
        if (item.toLowerCase().startsWith( event.target.value.toLowerCase()) && event.target.value != "") { 
            let itemList = document.createElement("li");
            itemList.classList.add(`item-list:`);
            itemList.style.cursor = "pointer";
            itemList.setAttribute("onclick", `dispplayDestinations('${item}', '${event.target.id}')`);
            let match_d = "<b>" + item.substring(0, event.target.value.length) + "</b>";
            match_d += item.substring(event.target.value.length);
            itemList.innerHTML =  match_d;
            document.getElementById(`destination_list:`).appendChild(itemList);
        }
    }
}

function dispplayDestinations(value, id) {
    // sets up value  of input chosen by the user
    let input = document.getElementById(id);
    input.value = value;
    clean_list();
}

function clean_list() {
    // cleaning up the the list of destinations by removing all the <li>
    try {
        const items = document.querySelectorAll("li");
        items.forEach(item => item.remove());
    }
    catch {
        console.log("No list to clean!");
    }   
}

function loadSelectIdFields() {
    const truckId = document.getElementById('truck_id');
    const dateField = document.getElementById('exec_date').value;
    // dodulate options with driver_id that are not busy on selected date
    fetch(`/get_truck_list/${dateField}`)
    .then(response => response.json())
    .then(data => {
        data = JSON.parse(data);
        data.forEach(element => {
            const option = document.createElement('option');
            option.value = element;
            option.text = element;
            truckId.appendChild(option);
        })
    })

    //populates options with truck_id that are not busy on selected date
    const driverId = document.getElementById('driver_id');
    fetch(`/get_driver_list/${dateField}`)
    .then(response => response.json())
    .then(data => {
        data = JSON.parse(data);
        data.forEach(element => {
            const option = document.createElement('option');
            option.value = element;
            option.text = element;
            driverId.appendChild(option);
        })
    })

}

/* loads the forth part of the Tour form:
    This part will load data with destination points and delivery order
    after this data will be used to generate a table to fill out for 
    the selected tour.
*/
function loadDeliveryPlanPart4() {
    const formField = document.getElementById("tour_plan_form");

    const DeliveryPlanId = document.getElementById('delivery_id_field');  
    // checking if truck and Driver has been selected
    const tableField = document.createElement('table');
    tableField.style = "width:100%"
    formField.appendChild(tableField);
    const headerRow = document.createElement('tr');
    tableField.appendChild(headerRow);
    //creating headers for first row and appending to header row
    const listHeaders = ['Nr.', 'Destination', 'time', 'frozen', 'chilled', 'dry', 'total']
    const listInputCells = ['frozen', 'chilled', 'dry'];
    // generating row headders
    listHeaders.forEach(headder =>{
        const thElement = document.createElement('th');
        thElement.innerHTML = `${headder}`;
        headerRow.appendChild(thElement);
    })


    fetch(`/get_delivery_destinations/${DeliveryPlanId.value}`)
    .then(response => response.json())
    .then(data => { 
        data = JSON.parse(data);
        Object.entries(data).forEach(entry => {
            const [key, value] = entry
            const row = document.createElement('tr');
            row.id = `row:${value}`;
            tableField.appendChild(row);
            listHeaders.forEach(element => {
                const cell = document.createElement('td');
                if (element === 'Nr.') {cell.innerHTML = `${value}.`;}
                else if (element === 'Destination') {cell.innerHTML = key;}
                else if (element === 'time'){ 
                    const inputField = document.createElement('input');
                    inputField.type = "time";
                    inputField.id = `${element}:${value}`;
                    cell.appendChild(inputField);
                }
                else if (listInputCells.includes(element)) {
                    const inputField = document.createElement('input');
                    inputField.type = "number";
                    inputField.id = `${element}:${value}`;
                    inputField.placeholder = `pallets`;
                    cell.appendChild(inputField);
                }
                row.appendChild(cell);
            })
        })
    })


        

}
