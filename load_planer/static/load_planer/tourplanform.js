document.addEventListener("DOMContentLoaded", function() {
    console.log("LOADED!");
    loadDeliveryPlanPart1();
});

var listDeliveryIds = []

/* */
function loadDeliveryPlanPart1() {
    console.log("loading Delivery Plan options: load year and quarter.");
    const formField = document.getElementById('tour_plan_form');
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
            loadButton.remove(); //remove button as we don't need it anymore
            loadDeliveryPlanPart2();
        })
    });
}

/* loads the second par of the Tour form: */
function loadDeliveryPlanPart2() {
    const formField = document.getElementById('tour_plan_form');
    // create input field for Delivery ID
    const destinationId = document.createElement('input');
    destinationId.placeholder = 'Delivery plan id: AAAA01';
    destinationId.type = 'text';
    destinationId.id = 'destination_id_field';
    formField.appendChild(destinationId);
    //adding event listeners to every input field of destinationId
    destinationId.addEventListener("keyup", suggestion_list);

    //adding ul field for destination list to display suggestions
    const destination_list = document.createElement('ul');
    destination_list.id = 'destination_list:';
    formField.appendChild(destination_list);

    // create input field for Truck id
    const truckId = document.createElement('input'); 
    truckId.placeholder = 'Truck id: AA000';
    truckId.type = 'text';
    truckId.id = 'truck_id';
    formField.appendChild(truckId);

    //create input field for driver id
    const driverId = document.createElement('input');
    driverId.placeholder = 'Driver id: AAA';
    driverId.type = 'text';
    driverId.id = 'driver_id';
    formField.appendChild(driverId);
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