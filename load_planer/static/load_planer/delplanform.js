document.addEventListener("DOMContentLoaded", function() {
    console.log("LOADED!");
    var form_field = document.querySelector('#delivery_plan_form');
    create_form(form_field);
});


function create_form(form_field){
    console.log("creating form field");
    
    // delivery_id field
    const del_id_f = document.createElement('textarea');
    del_id_f.id = "delivery_id";
    form_field.appendChild(del_id_f);

    // Quarter field
    const quater_f = document.createElement('input');
    quater_f.type = "number";
    quater_f.min = 1;
    quater_f.max = 4;
    form_field.appendChild(quater_f);
    // Year field
    const year_f = document.createElement('input');
    year_f.type = "number";
    year_f.min = 2022;
    year_f.max = 2024;
    form_field.appendChild(year_f);

    // this is going to be transfered into JSON later :
    // {"delivery order from 1 to n":"destination_id"}
    // Delivery order field
    const del_ord_f = document.createElement('input');
    del_ord_f.type = "number";
    del_ord_f.min = 1;
    del_ord_f.max = 20;
    form_field.appendChild(del_ord_f);

    //destination_id field
    const dest_id_f = document.createElement('textarea');
    dest_id_f.id = "destination_id";
    form_field.appendChild(dest_id_f);

    // buttor field
    const button = document.createElement('button');
    button.classList = 'btn btn-secondary';
    button.type = 'submit';
    button.textContent = "Create";
    form_field.appendChild(button);
}