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
        // rows is including header row!
        const rows = document.getElementById('tour_table').rows.length;
        /* TODO now we need to write a way to grab tada from the table
            and send a reqeust to registed each row as a tour */

        verificateTableData();

        for (var i = 1; i < rows; i++){
            //getting vital values:
            const destination = document.getElementById(`Destination:${i}`);
            const deliveryTime = document.getElementById(`time:${i}`);          
            const fPallets = document.getElementById(`frozen:${i}`);
            const cPallets = document.getElementById(`chilled:${i}`);
            const dPallets = document.getElementById(`dry:${i}`);
            
            

            // fetch('/register_delivery_point', {
            //     method: "POST",
            //     body: JSON.stringify({
            //         destination: destination.innerHTML,
            //         time : deliveryTime.value,
            //         fpallets: fPallets.value,
            //         cpallets: cPallets.value,
            //         dpallets: dPallets.value,
            //     }),
            // })
            // .then(response => response.json())
            // .then(data => {
            //     console.log(data);
            // })
        }

    })
}


/* 
    This function is going to verify all the data in table
    row by row checking if the input is filled out.
    Server side verification is going to happen as well.
*/
function verificateTableData() {
    const rows = document.getElementById('tour_table').rows.length;
    console.log(`number of rows:${rows}`);
    var totalPalletCount = 0;
    var totalFrozenPallets = 0;
    var totalCDPallets = 0;
    let maxPalletCount = 0; 
    let truckZones = 0;
    const truck_id = document.getElementById("truck_id").value
    fetch(`/get_truck_details/${truck_id}`)
    .then(response => response.json())
    .then(response => {
        // fetched value is set to max pallet count
        maxPalletCount = response["pallet_size"];
        truckZones = response['zones'];

        /* One more check rule to implement is:
            TODO!:
            make script ckeck for the number of F pallets, to the number of truck zones
            if 2 zones, F pallets cant be more than 1/2 of total load
            if 3 zones F pallets can't be more than 2/3 of total load
            use response["zones"] to get zones count
        
        */
        for (var i = 1; i < rows; i++){
            //getting vital values:
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
                totalFrozenPallets += parseInt(fPallets.value);
                totalCDPallets += parseInt(cPallets.value) + parseInt(dPallets.value);
                totalPalletCount += parseInt(fPallets.value) + parseInt(cPallets.value) + parseInt(dPallets.value);
                if (totalPalletCount >= maxPalletCount) {
                    console.log("form is valid, But number of pallets exceeds the maximum volume!");
                }
                else {console.log(`row${i} VALID!`);} // return True

            }
            else {
                console.log(`row${i} NOT VALID!`); //return False
            }
        }
        // TESTING
        console.log(`totalPalletCount:${totalPalletCount}`)
        console.log(`totalFrozenPallets:${totalFrozenPallets}`)
        console.log(`totalCDPallets:${totalCDPallets}`)
        console.log(`maxPalletCount:${maxPalletCount}`)
        console.log(`truckZones:${truckZones}`)
        console.log(`totalFrozenPallets/totalPalletCount : 1/truckZones -> ${totalFrozenPallets/totalPalletCount} : ${1/truckZones}`)
        console.log(`totalFrozenPallets/totalPalletCount : 2/truckZones -> ${totalFrozenPallets/totalPalletCount} : ${2/truckZones}`)


        // TESTING FINISH

        // TODO remember to add a case when theres is only F goods or only C/D goods in the load, rules down under won't work then
        // it's when totalCDPallets or totalFpallets == totalPalletCount 

        let result = false;
        if (totalPalletCount > maxPalletCount) {alert("But number of pallets exceeds the maximum volume!");}
        // some calculation for the F/CD pallets load
        else if (truckZones === 2) {
            result = totalFrozenPallets/maxPalletCount <= 1/truckZones;
            if (!result) {alert("But number of Frozen pallets exceeds the maximum volume: 1/2 of load");}
        }
        else if ( truckZones === 3) {
            result = totalFrozenPallets/maxPalletCount <= 2/truckZones;
            if (!result) {alert("But number of Frozen pallets exceeds the maximum volume: 2/3 of load");}
        }
        

    })
        
}
