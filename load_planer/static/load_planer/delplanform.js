document.addEventListener("DOMContentLoaded", function() {
    var form_field = document.querySelector('#delivery_plan_form');
    create_form(form_field);
});
// list of destinations todisplay in the form
var destination_list =[]

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
    fetch("/reg_destination_plan", {
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