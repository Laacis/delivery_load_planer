document.addEventListener("DOMContentLoaded", function() {
    const sideBar = document.getElementById('new_tour_button_field');
    const newButton = document.createElement('button');
    newButton.classList = 'btn btn-success form-control';
    newButton.type = 'submit';
    newButton.textContent = "New Tour";
    
    sideBar.appendChild(newButton);
    newButton.addEventListener('click', function(){
        document.getElementById('view_date_input').disabled = true;
        newButton.disabled = true;
         document.getElementById('tour_display_list').replaceChildren();
        loadDeliveryPlanPart1();
    })
});

// globals :
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
    const ddpRow = document.createElement('row');
    ddpRow.classList = 'row g-2';
    ddpRow.id = "yRow_g2";
    formField.appendChild(ddpRow);

    //div here
    const dateDiv = document.createElement('div');
    dateDiv.classList = "col-md";
    ddpRow.appendChild(dateDiv);
    //form-floating div
    const dateDivFormF = document.createElement('div');
    dateDivFormF.classList = 'form-floating';
    dateDiv.appendChild(dateDivFormF);

    //select year
    const deliveryYearField = document.createElement('select');
    deliveryYearField.id = "delivery_plan_year";
    deliveryYearField.classList = "form-control";
    // creating label
    const dateLabel = document.createElement('label');
    dateLabel.for = "delivery_plan_year";
    dateLabel.classList = "form-label";
    dateLabel.innerHTML = 'Year:';

    // putting it together
    dateDivFormF.appendChild(deliveryYearField);
    dateDivFormF.appendChild(dateLabel)
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
    ddpRow.appendChild(driverDiv);
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
    driverLabel.innerHTML = 'Quarter:';

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
    loadButton.classList = 'btn btn-primary form-control';
    loadButton.type = 'submit';
    loadButton.textContent = "Load Plans";
    // going to set the button in the middle part
    const midField = document.getElementById('main_middle');
    midField.appendChild(loadButton);
    loadButton.addEventListener('click', function(){
        fetch(`/get_delivery_list_by_details/${deliveryYearField.value}/${driverIdField.value}`)
        .then(response => response.json())
        .then(data => {
            // returns a list of values from delivery_id, now push values into listDeliveryIds
            data = JSON.parse(data);
            data.forEach(element => {
                listDeliveryIds.push(element['delivery_id']);
            });
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

    // row here
    const ddpRow = document.createElement('row');
    ddpRow.classList = 'row g-2';
    ddpRow.id = "yRow_g2";
    formField.appendChild(ddpRow);

    //div here
    const dateDiv = document.createElement('div');
    dateDiv.classList = "col-md";
    ddpRow.appendChild(dateDiv);
    //form-floating div
    const dateDivFormF = document.createElement('div');
    dateDivFormF.classList = 'form-floating';
    dateDiv.appendChild(dateDivFormF);

    //select date
    const dateField = document.createElement('input');
    dateField.type = 'date';
    dateField.id = 'exec_date';
    dateField.classList = "form-control";
    dateField.placeholder = "select-date";
    dateField.min = new Date().toISOString().split('T')[0];

    // creating label
    const dateLabel = document.createElement('label');
    dateLabel.for = "exec_date";
    dateLabel.classList = "form-label";
    dateLabel.innerHTML = 'Select date:';

    // putting it together
    dateDivFormF.appendChild(dateField);
    dateDivFormF.appendChild(dateLabel)

    //div here
    const dplanDiv = document.createElement('div');
    dplanDiv.classList = "col-md";
    ddpRow.appendChild(dplanDiv);
    //form-floating div
    const dplanDivFormF = document.createElement('div');
    dplanDivFormF.classList = 'form-floating';
    dplanDiv.appendChild(dplanDivFormF);

    //select date
    const dpField = document.createElement('input');
    dpField.placeholder = 'AAAA01';
    dpField.type = 'text';
    dpField.id = 'delivery_id_field';
    dpField.classList = "form-control";
    const dpLabel = document.createElement('label');
    dpLabel.for = "exec_date";
    dpLabel.classList = "form-label";
    dpLabel.innerHTML = 'Delivery id:';

    // putting it together
    dplanDivFormF.appendChild(dpField);
    dplanDivFormF.appendChild(dpLabel)

    //adding event listeners to every input field of deliveryIdField
    dpField.addEventListener("keyup", suggestion_list);

    //adding ul field for destination list to display suggestions
    const destination_list = document.createElement('ul');
    destination_list.id = 'destination_list:';
    dplanDiv.appendChild(destination_list);

    const loadButton = document.createElement('button');
    loadButton.classList = 'btn btn-primary form-control';
    loadButton.type = 'submit';
    loadButton.textContent = "Load Plans";
    const rightField = document.getElementById('main_right');
    rightField.appendChild(loadButton);
    loadButton.addEventListener('click', function(){
        // let's checks if the delivery plan id is matching one from the list
        const checkingSet = new Set(listDeliveryIds);
        const isItemInSet = checkingSet.has(dpField.value);
        if (isItemInSet && dateField.value != "") {
            //if item is valid we disable the input fields, enamble button and listener
            dateField.disabled = true;
            dpField.disabled = true;
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
                dpField.focus();
                dpField.placeholder = "Valid Delivery plan id!";
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
    const ddpRow = document.createElement('row');
    ddpRow.classList = 'row g-2';
    ddpRow.id = "TruckRow_g2";
    formField.appendChild(ddpRow);
    
    //div here
    const dateDiv = document.createElement('div');
    dateDiv.classList = "col-md";
    ddpRow.appendChild(dateDiv);
    //form-floating div
    const dateDivFormF = document.createElement('div');
    dateDivFormF.classList = 'form-floating';
    dateDiv.appendChild(dateDivFormF);

    //select truck
    const truckId = document.createElement('select'); 
    truckId.id = 'truck_id';
    truckId.classList = "form-control";
    // creating label
    const dateLabel = document.createElement('label');
    dateLabel.for = "truck_id";
    dateLabel.classList = "form-label";
    dateLabel.innerHTML = 'Truck:';

    // putting it together
    dateDivFormF.appendChild(truckId);
    dateDivFormF.appendChild(dateLabel);

    /* here goes the same for the Driver select */
    //div here
    const driverDiv = document.createElement('div');
    driverDiv.classList = "col-md";
    ddpRow.appendChild(driverDiv);
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
    driverLabel.innerHTML = 'Driver:';

    driverDivFormF.appendChild(driverIdField);
    driverDivFormF.appendChild(driverLabel);

    // populate truckId and driverId with options from db
    loadSelectIdFields(); 
    
    // create button
    const loadPlanButton = document.createElement('button');
    loadPlanButton.classList = 'btn btn-secondary form-control';
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
            // itemList.classList.add(`item-list:`);
            itemList.classList = "list-group-item item-list:"
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

    //on chang listener for truck id
    const mainRIght = document.getElementById('main_right');
    const detailsDiv = document.createElement('div');
    detailsDiv.id = 'truck_details_divV';
    detailsDiv.classList = 'col text-center';
    detailsDiv.style.color = "green";
    mainRIght.appendChild(detailsDiv);
    truckId.addEventListener('change', (event) => {
        const truck_id = document.getElementById("truck_id").value
        fetch(`/get_truck_details/${truck_id}`)
        .then(response => response.json())
        .then(data => {
            detailsDiv.innerHTML = ""; //clean up.
            detailsDiv.innerHTML = `Truck: <b>${data['truck_id']}</b> load:<b> ${data['pallet_size']} </b>pallets, <b>${data['zones']}</b> temp. zones.`;
        })
    });
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
    tableField.classList = "table table-hover";
    formField.appendChild(tableField);
    // adding table head

    const tHeadd = document.createElement('thead');
    tableField.appendChild(tHeadd);
    const headerRow = document.createElement('tr');
    tHeadd.appendChild(headerRow);
    //creating headers for first row and appending to header row
    const listHeaders = ['Nr.', 'Destination', 'time', 'frozen', 'chilled', 'dry', 'total']
    const listInputCells = ['frozen', 'chilled', 'dry'];
    // generating row headders
    listHeaders.forEach(headder =>{
        const thElement = document.createElement('th');
        thElement.innerHTML = `${headder}`;
        headerRow.appendChild(thElement);
    })

    // creating tbody
    const tBodyF = document.createElement('tbody');
    tableField.appendChild(tBodyF);
    const details = 0;
    fetch(`/get_delivery_plan_list/${DeliveryPlanId.value}/${details}`)
    .then(response => response.json())
    .then(data => { 
        data = JSON.parse(data);
        Object.entries(data).forEach(entry => {
            const [key, value] = entry;
            const row = document.createElement('tr');
            row.id = `row:${value}`;
            tBodyF.appendChild(row);
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
                    aLink.classList = 'form-control';
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
                    inputField.classList = `pallets_in${value} form-control`;
                    inputField.placeholder = `0`;
                    // inputField.classList = "form-control";
                    cell.appendChild(inputField);
                    inputField.addEventListener('change', recountTotal);
                }
                else if (element === 'total'){
                    const inputField = document.createElement('strong');

                    inputField.id = `total:${value}`;
                    inputField.innerHTML = 0;
                    inputField.classList = "form-control";
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

