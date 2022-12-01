document.addEventListener("DOMContentLoaded", function() {
    crdateInpandButton();
});

// createing input field
function crdateInpandButton() {
    const sideBar = document.getElementById('view_tours_input_field');
    const viewDate = document.createElement('input');
    viewDate.type = 'date';
    viewDate.id = 'view_date_input';
    viewDate.classList = 'form-control';
    
    sideBar.appendChild(viewDate);
    //creating label for input
    const dateLabel = document.createElement('label');
    dateLabel.for = 'view_date_input';
    dateLabel.innerHTML = 'Select date:';
    dateLabel.classList = "form-label";
    sideBar.appendChild(dateLabel);

    //creating button
    const buttonField = document.getElementById('view_tours_button_field');
    const showToursButton = document.createElement('button');
    showToursButton.classList = 'btn btn-success form-control';
    showToursButton.type = 'submit';
    showToursButton.textContent = "Find Tours";
    buttonField.appendChild(showToursButton);
    showToursButton.addEventListener('click', function(){
        //get value from viewDate input
        if (viewDate.value != "") {
            getTourList(viewDate.value);
        }
        else {
            viewDate.focus();
        }

    })
}

function getTourList(date){
    const tourList = document.getElementById('tour_display_list');

    const headderL = document.createElement('h4');
    headderL.innerHTML = `Tour list for: ${date}`
    tourList.appendChild(headderL);

    // make table
    const tableL = document.createElement('table');
    tableL.id = 'tour_table'
    tableL.classList = "table table-hover";
    tourList.appendChild(tableL);
    const trHead = document.createElement('tr');
    tableL.appendChild(trHead);
    const trHeadList = ['Tour id', 'Delivery id', 'Driver id', 'Truck id', 'Destinations'];
    const trHeadListids = ['tour_id', 'delivery_id', 'driver_id', 'truck_id', 'destination_count'];

    trHeadList.forEach( item => {
        const thItem = document.createElement('th');
        thItem.innerHTML = item;
        trHead.appendChild(thItem);
    }) 



    // getting data
    fetch(`/get_tour_list/${date}`)
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {
            const rowL = document.createElement('tr');
            tableL.appendChild(rowL);
            console.log(element);
            Object.entries(element).forEach(entry => {
                const [key, value] = entry
                console.log(entry);
                const rowData = document.createElement('td');
                rowData.innerHTML = value;
                rowL.appendChild(rowData);
            });
        })
    })
}