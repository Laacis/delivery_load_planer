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
        console.log(`building extra ${destination_choice.value} fields`)
        for (var i = 0; i < destination_choice.value; i++) {
            const set_div = document.createElement('div');
            set_div.id = `div_id:${i+1}`;
            set_div.textContent = i+1+".";
            extra_fields.appendChild(set_div)
        }
        //cleaning up button and choice field
        button_f_request.remove();
        destination_choice.remove();
    });
    

    // // this is going to be transfered into JSON later :
    // // {"delivery order from 1 to n":"destination_id"}
    // // Delivery order field
    // const del_ord_f = document.createElement('input');
    // del_ord_f.type = "number";
    // del_ord_f.min = 1;
    // del_ord_f.max = 20;
    // form_field.appendChild(del_ord_f);


            // //destination_id field
            // const dest_id_f = document.createElement('textarea');
            // dest_id_f.id = "destination_id";
            // form_field.appendChild(dest_id_f);


    // // buttor field
    // const button = document.createElement('button');
    // button.classList = 'btn btn-secondary';
    // button.type = 'submit';
    // button.textContent = "Create";
    // form_field.appendChild(button);
}