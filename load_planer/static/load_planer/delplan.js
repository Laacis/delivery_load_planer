document.addEventListener("DOMContentLoaded", function() {
    var delivery_id = document.getElementById('delivery_id').innerHTML;
    get_delivery_order_list(delivery_id);
});

function get_delivery_order_list(delivery_id) {
    fetch(`/get_delivery_plan_list/${delivery_id}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
        data = JSON.parse(data);
        const div_list = document.getElementById('delivery_plan_list');
        Object.entries(data).forEach(entry => {
            const [value, key] = entry;
            const row = document.createElement('div');
            const record = document.createElement('p');
            const link = document.createElement('a');
            link.href = `/destination/${value}`;
            link.innerHTML = value;
            record.innerHTML = `${key}:`;
            div_list.appendChild(row);
            row.appendChild(record);
            record.append(link);
        })

    })
} 

