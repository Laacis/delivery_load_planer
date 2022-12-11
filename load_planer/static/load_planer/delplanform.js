document.addEventListener("DOMContentLoaded", function() {
    var form_field = document.querySelector('#delivery_plan_form');
    create_form(form_field);
    hideForm();
    loadButtons();
});
// list of destinations todisplay in the form
var destination_list =[]


/** function generates select and button for Filter Delivery plan 
 * aswell as for New Delivery plan creating form.
 * FIlter will fetch list of JSON of deliveries based on year/quarter
 * request, that will be handed over to function creating the table of 
 * delivery flan filter result.
 * New delivery plan button, hides the filter Div and display Form div.
 */
function loadButtons() {
    // Filter select and buttons here 
    const filterDiv = document.getElementById('filter_row');
    const lifterTextDiv = document.createElement('h6');
    lifterTextDiv.innerHTML = "Filter Delivery plans:";
    filterDiv.appendChild(lifterTextDiv);
    // row here
    const ddpRow = document.createElement('row');
    ddpRow.classList = 'row';
    ddpRow.id = "yRow_g2";
    filterDiv.appendChild(ddpRow);

    //div here
    const dateDiv = document.createElement('div');
    dateDiv.classList = "col-md mb-2";
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
    const quarterField = document.createElement('select');
    quarterField.id = "delivery_plan_quarter";
    quarterField.classList = "form-control";
    // creating label
    const driverLabel = document.createElement('label');
    driverLabel.for = "delivery_plan_quarter";
    driverLabel.classList = "form-label";
    driverLabel.innerHTML = 'Quarter:';

    driverDivFormF.appendChild(quarterField);
    driverDivFormF.appendChild(driverLabel);
    //yqDiv.appendChild(quarterField);
    for (var i = 1; i < 5; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = "Q"+i;
        quarterField.appendChild(option)
    }
    // create and style button
    const loadButton = document.createElement('button');
    loadButton.classList = 'btn btn-primary form-control';
    loadButton.type = 'submit';
    loadButton.textContent = "Load Plans";
    filterDiv.appendChild(loadButton);
    loadButton.addEventListener('click', function(){
        //clear the list
        listDeliveryIds = [];
        fetch(`/get_delivery_list_by_details/${deliveryYearField.value}/${quarterField.value}`)
        .then(response => response.json())
        .then(data => {
            // returns a list of values from delivery_id, now push values into listDeliveryIds
            data = JSON.parse(data);
            data.forEach(element => {
                listDeliveryIds.push(element);
            });

            // wipe prevoius data

            // load results and display
            displayFilterResults(listDeliveryIds);

        })
    });
    // new Delivery plan buttons and other items HERE
    const newDpDiv = document.getElementById('new_dp_row');

    const newTextDiv = document.createElement('h6');
    newTextDiv.innerHTML = "Create new Delivery Plan:";
    newDpDiv.appendChild(newTextDiv);

    const newButton = document.createElement('button');
    newButton.classList = 'btn btn-success';
    newButton.innerText = 'Create New Plan';
    newDpDiv.appendChild(newButton);
    newButton.addEventListener('click', function(){
        const formDiv = document.getElementById('delivery_plan_form');
        formDiv.style.display = 'block';
        const listDiv = document.getElementById('dp_list_div');
        listDiv.style.display = 'none';
    })
}

function hideForm() {
    const formDiv = document.getElementById('delivery_plan_form');
    formDiv.style.display = 'none';
}


function create_form(form_field){
    // delivery_id field
    const del_id_f = document.createElement('input');
    del_id_f.id = "delivery_id";
    del_id_f.type = 'text';
    form_field.appendChild(del_id_f);

    // Quarter field
    const quater_f = document.createElement('select');
    quater_f.id = "quarter";
    form_field.appendChild(quater_f);
    for ( var i = 1; i < 5; i++) {
        var option = document.createElement('option')
        option.value = i;
        option.text = "Q"+i;
        quater_f.appendChild(option);
    }
    // Year field
    const year_f = document.createElement('select');
    year_f.id = "year";
    form_field.appendChild(year_f);
    for ( var i = 2022; i < 2025; i++) {
        var option = document.createElement('option')
        option.value = i;
        option.text = i;
        year_f.appendChild(option);
    }

    // Let user choose  number of destinations to generate input+texarea * number
    const destination_choice = document.createElement('select');
    form_field.appendChild(destination_choice);
    for (var i = 1; i < 20; i++) {
        var option = document.createElement('option');
        option.value = i;
        option.text = i;
        destination_choice.appendChild(option);
    }
    const button_f_request = document.createElement('button');
    button_f_request.classList = 'btn btn-secondary';
    button_f_request.type = 'submit';
    button_f_request.textContent = "Request form";
    button_f_request.id = "request_field_btn";
    form_field.appendChild(button_f_request);
    button_f_request.addEventListener('click', function() {
        const extra_fields = document.createElement('div');
        extra_fields.id = "delivery_plan_extra_fields";
        extra_fields.textContent = "extra field";
        form_field.append(extra_fields);
        for (var i = 0; i < destination_choice.value; i++) {
            const set_div = document.createElement('div');
            set_div.id = `destination_div_id:${i+1}`;
            extra_fields.appendChild(set_div);
            // Creating Select element for delivery order sequesnce
            const dest_order = document.createElement('select');
            dest_order.id = `destination_select_id:${i+1}`;
            set_div.appendChild(dest_order);
            var option = document.createElement('option');
            option.value = i+1;
            option.text = i+1;
            option.selected = i+1;
            option.disabled = true;
            dest_order.appendChild(option);
            // Creating input text for Destination id
            const destination_id = document.createElement('input');
            destination_id.type = 'text';
            destination_id.id = `destination_field_id:${i+1}`;
            set_div.appendChild(destination_id);
            //adding event listeners to every input field of destination_id
            destination_id.addEventListener("keyup", suggestion_list);

            //adding ul field for destination list to display suggestions
            const destination_list = document.createElement('ul');
            destination_list.id = `destination_list:${i+1}`;
            set_div.appendChild(destination_list);
            
        }
        //cleaning up button and choice field
        button_f_request.remove();
        destination_choice.remove();
        
        // Loading destinations
        load_list();

        // button field
        const Plan_submit_button = document.createElement('button');
        Plan_submit_button.classList = 'btn btn-primary';
        Plan_submit_button.type = 'submit';
        Plan_submit_button.textContent = "Submit Plan";
        form_field.appendChild(Plan_submit_button);
        Plan_submit_button.addEventListener('click', send_delivery_plan);
    });
}

