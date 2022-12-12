document.addEventListener("DOMContentLoaded", function() {
    create_form();
    hideForm();
    loadButtons();
    // display plans for this year /quarter
    const todaydate = new Date().toISOString().split('T')[0];
    const year = todaydate.slice(0,4);
    const quarter = get_quater(parseInt(todaydate.slice(5,7)));
    loadPlansTable(parseInt(year), quarter);
});
// list of destinations todisplay in the form
var destination_list =[]

/** a stupid way to get quarter from a month integer */
function get_quater(month) {
    if (month <= 3) { return 1;}
    else if( month >3 && month < 7){return 2;}
    else if( month >= 7 && month < 10){return 3;}
    else {return 4};
}

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
        loadPlansTable(deliveryYearField.value, quarterField.value);
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
        const formExtr = document.getElementById('delivery_plan_extra_fields');
        formExtr.style.display = 'block';
        formDiv.style.display = 'block';
        const listDiv = document.getElementById('dp_list_div');
        listDiv.style.display = 'none';
    })
}

function hideForm() {
    const formDiv = document.getElementById('delivery_plan_form');
    formDiv.style.display = 'none';
    const formExtr = document.getElementById('delivery_plan_extra_fields');
    formExtr.style.display = 'none';
}

/** creates a form to register Delivery plan 
 * first part let user define year and quarter to register plan for
 * rest profide fields for Destination id registration
 * after clicking on submit plann a check up is run.
*/
function create_form(){
    // // Quarter field
    const quater_f = document.getElementById('quarter');
    for ( var i = 1; i < 5; i++) {
        var option = document.createElement('option')
        option.value = i;
        option.text = i;
        quater_f.appendChild(option);
    }
    // // Year field
    const year_f = document.getElementById('year');
    for ( var i = 2022; i < 2025; i++) {
        var option = document.createElement('option')
        option.value = i;
        option.text = i;
        year_f.appendChild(option);
    }

    // Let user choose  number of destinations to generate input+texarea * number
    const destination_choice = document.getElementById('dest_nr');

    for (var i = 1; i < 20; i++) {
        var option = document.createElement('option');
        option.value = i;
        option.text = i;
        destination_choice.appendChild(option);
    }
    const butF = document.getElementById('button_l');
    const button_f_request = document.createElement('button');
    button_f_request.classList = 'btn btn-secondary';
    button_f_request.type = 'submit';
    button_f_request.textContent = "Request form";
    button_f_request.id = "request_field_btn";
    butF.appendChild(button_f_request);
    button_f_request.addEventListener('click', function() {
        const extra_fields = document.getElementById('delivery_plan_extra_fields');
        let rowNr = Math.ceil(destination_choice.value / 3);
        let counter = 0;
        let totalDestinations = 0;


        for ( let i = 0; i < rowNr; i++){
            // crate row
            const rowD = document.createElement('div');
            rowD.classList = 'row mb-2';
            extra_fields.appendChild(rowD);

            for ( let j = 1; j <= 3; j++){
                if (totalDestinations == destination_choice.value) break;
                totalDestinations++;

                const colDiv = document.createElement('div');
                colDiv.classList = 'col-4';
                rowD.appendChild(colDiv);
                const inpGr = document.createElement('div');
                inpGr.classList = 'input-group';
                colDiv.appendChild(inpGr);
                const inpGrPrep = document.createElement('div');
                inpGrPrep.classList = 'input-group-prepend';
                inpGr.appendChild(inpGrPrep);
                const prepTExt = document.createElement('div');
                prepTExt.classList = 'input-group-text';
                prepTExt.id =`destination_select_id:${totalDestinations}`;
                prepTExt.innerHTML = totalDestinations;
                inpGrPrep.appendChild(prepTExt);
    
                const destination_id = document.createElement('input');
                destination_id.type = 'text';
                destination_id.id = `destination_field_id:${totalDestinations}`;
                destination_id.classList = 'col col-lg-2 form-control';
                inpGr.appendChild(destination_id);
            }
        }
        //cleaning up button and choice field
        button_f_request.remove();
        destination_choice.disabled = true;
        quater_f.disabled = true;
        year_f.disabled = true;
        
        // Loading destinations
        load_list();

        // button field
        const targettt = document.getElementById('button_l');
        const Plan_submit_button = document.createElement('button');
        Plan_submit_button.classList = 'btn btn-success';
        Plan_submit_button.type = 'submit';
        Plan_submit_button.textContent = "Submit Plan";
        targettt.appendChild(Plan_submit_button);
        Plan_submit_button.addEventListener('click', checkUserInput);
    });
}

