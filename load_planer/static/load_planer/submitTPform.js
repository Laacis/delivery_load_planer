function submitTourPlaningForm(){
    console.log("loaded submitTourPlaningForm()");
    // create a button and append to formfield
    const formField = document.getElementById('tour_plan_form');
    const submitButton = document.createElement('button');
    submitButton.classList = 'btn btn-primary btn-block';
    submitButton.type = 'submit';
    submitButton.textContent = "Register Tour";
    formField.append(submitButton);
    submitButton.addEventListener('click', function(){
        // rows is a number of rows in the table
        const rows = document.getElementById('tour_table').rows.length - 1;
    })
}
