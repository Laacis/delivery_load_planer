/** this file contains algorithm and functions for loading plan of the reefer
 * the result is either Easy or Hard
 * if Easy is possible then the load will be placed in a way that the Driver 
 * can unload pallets in a sequence of delivery, without replacing pallets inside 
 * the reefer. The first delivery pallets will be placed closes to the doors, 
 * the last delivery point pallets will be placed deep inside the reefer.
 * as a rule, we can place the last pallets to the left side, if a mix of
 * F and CD pallets have to be delivered at the last.
 * The result of Easy or Hard vary from the number of Temperature zones of Reefer.
 * !!! THIS IS JUST A TEST VERSION of and only looks into the main Reefer.
 * Even the Main Reefer is mostly paired with a Hanger, and the load is destrebuted
 * between those two loading volumes. In this project I only focus on the main reefer
 * Maybe in the future I'll add the Hanger as well, but for now for MVP 
 * I only focus on the Main Reefer and it's loding. 
*/


/** this function takes data as argument, data is JSON loaded from 
 * get_delivery_point_table/tour_id
 */
function loadPLanMain(data, pallet_size, zones) {
    //let's find out if it's a full load (sum FCD pallets == pallet_size)
    let fulload = false;
    //number of delivery destinations
    let nrOfDeliveries = 0;
    // totla number of Froze nad Chill+Dry pallets
    let fPalletsTotal = 0;
    let cdPalletsTotal = 0;
    let totalPalletsInDelivery = 0;
    
    Object.entries(data).forEach(entry => {
        const [key, value] = entry;
        nrOfDeliveries++;
        Object.entries(value).forEach(entry => {
            const [key, value] = entry
            if (key == "frozen"){
                fPalletsTotal += value;
                totalPalletsInDelivery += value;
            }
            else if (['chilled', 'dry'].includes(key)) {
                cdPalletsTotal += value;
                totalPalletsInDelivery += value;
            }

        })

    })
    if (cdPalletsTotal + fPalletsTotal == pallet_size) { fulload = true;}
    

    /* checking if it monoload type (all load consists only of F or CD goods, not mixed)
    * this is supposed to be easy, as algo don't has to sort pallets of temperature control
    * case when monoload is true, is to be rare and should not happen often in practice
    * of actual deliveries, when we deliver goods for food-courts and restaurants.
    */
   const fMonoLoad = (fPalletsTotal == totalPalletsInDelivery)? true : false;
   //change to const after testing
   let cdMonoLoad = (cdPalletsTotal == totalPalletsInDelivery)? true: false;
   // CHANGE THIS!!!!!!!!
   //rurrning the monoLoad on purpouse: 
   cdMonoLoad = true;
   if (fMonoLoad || cdMonoLoad) {monoLoadEasy(data, totalPalletsInDelivery);}

   

}


/** this function will take every delivery point starting from last,
 * pick number of pallets from the data JSON and assign number of palelts to 
 * preloaded schema of reefer, only one temperature zone is neede in this case
 */
function monoLoadEasy(data, totalPallets) {
    //only going to look at values that have keys of  types, frozen chilled and dry
    const palletTypes = {"frozen":"alert-primary", "chilled":"alert-success", "dry":"alert-warning"}
    const palletCountEven = (totalPallets % 2 == 0)? true: false;
    //pallets will be add to startingRrow, we have two pallets per row: r(rowNr)_l and .._r
    var startingRow = Math.round(totalPallets / 2);
    /**
     * this switch is telling algo if the left pallet in the row is free to use, else use right
     * if the palletCount of the load is EVEN switch is true, if ODD = switch os false, 
     * so we have only one pallet in the startingRow
     */
    let switchL = palletCountEven? true : false;
    Object.entries(data).forEach(entry => {
        const [key, value] = entry;
        let destinationId = "";
        Object.entries(value).forEach(entry => {
            const [key, value] = entry
            
            if (key == "Destination") {
                destinationId = value;
            }
            else if (key in palletTypes) {
                for ( var i = value; i > 0; i--) {
                    const l_r_rowLoca = (switchL)? "l" : "r";
                    const targetId = document.getElementById(`r${startingRow}_${l_r_rowLoca}`);
                    targetId.innerHTML = destinationId;
                    targetId.classList.add(palletTypes[key]);
                    const targetLabel = document.getElementById(`r${startingRow}_${l_r_rowLoca}_label`);
                    targetLabel.innerHTML = key;
                    // flip the switch
                    switchL = !switchL;
                    // if pallet in right position was filled then chage row
                    if ( l_r_rowLoca == "r") {startingRow -= 1;}
                }
            }
        })

    })
}