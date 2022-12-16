function submitTourPlaningForm(){
    // create a button and append to formfield
    const formField = document.getElementById('tour_plan_form');
    const buttonRow = document.createElement('div');
    buttonRow.classList = "row";
    buttonRow.id = "error_button_row";
    formField.appendChild(buttonRow);

    const errorDiv = document.createElement('div');
    errorDiv.id = "error_message_div";
    errorDiv.classList = "col";
    buttonRow.appendChild(errorDiv);

    const buttonsDivV = document.createElement('div');
    buttonsDivV.id = "buttons_ver_reg_div";
    buttonsDivV.classList = "col-md-auto";
    buttonRow.appendChild(buttonsDivV);

    const verificateButton = document.createElement('button');
    verificateButton.classList = 'btn btn-primary';
    verificateButton.type = 'submit';
    verificateButton.textContent = "Verify Tour";
    verificateButton.id = 'verify_button';
    buttonsDivV.append(verificateButton);
    verificateButton.addEventListener('click', verificateTableData);

    //creating registration button
    const submitButton = document.createElement('button');
    submitButton.classList = 'btn btn-outline-success btn-block';
    submitButton.type = 'submit';
    submitButton.textContent = "Register Tour";
    submitButton.disabled = true;
    submitButton.id = "submit_button";
    buttonsDivV.append(submitButton);
    submitButton.addEventListener('click', verifyTourData);

    tableErrorMessage(message="", color="");
}

function tableErrorMessage(message, color) {
    const errorDiv = document.getElementById('error_message_div');
    if ( message == "") {
        const defaultMessage = "Rules for fully loaded Reefer/Truck: The smallest load of (frozen or chilled+dry) must be at least 4 pallets.</br> Pallet count to every type of goods must be EVEN."
        message = defaultMessage;
        color = "black";
    }
    errorDiv.innerHTML = `<small>${message}</small>`;
    errorDiv.style.color = color;
}

/* 
    This function is going to verify all the data in table
    row by row checking if the input is filled out.
    Server side verification is going to happen as well.

*/
function verificateTableData(event) {
    //making sure the subbmit button is disabled.
    const submitButton = document.getElementById('submit_button');
    submitButton.disabled = true;

    const rows = document.getElementById('tour_table').rows.length;
    var totalPalletCount = 0;
    var totalFrozenPallets = 0;
    var totalCDPallets = 0;
    let maxPalletCount = 0; 
    let truckZones = 0;
    let validationValue = 0;
    const truck_id = document.getElementById("truck_id").value
    fetch(`/get_truck_details/${truck_id}`)
    .then(response => response.json())
    .then(response => {
        // fetched value is set to max pallet count
        maxPalletCount = response["pallet_size"];
        truckZones = response['zones'];
        for (var i = 1; i < rows; i++){
            //getting vital values:
            const targetRow = document.getElementById(`row:${i}`);
            const destination = document.getElementById(`Destination:${i}`);
            const deliveryTime = document.getElementById(`time:${i}`);          
            const fPallets = document.getElementById(`frozen:${i}`);
            const cPallets = document.getElementById(`chilled:${i}`);
            const dPallets = document.getElementById(`dry:${i}`);
            // Validation goes here:
            const destIsValid = /^[0-9a-zA-Z]+$/.test(destination.innerHTML);
            const timeIsValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(deliveryTime.value);
            const fPisValid = /^[0-9]?[0-9]+$/.test(fPallets.value) && fPallets.value <= maxPalletCount;
            const cPisValid = /^[0-9]?[0-9]+$/.test(cPallets.value) && cPallets.value <= maxPalletCount;
            const dPisValid = /^[0-9]?[0-9]+$/.test(dPallets.value) && dPallets.value <= maxPalletCount;
            if (destIsValid && timeIsValid && fPisValid && cPisValid &&dPisValid) {
                // check if total number of pallets is < maxPallets    
                targetRow.classList = "table-success"; //green
                validationValue += 1; 
                totalFrozenPallets += parseInt(fPallets.value);
                totalCDPallets += parseInt(cPallets.value) + parseInt(dPallets.value);
                totalPalletCount += parseInt(fPallets.value) + parseInt(cPallets.value) + parseInt(dPallets.value);
                let result = false;
                const smallLoad = (totalCDPallets > totalFrozenPallets)? totalCDPallets : totalCDPallets;
                /** REWORKING THIS
                 * now let's check for two conditions:
                 * 1) if the planner has used all the available pallet slots
                 * if yes, validate the total values of loaded pallets
                 * 2) if the user hit the last row (i == rows)
                 * then check if full load, and if all condition right, validate the total pallets
                 * 
                 * !! if not full load: make sure the reefer can take the number of smallLoad
                 * it may be less than 4 if the (maxPalletCount - (totalPalletCount - smallLoad)) is >= 4  ???!!!
                 */
                if (totalPalletCount > maxPalletCount) {
                    validationValue -= 1;
                    targetRow.classList = "table-danger"; //red
                    let message = "Maximum of pallet exceeded!";
                    tableErrorMessage(message, color="red");
                }
                else if (totalPalletCount == maxPalletCount) {
                    /** If full load: minimum number of f/cd pallets in a mixed load (NOT MONOLOAD)
                     * can be 4 pallets, this rule goes for both reefers of load (20 or 14) 
                     * and (2 or 3) zones of temperature control.
                     ! In full load number of f/cd pallets totals must be EVEN, odd pallen count can't be loaded.
                    */ 
                    if (!(smallLoad >= 4 && (smallLoad % 2 == 0))) {
                        // this is MIXED load and we need to check for
                        validationValue -= 1;
                        targetRow.classList = "table-danger"; //red
                        let message = "The smallest load of (frozen or chilled+dry) must be at least 4 pallets.";
                        if (smallLoad % 2 != 0) {
                            message = "In full load pallet count to every type of goods must be EVEN.";
                        }
                        tableErrorMessage(message, color="red");
                    }
                }
                else if (i == (rows - 1)){

                    /**
                     * last row ot the table, check if it's fullLoad
                     * if true: check Smalload >= 4 and Even count values of pallet types
                     * if false: (maxPalletCount - (totalPalletCount - smallLoad)) is >= 4 
                     * and at least one type of goods has EVEN number of loaded pallets
                     */
                    if (totalPalletCount == maxPalletCount) {
                        // fulload on last row
                        if (!(smallLoad >= 4 && (smallLoad % 2 == 0))) {
                            // this is MIXED load and we need to check for
                            validationValue -= 1;
                            validationValue -= 1;
                            targetRow.classList = "table-danger"; //red
                            const message = "";
                            if (smallLoad % 2 != 0) {
                                message = "In full load pallet count to every type of goods must be EVEN.";
                            }
                            else {
                                message = "The smallest load of (frozen or chilled+dry) must be at least 4 pallets.";
                            }
                            tableErrorMessage(message, color="red");
                        }
                    }
                    else if (!(maxPalletCount - (totalPalletCount - smallLoad) >= 4)) {
                        validationValue -= 1;
                        targetRow.classList = "table-danger"; //red
                        let message = "The smallest load of (frozen or chilled+dry) must be at least 4 pallets.";
                        if (smallLoad % 2 != 0 || (totalPalletCount - smallLoad) != 0 ) {
                            message = "In full load pallet count to every type of goods must be EVEN.";
                        }
                        tableErrorMessage(message, color="red");
                    }
                }
            }
            else {
                targetRow.classList = "table-danger"; //red
            }
        }
        if (validationValue == (rows-1)) {
           // "ALL rows in the table are valid!"
            submitButton.disabled = false;
            submitButton.classList = 'btn btn-success';
            const verifyButt = document.getElementById('verify_button');
            verifyButt.classList = 'btn btn-outline-primary';
            tableErrorMessage(message = "Tour verified and may be registred.", color = "green");
        }
    })     

}

