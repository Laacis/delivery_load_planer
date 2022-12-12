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
    const listOfTh = ['#', 'DELIVERY ID', 'ADDRESS', 'ZIP/POST', 'TEL.' ]
    const tableD = document.createElement('table');
    tableD.classList = 'table table-sm table-hover table-striped';
    tableD.id = 'table_field_reset';
    detailsDiv.appendChild(tableD);
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
    // args,details for fetch request:
    const delPlanId = document.getElementById('delivery_id');
    const details = 1;
    fetch(`/get_delivery_plan_list/${delPlanId.innerHTML}/${details}`)
    .then(response => response.json())
    .then(data => {
        // parsing data so we can user forEach
        data = JSON.parse(data);
        data.forEach(record => {
            // build row
            const trBodyTag = document.createElement('tr');
            tbody.appendChild(trBodyTag);
            Object.entries(record).forEach(entry => {
                const [key,value] = entry;
                // build cell
                const tdTag = document.createElement('td');
                if ( key == 'destination_id'){
                    //create link to del plan page
                    const aTag = document.createElement('a');
                    aTag.href = `/destination/${value}`;
                    aTag.innerHTML = value;
                    tdTag.appendChild(aTag);
                }
                else {
                    tdTag.innerHTML = value;
                }
                trBodyTag.appendChild(tdTag);
    
    
            })
        })

    })
}