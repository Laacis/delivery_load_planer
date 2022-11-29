document.addEventListener("DOMContentLoaded", function() {
    const sideBar = document.getElementById('sidebar_left');
    const newButton = document.createElement('button');
    newButton.classList = 'btn btn-success';
    newButton.type = 'submit';
    newButton.textContent = "New Tour";
    sideBar.appendChild(newButton);
    newButton.addEventListener('click', function(){

        newButton.disabled = true;
        loadDeliveryPlanPart1();
    })


    
});

var listDeliveryIds = []

/* loads the first part of the Tour form:
    user has to select year and Quarter to load matching Delivery plans 
    for the selected period of Y/Q

    Going to put row inside "main_left" then a div"col-md" and that 
    inside div"form-floating" inside that input field and label for 
    select of year, same for quarter
*/
function loadDeliveryPlanPart1() {
    const formField = document.getElementById('main_left');
    // row here
    const yqRow = document.createElement('row');
    yqRow.classList = 'row g-2';
    yqRow.id = "yRow_g2";
    formField.appendChild(yqRow);

    //div here
    const truckDiv = document.createElement('div');
    truckDiv.classList = "col-md";
    yqRow.appendChild(truckDiv);
    //form-floating div
    const truckDivFormF = document.createElement('div');
    truckDivFormF.classList = 'form-floating';
    truckDiv.appendChild(truckDivFormF);

    //select year
    const deliveryYearField = document.createElement('select');
    deliveryYearField.id = "delivery_plan_year";
    deliveryYearField.classList = "form-control";
    // creating label
    const truckLabel = document.createElement('label');
    truckLabel.for = "delivery_plan_year";
    truckLabel.classList = "form-label";
    truckLabel.innerHTML = 'Choose Year:';

    // putting it together
    truckDivFormF.appendChild(deliveryYearField);
    truckDivFormF.appendChild(truckLabel)
    for (var i = 2022; i < 2025; i++) {
        const option = document.createElement('option')
        option.value = i;
        option.text = i;
        deliveryYearField.appendChild(option);
    }
    /* here goes the same for the Quarter select */
    //div here
    const driverDiv = document.createElement('div');
    driverDiv.classList = "col-md";
    yqRow.appendChild(driverDiv);
    //form-floating div
    const driverDivFormF = document.createElement('div');
    driverDivFormF.classList = 'form-floating';
    driverDiv.appendChild(driverDivFormF);

    // select quarter
    const driverIdField = document.createElement('select');
    driverIdField.id = "delivery_plan_quarter";
    driverIdField.classList = "form-control";
    // creating label
    const driverLabel = document.createElement('label');
    driverLabel.for = "delivery_plan_quarter";
    driverLabel.classList = "form-label";
    driverLabel.innerHTML = 'Choose Quarter:';

    driverDivFormF.appendChild(driverIdField);
    driverDivFormF.appendChild(driverLabel);
    //yqDiv.appendChild(driverIdField);
    for (var i = 1; i < 5; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = "Q"+i;
        driverIdField.appendChild(option);
    }
    // create and style button
    const loadButton = document.createElement('button');
    loadButton.classList = 'btn btn-primary';
    loadButton.type = 'submit';
    loadButton.textContent = "Load Plans";
    formField.appendChild(loadButton);
    loadButton.addEventListener('click', function(){
        fetch(`/get_delivery_list_by_details/${deliveryYearField.value}/${driverIdField.value}`)
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
            driverIdField.disabled = true;
            loadButton.remove(); //remove button as we don't need it anymore
            loadDeliveryPlanPart2();
        })
    });
}

