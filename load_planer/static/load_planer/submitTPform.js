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
    let totalPalletCount = 0;
    const maxPalletCount = 20; // this number should be fetched from db
    for (var i = 1; i < rows; i++){
        //getting vital values:
        const destination = document.getElementById(`Destination:${i}`);
        const deliveryTime = document.getElementById(`time:${i}`);          
        const fPallets = document.getElementById(`frozen:${i}`);
        const cPallets = document.getElementById(`chilled:${i}`);
        const dPallets = document.getElementById(`dry:${i}`);
        console.log(`Starting check row ${i}.`)
        const destIsValid = /^[0-9a-zA-Z]+$/.test(destination.innerHTML);
        console.log(destIsValid);
        console.log(destination.innerHTML);
        const timeIsValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(deliveryTime.value);
        console.log(timeIsValid);
        console.log(deliveryTime.value);
        const fPisValid = /^[0-9]?[0-9]+$/.test(fPallets.value) && fPallets.value <= maxPalletCount;
        console.log(fPisValid);
        console.log(fPallets.value);
        const cPisValid = /^[0-9]?[0-9]+$/.test(cPallets.value) && cPallets.value <= maxPalletCount;
        console.log(cPisValid);
        console.log(cPallets.value);
        const dPisValid = /^[0-9]?[0-9]+$/.test(dPallets.value) && dPallets.value <= maxPalletCount;
        console.log(dPisValid);
        console.log(dPallets.value);
        if (destIsValid && timeIsValid && fPisValid && cPisValid &&dPisValid){
            // check if total number of pallets is < maxPallets         
            totalPalletCount = parseInt(fPallets.value) + parseInt(cPallets.value) + parseInt(dPallets.value);
            console.log("parseInt:")
            console.log(totalPalletCount);
            if (totalPalletCount >= maxPalletCount) {console.log("form is valid, But number of pallets exceeds the maximum volume!");}
            else {console.log("form is valid!");} // return True

        }
        else {
            console.log("FIELDS NOT VALID!"); //return False
        }
    }
    if (totalPalletCount >= maxPalletCount) {console.log("form is valid, But number of pallets exceeds the maximum volume!");}
    // return False Raise Alert!
        
}
