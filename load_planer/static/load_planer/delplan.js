document.addEventListener("DOMContentLoaded", function() {
    var delivery_id = document.getElementById('delivery_id').innerHTML;
    // get_delivery_order_list(delivery_id);
    loadSideNav();
    loadDetails();
});


// REWORK THIS JSON {'MCD01':1...} doesn't suits new desing solution

// function get_delivery_order_list(delivery_id) {
//     fetch(`/get_delivery_plan_list/${delivery_id}`)
//     .then(response => response.json())
//     .then(data => {
//         console.log(data);
//         data = JSON.parse(data);
//         const div_list = document.getElementById('delivery_plan_list');
//         Object.entries(data).forEach(entry => {
//             const [value, key] = entry;
//             const row = document.createElement('div');
//             const record = document.createElement('p');
//             const link = document.createElement('a');
//             link.href = `/destination/${value}`;
//             link.innerHTML = value;
//             record.innerHTML = `${key}:`;
//             div_list.appendChild(row);
//             row.appendChild(record);
//             record.append(link);
//         })

//     })
// } 

/** function load a button to the side div
 * on click should delete this delivery plan
 */
function loadSideNav() {
    const sideDiv = document.getElementById('delete_button_field');
    const button = document.createElement('button');
    button.classList = 'btn btn-outline-warning form-control';
    button.textContent = 'DELETE';
    sideDiv.appendChild(button);
    console.log("been here");
    // NOT FINISHED! HERE!!!!!!!!!!
}

function loadDetails() {
    const detailsDiv = document.getElementById('delivery_plan_details');
    const delPlanId = document.getElementById('delivery_id');
    const details = 1;
    fetch(`/get_delivery_plan_list/${delPlanId.innerHTML}/${details}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
}