function submitTourPlaningForm(){
    // create a button and append to formfield
    const formField = document.getElementById('tour_plan_form');
    const verificateButton = document.createElement('button');
    verificateButton.classList = 'btn btn-primary btn-block';
    verificateButton.type = 'submit';
    verificateButton.textContent = "Verify Tour";
    verificateButton.id = 'verify_button';
    formField.append(verificateButton);
    verificateButton.addEventListener('click', verificateTableData);

    //creating registration button
    const submitButton = document.createElement('button');
    submitButton.classList = 'btn btn-success btn-block';
    submitButton.type = 'submit';
    submitButton.textContent = "Register Tour";
    submitButton.disabled = true;
    submitButton.id = "submit_button";
    formField.append(submitButton);
    submitButton.addEventListener('click', verifyTourData);

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
        console.log(response);
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
                if (totalPalletCount > maxPalletCount) {
                    validationValue -= 1;
                    targetRow.classList = "table-danger"; //red
                    console.log("Maximum of pallets count exceded!");
                }
                else if ( totalPalletCount == maxPalletCount){
                    console.log('FULL LOAD!');
                    /** If full load: minimum number of f/cd pallets in a mixed load (NOT MONOLOAD)
                     * can be 4 pallets, this rule goes for both reefers of load (20 or 14) 
                     * and (2 or 3) zones of temperature control.
                     ! In full load number of f/cd pallets totals must be EVEN, odd pallen count can't be loaded.
                    */ 
                    const smallLoad = (totalCDPallets > totalFrozenPallets)? totalCDPallets : totalCDPallets;
                    if (smallLoad == 0) {
                        // this case is MONOLOAD FULL LOAD
                        console.log("MONOLOAD!");
                    }
                    else if (smallLoad >= 4 && (smallLoad % 2 == 0)) {
                        // this is MIXED load and we need to check for
                        console.log("MIXED LOAD, Pallets EVEN, smallLoad >=4");
                    }
                    else {
                        validationValue -= 1;
                        targetRow.classList = "table-danger"; //red
                        if (!smallLoad >= 4) {
                            console.log("The smallest load of (frozen or chilled+dry) must be at least 4 pallets.");
                        }
                        else if (smallLoad % 2 != 0) {
                            console.log("In full load pallet count to every type of goods must be EVEN.");
                        }
                    }
                }
            }
            else {
                targetRow.classList = "table-danger"; //red
            }
        }
        if (validationValue == (rows-1)) {
            console.log("ALL rows in the table are valid!");
            submitButton.disabled = false;
        }
        else {
            console.log("Check the yellow/red rows again!");
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
        console.log(tour_id);
        /* data has to return tour_id to be user to register delivery points
            if tour_id is empty:  Drop Error alert
        */
        if(data['error']) {
            alert(data['error']);
        }
        else {
            registerDeliveryPoint(tour_id);
            console.log(data);
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