function checkUserInput(event) {
    event.preventDefault();
    resetCheckTools();
    const targetDPF = document.getElementById('delivery_plan_form');
    const errorRow = document.createElement('div');
    errorRow.style.color = 'red';
    errorRow.id = 'error_fields';
    errorRow.classList = 'row justify-content-md-center';
    targetDPF.appendChild(errorRow);

    let inputList = [];
    console.log("checking");
    console.log(destination_list)
    let verified = true;
    const numberOfInput = document.getElementById('dest_nr').value;
    for ( let i = 1; i<=numberOfInput; i++) {
        const destIdValue = document.getElementById(`destination_field_id:${i}`)
        //checking for wrong entries
        if (!destination_list.includes(destIdValue.value) || inputList.includes(destIdValue.value)){
            destIdValue.style ='border: 2px solid red;';
            errorRow.innerHTML = "Dublicate or Wrong Destination ID's in selected field(s)";
            verified = false;
            
        }
        else {
            destIdValue.style ='border: 1px solid light-grey;';
            inputList.push(destIdValue.value);
        }
    }
    // check if delivery_id not empty
    const delIdField = document.getElementById('delivery_id');
    if ( delIdField.value == "") {
        verified = false;
        delIdField.focus();
    } 
    if (verified == true) {
        send_delivery_plan(numberOfInput);
    }
}

function resetCheckTools(){
    const numberOfInput = document.getElementById('dest_nr').value;
    for ( let i = 1; i<=numberOfInput; i++) {
        const destIdValue = document.getElementById(`destination_field_id:${i}`);
        destIdValue.style ='border: 1px solid light-grey;';
    }
    try {
        const errofield = document.getElementById('error_fields');
        errofield.remove();
    }
    catch{
        //empty i guess.
    } 
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

function send_delivery_plan(numberOfInput) {
    const delivery_id = document.getElementById("delivery_id").value;
    const quarter = document.getElementById("quarter").value;
    const year = document.getElementById('year').value;
    const del_order = {};
    const fields = document.getElementById('delivery_plan_extra_fields').childNodes;
    for ( let i = 1; i<=numberOfInput; i++) {
        const del_id_value = document.getElementById("destination_field_id:"+i).value;
        var obj1 = {[del_id_value]:i};
        Object.assign(del_order, obj1)
    }
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
            location.href = `delivery_plan/${delivery_id}`;
    })
}

/** function takes a list of JSON and a table
 *  and builds a table from this JSON
 *  listing Delivery plans and detials
 */
function displayFilterResults(listDeliveryIds) {
    clearTable();
    // checking if the right block is display and form is diplay none
    const tableDiv = document.getElementById('dp_list_div');
    tableDiv.style.display = 'block';
    hideForm();

    //create a table and header row with 
    const dpListDiv = document.getElementById('result_table_field');
    const listOfTh = ['DELIVERY ID', 'YEAR', 'QUARTER', 'DESTINATIONS' ]
    const tableD = document.createElement('table');
    tableD.classList = 'table table-sm table-hover table-striped';
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
    if (listDeliveryIds.length == 0){
        clearTable();
        const targetDiv = document.getElementById('result_table_field');
        //creating div with id 'table_field_reset'
        const noResDiv = document.createElement('div');
        noResDiv.id ='table_field_reset';
        noResDiv.innerHTML = "No Delivery Plans for selected period.";
        targetDiv.appendChild(noResDiv);
    }
    listDeliveryIds.forEach(element => {

        const trBodyTag = document.createElement('tr');
        tbody.appendChild(trBodyTag);
        Object.entries(element).forEach(entry => {
            const [key, value] = entry;
            const tdTag = document.createElement('td');
            if ( key == 'delivery_id'){
                //create link to del plan page
                const aTag = document.createElement('a');
                aTag.href = `/delivery_plan/${value}`;
                aTag.innerHTML = value;
                tdTag.appendChild(aTag);
            }
            else {
                tdTag.innerHTML = value;
            }
            trBodyTag.appendChild(tdTag);


        })
    })
}
// Clears the table
function clearTable() {
    // clean up old entries
    try {
        const oldTable = document.getElementById('table_field_reset')
        oldTable.remove();
    }
    catch {
        // must be clean!
    }
}

function loadPlansTable(year, quarter){
    //clear the list
    listDeliveryIds = [];
    fetch(`/get_delivery_list_by_details/${year}/${quarter}`)
    .then(response => response.json())
    .then(data => {
        // returns a list of values from delivery_id, now push values into listDeliveryIds
        data = JSON.parse(data);
        data.forEach(element => {
            listDeliveryIds.push(element);
        });
          // load results and display
        displayFilterResults(listDeliveryIds);

    })
}