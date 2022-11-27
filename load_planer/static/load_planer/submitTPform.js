function submitTourPlaningForm(){
    console.log("loaded submitTourPlaningForm()");
    // create a button and append to formfield
    const formField = document.getElementById('tour_plan_form');
    const submitButton = document.createElement('button');
    submitButton.classList = 'btn btn-primary btn-block';
    submitButton.type = 'submit';
    submitButton.textContent = "Verify Tour";
    formField.append(submitButton);
    submitButton.addEventListener('click', verificateTableData);

}


/* 
    This function is going to verify all the data in table
    row by row checking if the input is filled out.
    Server side verification is going to happen as well.
*/
function verificateTableData(event) {
    
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
                console.log("row valid and none of above!");
                targetRow.style = "background-color:green";

                totalFrozenPallets += parseInt(fPallets.value);
                totalCDPallets += parseInt(cPallets.value) + parseInt(dPallets.value);
                totalPalletCount += parseInt(fPallets.value) + parseInt(cPallets.value) + parseInt(dPallets.value);
                let result = false;
                if (totalPalletCount > maxPalletCount) {
                    console.log("Number of pallets exceeds the maximum volume!");
                    targetRow.style = "background-color:red";
                    validationValue -= 1;
                }
                // // some calculation for the F/CD pallets load
                else if (truckZones == 2) {
                    result = totalFrozenPallets/maxPalletCount <= 1/truckZones;
                    if (!result) {
                        console.log("Number of Frozen pallets exceeds the maximum volume: 1/2 of load");
                        targetRow.style = "background-color:yellow";
                        validationValue -= 1;
                    }
                }
                else if ( truckZones == 3) {
                    result = totalFrozenPallets/maxPalletCount <= 0.8;
                    if (!result) {
                        console.log("But number of Frozen pallets exceeds the maximum volume: 80% of load");
                        targetRow.style = "background-color:yellow";
                        validationValue -= 1;
                    }
                }
               validationValue += 1;  
            }
            else {
                console.log("Form not valid!");
                console.log(validationValue);
                targetRow.style = "background-color:red";
            }
        }
        console.log("final:");
        console.log(validationValue);
        if (validationValue == (rows-1)) {
            console.log("ALL rows in the table are valid!");
        }
        else {
            console.log("Check the yellow/red rows again!");
        }

    })     

}

function registerTour(){
    // rows is a number of rows in the table
    // rows is including header row!
    const rows = document.getElementById('tour_table').rows.length;
    /* TODO now we need to write a way to grab tada from the table
        and send a reqeust to registed each row as a tour */

        // returns true or false
    if (false) {

        // // first we need to register the TOur and then every row as Destination point
        // const delivery_id_field = document.getElementById('delivery_id_field');
        // const delivery_date = document.getElementById('exec_date');
        // const truck_id = document.getElementById('truck_id');
        // const driver_id = document.getElementById('driver_id');
        // fetch('/register_tour', {
        //     method: "POST",
        //     body: JSON.stringify({
        //         delivery_id: delivery_id_field.value,
        //         exec_date : delivery_date.value,
        //         truck_id: truck_id.value,
        //         driver_id: driver_id.value,
        //     }),
        // })
        // .then(response => response.json())
        // .then(data => {
        //     console.log(data);
        // })



        // for (var i = 1; i < rows; i++){
        //     //getting vital values:
        //     const destination = document.getElementById(`Destination:${i}`);
        //     const deliveryTime = document.getElementById(`time:${i}`);          
        //     const fPallets = document.getElementById(`frozen:${i}`);
        //     const cPallets = document.getElementById(`chilled:${i}`);
        //     const dPallets = document.getElementById(`dry:${i}`);
            
        //     /* if form is valid we fetch registration for every line */

        //     fetch('/register_delivery_point', {
        //         method: "POST",
        //         body: JSON.stringify({
        //             destination: destination.innerHTML,
        //             time : deliveryTime.value,
        //             fpallets: fPallets.value,
        //             cpallets: cPallets.value,
        //             dpallets: dPallets.value,
        //         }),
        //     })
        //     .then(response => response.json())
        //     .then(data => {
        //         console.log(data);
        //     })
        // }
    } 
    else {
        console.log("11111");
    }


}