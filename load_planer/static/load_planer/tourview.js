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
    fetch(`/get_tour_list/${date}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
}