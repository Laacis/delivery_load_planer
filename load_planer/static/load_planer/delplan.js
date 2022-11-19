document.addEventListener("DOMContentLoaded", function() {
    var delivery_id = document.getElementById('delivery_id').innerHTML;
    get_delivery_order_list(delivery_id);
});

function get_delivery_order_list(delivery_id) {
    fetch(`/get_delivery_plan_list/${delivery_id}`)
    .then(response => response.json())
    .then(data => {
        if (data["Result"] == true) {
            console.log("loading");
            list_to_load = data["data_list"];
            console.log(list_to_load);
            const div_list = document.getElementById('delivery_plan_list');
            for (let [key, value] of Object.entries(list_to_load)) {
                console.log(`${key}: ${value}`);
                const row = document.createElement('div');
                const record = document.createElement('p');
                const link = document.createElement('a');
                link.href = `/destination/${key}`;
                link.innerHTML = key;
                record.innerHTML = `${value}:`;
                div_list.appendChild(row);
                row.appendChild(record);
                record.append(link);
            }
        }
    })
} 

// TODO : Write fetch to get Destination list adresses  to display
// and make a table Delivery  
// | Nr. | Destination id | Destination address |