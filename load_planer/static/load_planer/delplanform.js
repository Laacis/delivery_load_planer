document.addEventListener("DOMContentLoaded", function() {
    console.log("LOADED!");
    var form_field = document.querySelector('#delivery_plan_form');
    create_form(form_field);
});


function create_form(form_field){
    console.log("creating form field");
    
    // delivery_id field
    const del_id_f = document.createElement('input');
    del_id_f.id = "delivery_id";
    del_id_f.type = 'text';
    form_field.appendChild(del_id_f);

    // Quarter field
    const quater_f = document.createElement('select');
    form_field.appendChild(quater_f);
    for ( var i = 1; i < 5; i++) {
        var option = document.createElement('option')
        option.value = i;
        option.text = "Q"+i;
        quater_f.appendChild(option);
    }
    // Year field
    const year_f = document.createElement('select');
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
        console.log("clicked this button!");
        const extra_fields = document.createElement('div');
        extra_fields.id = "delivery_plan_extra_fields";
        extra_fields.textContent = "extra field";
        form_field.append(extra_fields);
        var destination_field_number = destination_choice.value;
        console.log(`building extra ${destination_field_number} fields`)
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
            dest_order.appendChild(option);
            // Creating input text for Destination id
            const destination_id = document.createElement('input');
            destination_id.type = 'text';
            destination_id.id = `destination_field_id:${i+1}`;
            set_div.appendChild(destination_id);
            
        }
        //cleaning up button and choice field
        button_f_request.remove();
        destination_choice.remove();
        
        // Loading destinations
            load_list();

        // buttor field
        const Plan_submit_button = document.createElement('button');
        Plan_submit_button.classList = 'btn btn-primary';
        Plan_submit_button.type = 'submit';
        Plan_submit_button.textContent = "Submit Plan";
        form_field.appendChild(Plan_submit_button);
    });
}

function load_list(){
    fetch('get_destination_list')
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
}