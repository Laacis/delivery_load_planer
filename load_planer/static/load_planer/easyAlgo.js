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
    const monoLoadBool = ((cdPalletsTotal == totalPalletsInDelivery) || (fPalletsTotal == totalPalletsInDelivery))? true : false;

    const smallLoad = [];
    // if it's monoload we start the monoLoadEasy, else we define the smallLoad array to be frozen or chilles/dry
    (monoLoadBool) ? monoLoadEasy(data, totalPalletsInDelivery) : (fPalletsTotal < cdPalletsTotal)? smallLoad.push('frozen') : smallLoad.push('chilled', 'dry');
    console.log(smallLoad);
 
    /** If it's not a monoload but mixed load, we assume that the there's at 
     * least 4 pallets of the smallest load type either Frozen or Chilled+Dry.
     * (the submitTPform.js will only allow to registed mixed loads of minimum 4 pallets smallest type)
     * Now we have to look at ZONES, this number defines in how many locations we can 
     * place these 4+ pallets, 2 or 3 locations: 
     * if 2 zones: reefers are placed at row 10+9 and 1+2
     * if 3 zones: reefers are placed at row 10+9, 6+5 and 1+2
     */
    if (smallLoad.length != 0) {
        const smalloadCount = (smallLoad.includes('frozen'))? fPalletsTotal : cdPalletsTotal;
        mixedLoadTryEasy(data, smallLoad, smalloadCount, pallet_size, zones, fulload, totalPalletsInDelivery, nrOfDeliveries);
        // console.log("running mixed LOAD");
    }
    
    /**
     * compare fPalletsTotal and cdPalletsTotal the smallest one is the small load.
     * then start tracking the small load counting pallets:
     * 1) if plcaing them from the first row to the last
     * 2) and the same counting from the last to the first 
     * to make the load easy, we will place the small load in the segment of rows,
     * covering from the mentioned calculations, but it must be placed according to the reefer zones.
     * ! if only zones are 3
     * in case of 2 zones we have to place the small load in row 1+2++ or 10+9--
     */
    

    /** If  f and c+d pallets number are equal,  we agree that it's only possible in our example as
     * a 20 pallets max load reefer, as 14 pallets load can't be 50/50 of F and C+D pallets due to 
     * not being able to provide EVEN count of pallets per row if fulload = true;
     */
    const evenLoad = (fPalletsTotal ==  cdPalletsTotal);
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

function mixedLoadTryEasy(data, smallLoad, smalloadCount, pallet_size, zones, fulload, totalPallets, nrOfDeliveries) {
    console.log(fulload);

    const palletTypes = {"frozen":"alert-primary", "chilled":"alert-success", "dry":"alert-warning"}
    const palletCountEven = (totalPallets % 2 == 0)? true: false;
    //pallets will be add to startingRrow, we have two pallets per row: r(rowNr)_l and .._r
    var startingRow = Math.round(totalPallets / 2);
    let jsonPlanData =  getJsonLoadingPlan(data, totalPallets, palletTypes, startingRow);
    // now when we have the JSON data for the laod, we ned to rearrange it, based on the zones

    // we go for the 2 zones reefer first here
    let hardLoadV1 = letsDoothis(jsonPlanData, smallLoad, smalloadCount, zones, nrOfDeliveries);
    //console.log(jsonPlanData);
    //console.log(hardLoadV1);

    /** Now let's get the JSON into actual pallets on the SCHEMA */
    mixedLOadHard(hardLoadV1, palletTypes);
}

/** this is something terrigble! :D */
function letsDoothis(jsonPlanData, smallLoad, smalloadCount, zones, nrOfDeliveries) {
    /* we agree that the first pallet's to be loaded(row 10-9) are the smalleLoad type, if they have to be 
     * delivered in the first half of the delivery, else they have to be loaded in the end (row 1-2)
     */
    let smallLoadFirst = 0;
    let smallLoadLast = 0;
    let palletCounter = 0;
    let row_Nrs = [];
    let pallets = [];
    Object.entries(jsonPlanData).forEach(entry => {
        const [row_id, value] = entry;
        palletCounter++;
        row_Nrs.push(row_id);
        pallets.push(value);
        Object.entries(value).forEach(entry => {
            const [key, value] = entry
            if (smallLoad.includes(key)) {
                ( palletCounter < nrOfDeliveries/2)? smallLoadFirst++ : smallLoadLast++
            }
        })
    })
    let smallLoadAtDoor = (smallLoadFirst >= smallLoadLast)? true : false;
    row_Nrs.reverse(); // row_Nrs now start from r1_r to r(n)_l
    pallets.reverse(); // now objects start from del_sequesnce with highst number in value
    let smallLoadRowIds = 0;
    let result = {}
    if (zones == 2) {
        if(smallLoadAtDoor) {
            smallLoadRowIds = row_Nrs.slice(-smalloadCount);
            row_Nrs = row_Nrs.slice(0, -smalloadCount);
        }
        else {
            smallLoadRowIds = row_Nrs.slice(0, smalloadCount);
            row_Nrs = row_Nrs.slice(smalloadCount);
        }

        pallets.forEach(item => {

                /** here if we check label value for being in smallLoad, we can sent the item to 
                 * the smallLoadRowIds and pop that if rmo list, else we add the item to 
                 * the row_Nrs list and pop
                 */

            if (smallLoad.includes(item['label'])){
                result[smallLoadRowIds[0]] = item;
                smallLoadRowIds.shift();
            }
            else {
                result[row_Nrs[0]] = item;
                row_Nrs.shift()
            }
        })
        

    }
    console.log(smallLoadRowIds);
    console.log(row_Nrs);
    console.log(result);
    return result;

}



/** this function returns JSON 
 *  {`r(Nr of row)_(r or l)` : {
 *      "del_sequence_nr": number of delivery sequence,
        "Destination":destinationId,
        "label": type of pallet load F/C/D,} }
 */
function getJsonLoadingPlan(data, totalPallets, palletTypes, startingRow) {
    let switchL = (totalPallets %2 == 0)? true : false;
    let result = {};
    Object.entries(data).forEach(entry => {
        const [key_of_del, value] = entry;
        let destinationId = "";
        Object.entries(value).forEach(entry => {
            const [key, value] = entry
            if (key == "Destination") {
                destinationId = value;
            }
            else if (key in palletTypes) {
                for ( var i = value; i > 0; i--) {
                    const l_r_rowLoca = (switchL)? "l" : "r";
                    result[`r${startingRow}_${l_r_rowLoca}`] = {
                        "del_sequence_nr": key_of_del,
                        "Destination":destinationId,
                        "label": key,
                    }
                    // flip the switch
                    switchL = !switchL;
                    // if pallet in right position was filled then chage row
                    if ( l_r_rowLoca == "r") {startingRow -= 1;}
                }
            }
        })
    })
    return result;
}

/** FUnction takes JSON and uses keys to target pallet IDs in the schema, by adding value to the 
 * divs and labels
 */
function mixedLOadHard(hardLoadV1, palletTypes) {
    console.log(hardLoadV1);

    Object.entries(hardLoadV1).forEach(entry => {
        const[key, value] = entry;
        const targetDiv = document.getElementById(key);
        targetDiv.innerHTML = value['Destination'];
        targetDiv.classList.add(palletTypes[value['label']]);
        const targetLabel = document.getElementById(`${key}_label`);
        targetLabel.innerHTML =value['label'];

    })
}