/* loads the second part of the Tour form: 
    loading date/delivery_id fields for the Tour to be executed
*/
function loadDeliveryPlanPart2() {
    
    const formField = document.getElementById('main_middle');

    const pdDiv = document.createElement('div');
    //pdDiv.classList = "text-end";
    formField.appendChild(pdDiv);

    const pdLabel = document.createElement('label');
    pdLabel.for = "exec_date";
    pdLabel.classList = "form-label";
    pdLabel.innerHTML = 'Select date and Delivery Plan:';


    const dateField = document.createElement('input');
    dateField.type = 'date';
    dateField.id = 'exec_date';
    dateField.placeholder = "select-date";
    dateField.min = new Date().toISOString().split('T')[0];
    pdDiv.appendChild(pdLabel);
    pdDiv.appendChild(dateField);

    const deliveryIdField = document.createElement('input');
    deliveryIdField.placeholder = 'Delivery plan id: AAAA01';
    deliveryIdField.type = 'text';
    deliveryIdField.id = 'delivery_id_field';

    pdDiv.appendChild(document.createElement('br'));
    pdDiv.appendChild(deliveryIdField);
    //adding event listeners to every input field of deliveryIdField
    deliveryIdField.addEventListener("keyup", suggestion_list);

    //adding ul field for destination list to display suggestions
    const destination_list = document.createElement('ul');
    destination_list.id = 'destination_list:';
    pdDiv.appendChild(destination_list);



    const loadButton = document.createElement('button');
    loadButton.classList = 'btn btn-primary';
    loadButton.type = 'submit';
    loadButton.textContent = "Load Plans";

    pdDiv.appendChild(loadButton);
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

/* loads the third part of the Tour form: 
    giving select fields for Driver/Truck id to select
    loadSelectedFields() function fetches the options from db
*/
function loadDeliveryPlanPart3() {
    const formField = document.getElementById('main_right');
    // row here
    const yqRow = document.createElement('row');
    yqRow.classList = 'row g-2';
    yqRow.id = "TruckRow_g2";
    formField.appendChild(yqRow);
    
    //div here
    const truckDiv = document.createElement('div');
    truckDiv.classList = "col-md";
    yqRow.appendChild(truckDiv);
    //form-floating div
    const truckDivFormF = document.createElement('div');
    truckDivFormF.classList = 'form-floating';
    truckDiv.appendChild(truckDivFormF);

    //select truck
    const truckId = document.createElement('select'); 
    truckId.id = 'truck_id';
    truckId.classList = "form-control";
    // creating label
    const truckLabel = document.createElement('label');
    truckLabel.for = "truck_id";
    truckLabel.classList = "form-label";
    truckLabel.innerHTML = 'Select Truck:';

    // putting it together
    truckDivFormF.appendChild(truckId);
    truckDivFormF.appendChild(truckLabel);

    // options for truckId
    // const dOptionTruck = document.createElement('option');
    // dOptionTruck.text = "";
    // dOptionTruck.disabled = true;
    // dOptionTruck.selected = true;
    // truckId.appendChild(dOptionTruck);

    /* here goes the same for the Driver select */
    //div here
    const driverDiv = document.createElement('div');
    driverDiv.classList = "col-md";
    yqRow.appendChild(driverDiv);
    //form-floating div
    const driverDivFormF = document.createElement('div');
    driverDivFormF.classList = 'form-floating';
    driverDiv.appendChild(driverDivFormF);

    // select quarter
    const driverIdField = document.createElement('select');
    driverIdField.id = "driver_id";
    driverIdField.classList = "form-control";
    // creating label
    const driverLabel = document.createElement('label');
    driverLabel.for = "driver_id";
    driverLabel.classList = "form-label";
    driverLabel.innerHTML = 'Choose Driver:';

    driverDivFormF.appendChild(driverIdField);
    driverDivFormF.appendChild(driverLabel);


    ///////////////////////////////////////
    //create input field for driver id
    // const driverId = document.createElement('select');
    // driverId.id = 'driver_id';
    // formField.appendChild(driverId);
    // const dOption = document.createElement('option');
    // dOption.text = "select-driver";
    // dOption.disabled = true;
    // dOption.selected = true;
    // driverId.appendChild(dOption);

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
        loadDeliveryPlanPart4();
        loadPlanButton.remove();
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
        const ulList = document.getElementById(`destination_list:`);
        while (ulList.firstChild) {ulList.removeChild(ulList.firstChild);}

    }
    catch {
        console.log("No list to clean!");
    }   
}

function loadSelectIdFields() {
    const truckId = document.getElementById('truck_id');
    const dateField = document.getElementById('exec_date').value;
    // populate options with driver_id that are not busy on selected date
    fetch(`/get_truck_list/${dateField}`)
    .then(response => response.json())
    .then(trucks_data => {
        trucks_data = JSON.parse(trucks_data);
        trucks_data.forEach(element => {
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
    .then(drivers_data => {
        drivers_data = JSON.parse(drivers_data);
        drivers_data.forEach(element => {
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
    //tableField.style = "width:100%"
    tableField.id = 'tour_table';
    tableField.classList = "table table-striped";
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
                if (element === 'Nr.') {
                    cell.innerHTML = `${value}.`;
                    cell.id = `${element}:${value}`;
                }
                else if (element === 'Destination') {
                    
                    const aLink = document.createElement('a');
                    aLink.href = `/destination/${key}`;
                    aLink.target = "_blank";
                    aLink.innerHTML = key;
                    aLink.id = `${element}:${value}`;
                    cell.appendChild(aLink);
                }
                else if (element === 'time'){ 
                    const inputField = document.createElement('input');
                    inputField.type = "time";
                    inputField.id = `${element}:${value}`;
                    inputField.classList = "form-control";
                    cell.appendChild(inputField);
                }
                else if (listInputCells.includes(element)) {
                    const inputField = document.createElement('input');
                    inputField.type = "number";
                    inputField.id = `${element}:${value}`;
                    inputField.classList = `pallets_in${value}`;
                    inputField.placeholder = `0`;
                    inputField.classList = "form-control";
                    cell.appendChild(inputField);
                    inputField.addEventListener('change', recountTotal);
                }
                else if (element === 'total'){
                    const inputField = document.createElement('p');
                    inputField.id = `total:${value}`;
                    inputField.innerHTML = 0;
                    cell.appendChild(inputField);
                }
                row.appendChild(cell);
            })
        })
    })
    submitTourPlaningForm();
}

function recountTotal(event) {
    const rowNumber = event.target.parentElement.parentElement.id.slice(4);
    //check values of all class pallets_in{rowNumber} and update the value of total:{rownumber}
    const total = document.getElementById(`total:${rowNumber}`);
    const palletCount = document.querySelectorAll(`.pallets_in${rowNumber}`);
    let totalNumberOfPallets = 0;

    for ( var i = 0; i<palletCount.length; i++) {
        if (palletCount[i].value === "") {
            palletCount[i].value = 0;
        }
        totalNumberOfPallets += parseInt(palletCount[i].value);
    }
    total.innerHTML = totalNumberOfPallets;
}