function load_list(){
    // fetching the list of destinations from db
    fetch('get_destination_list')
    .then(response => response.json())
    .then(data => {
        data = JSON.parse(data);
        data.forEach(element => {
            destination_list.push(element["destination_id"]);
        });
        //sort the list
        destination_list = destination_list.sort();
    })
}

function suggestion_list(event){
    var id = event.target.id.slice(21);
    clean_list();
    for ( let item of destination_list){
        //convert to lover case and comapre to each item in destination list
        if (item.toLowerCase().startsWith( event.target.value.toLowerCase()) && event.target.value != "") { 
            let itemList = document.createElement("li");
            itemList.classList.add(`item-list:${id}`);
            itemList.style.cursor = "pointer";
            itemList.setAttribute("onclick", `dispplayDestinations('${item}', '${event.target.id}')`);
            let match_d = "<b>" + item.substring(0, event.target.value.length) + "</b>";
            match_d += item.substring(event.target.value.length);

            itemList.innerHTML =  match_d;
            document.getElementById(`destination_list:${id}`).appendChild(itemList);
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

function send_delivery_plan(event) {
    event.preventDefault();
    const delivery_id = document.getElementById("delivery_id").value;
    const quarter = document.getElementById("quarter").value;
    const year = document.getElementById('year').value;
    const del_order = {};
    const fields = document.getElementById('delivery_plan_extra_fields').childNodes;
    for ( let i = 1; i<fields.length; i++) {
        const del_id_value = document.getElementById("destination_field_id:"+i).value;
        var obj1 = {[del_id_value]:i};
        Object.assign(del_order, obj1)
    }
    let some = JSON.stringify({
        "delivery_id": delivery_id,
        "quarter": quarter,
        "year:": year,
        "fields": fields.length-1,
        "order": del_order,
      });
    console.log(some);
    fetch("/reg_delivery_plan", {
        method: 'POST',
        body: JSON.stringify({
            delivery_id: delivery_id,
            quarter: quarter,
            year: year,
            del_order: del_order,
        }),
        
    })
    .then(response => response.json())
    .then(result => {
        if ( result["Success"] == true)
            console.log(result);
            location.href = `delivery_plan/${delivery_id}`;

        
    })
}

/** function takes a list of JSON and a table
 * 
 * 
 * 
 */
function displayFilterResults(listDeliveryIds) {
    // clean up old entries
    try {
        const oldTable = document.getElementById('table_field_reset')
        oldTable.remove();
    }
    catch {
        // must be clean!
    }
    // checking if the right block is display and form is diplay none
    const tableDiv = document.getElementById('dp_list_div');
    tableDiv.style.display = 'block';
    hideForm();

    //create a table and header row with 
    const dpListDiv = document.getElementById('result_table_field');
    const listOfTh = ['#', 'DELIVERY ID', 'YEAR', 'QUARTER', 'DESTINATIONS' ]
    const tableD = document.createElement('table');
    tableD.id = 'table_field_reset';
    dpListDiv.appendChild(tableD);
    const thead = document.createElement('thead')
    tableD.appendChild(thead);
    const trTag = document.createElement('tr');
    thead.appendChild(trTag)
    listOfTh.forEach(item => {
        const thTag = document.createElement('th');
        thTag.innerHTML = item;
        thTag.scope = 'col';
        trTag.appendChild(thTag);

    })

    const tbody = document.createElement('tbody');
    tableD.appendChild(tbody);
    let counter = 0;
    listDeliveryIds.forEach(element => {
        counter++;
        const trBodyTag = document.createElement('tr');
        tbody.appendChild(trBodyTag);
        const thRowTag = document.createElement('th');
        thRowTag.scope = 'row';
        
        thRowTag.innerHTML = counter;
        trBodyTag.appendChild(thRowTag);
        Object.entries(element).forEach(entry => {
            const [key, value] = entry;
            const tdTag = document.createElement('td');
            tdTag.innerHTML = value;
            trBodyTag.appendChild(tdTag);


        })
    })
}