/** locks input and select fields */
function verifyTourData(){
    // lock all buttons
    const verifyButton = document.getElementById('verify_button');
    verifyButton.disabled = true;
    const registerButton = document.getElementById('submit_button');
    registerButton.disabled = true;
     //lock all input fields
    const inpiutList = document.querySelectorAll('input');
    for (var i = 0; i < inpiutList.length; i++) {
    inpiutList[i].disabled = true;
    }
    // lock select fields
    const selectFields = document.querySelectorAll('select');
    for ( var i = 0; i< selectFields.length; i++){
        selectFields[i].disabled = true;
    }
    // registring Tour
    registerTour();
}

/* Function is registring Tour so the Destination points can be registred. */
function registerTour(){
    // first we need to register the TOur and then every row as Destination point
    const delivery_id_field = document.getElementById('delivery_id_field');
    const delivery_date = document.getElementById('exec_date');
    const truck_id = document.getElementById('truck_id');
    const driver_id = document.getElementById('driver_id');
    fetch('/register_tour', {
        method: "POST",
        body: JSON.stringify({
            delivery_id: delivery_id_field.value,
            exec_date : delivery_date.value,
            truck_id: truck_id.value,
            driver_id: driver_id.value,
        }),
    })
    .then(response => response.json())
    .then(data => {
        const tour_id = data['tour_id'];
        /* data has to return tour_id to be user to register delivery points
            if tour_id is empty:  Drop Error alert
        */
        if(data['error']) {
            alert(data['error']);
        }
        else {
            registerDeliveryPoint(tour_id);
        }    
    })
}

/* Functions is registring every row as a Destination point */
function registerDeliveryPoint(tour_id){
    // rows is a number of rows in the table
    // rows is including header row!
    const rows = document.getElementById('tour_table').rows.length;
    let counter = 1;
    for (var i = 1; i < rows; i++){
        //getting vital values:
        const destination = document.getElementById(`Destination:${i}`);
        const deliveryTime = document.getElementById(`time:${i}`);          
        const fPallets = document.getElementById(`frozen:${i}`);
        const cPallets = document.getElementById(`chilled:${i}`);
        const dPallets = document.getElementById(`dry:${i}`);
        
        /* if form is valid we fetch registration for every line */
        fetch('/register_delivery_point', {
            method: "POST",
            body: JSON.stringify({
                tour_id: tour_id,
                destination: destination.innerHTML,
                delivery_time : deliveryTime.value,
                fpallets: fPallets.value,
                cpallets: cPallets.value,
                dpallets: dPallets.value,
            }),
        })
        .then(response => response.json())
        .then(data => {
            counter++;
            relocateAfterDone(rows, counter, tour_id);
        })
    }
}

/** redirect user to plan page if rows and counter match */
function relocateAfterDone(rows, counter, tour_id) {
    if (rows == counter) {
        // after all registration done - redirect to new Tour - /tour/<id>
        location.href = `tour/${tour_id}`;  
    }
}