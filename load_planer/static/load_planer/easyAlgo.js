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
    (monoLoadBool) ? tryAndTestColRowLoads(data, smallLoad, smalloadCount=0, zones, totalPalletsInDelivery) : (fPalletsTotal < cdPalletsTotal)? smallLoad.push('frozen') : smallLoad.push('chilled', 'dry');
 
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
        tryAndTestColRowLoads(data, smallLoad, smalloadCount, zones, totalPalletsInDelivery);
    }
}


function tryAndTestColRowLoads(data, smallLoad, smalloadCount, zones, totalPallets) {

    const palletTypes = {"frozen":"alert-primary", "chilled":"alert-success", "dry":"alert-warning"}
    //pallets will be add to startingRrow, we have two pallets per row: r(rowNr)_l and .._r
    var startingRow = Math.round(totalPallets / 2);
    let jsonPlanData =  getJsonLoadingPlan(data, totalPallets, palletTypes, startingRow);
    // now when we have the JSON data for the laod, we ned to rearrange it, based on the zones

    // we go for the loading style by row
    let finalResultData = algLoadEasy(jsonPlanData, smallLoad, smalloadCount, zones, totalPallets, colStyle = false);
    // implementing neighbour test
    let testRowResults = neighbourIndex(finalResultData); 
    // let's try the Column loading style
    let colAlgoResult = algLoadEasy(jsonPlanData, smallLoad, smalloadCount, zones, totalPallets, colStyle = true);
    /** Now let's get the JSON into actual pallets on the SCHEMA */
    let testColResults = neighbourIndex(colAlgoResult);
    // comapres two results and 
    drowThePallets((testColResults >= testRowResults? colAlgoResult: finalResultData), palletTypes);
}

/** 
 * this function arranges the pallets by row or column (colStyle=true) in the delivery sequesnce 
 * retunrs a JSON where key is row id and value is data to be used in 
 * colStyle - loading pallets follow the rules of putting the first load-out to 
 * the right side(right column) */
function algLoadEasy(jsonPlanData, smallLoad, smalloadCount, zones, totalPallets, colStyle){

    let smallLoadFirst = 0;
    let smallLoadMid = 0; // for 3 zones
    let smallLoadLast = 0;
    let palletCounter = 0;
    let row_Nrs = [];
    let pallets = [];
    let midPalletNumbers = [9,10,11,12,13,14,15,16]; // row 5,6,7,8 pallet number pairs
    Object.entries(jsonPlanData).forEach(entry => {
        const [row_id, value] = entry;
        palletCounter++;
        row_Nrs.push(row_id);
        pallets.push(value);
        Object.entries(value).forEach(entry => {
            const [key, value] = entry
            if (smallLoad.includes(value)) {
                if (zones == 3) {
                    if (midPalletNumbers.includes(palletCounter)) {smallLoadMid++;}
                    else {(palletCounter < (totalPallets/zones))? smallLoadFirst++ : smallLoadLast++;}
                }
                else {
                    ( palletCounter < (totalPallets/zones))? smallLoadFirst++ : smallLoadLast++;
                }
            }
        })
    })
    let smallLoadinMid = ((smallLoadMid >= smallLoadFirst) && (smallLoadMid >= smallLoadLast))? true : false;
    let smallLoadAtDoor = ((smallLoadFirst >= smallLoadLast)&& !smallLoadinMid)? true : false;
    row_Nrs.reverse(); // row_Nrs now start from r1_r to r(n)_l
    pallets.reverse();
    /** let's get smallLoad ids
     * if it's 2 zones, we slice the number of smalload from the wor_Nrs at start
     * or end demepding on the smallLoadAtDoor boolean
     * in case of 3 zones we slice middle depending on the number of pallets.
     */
    let smallLoadRowIds = 0;
    if ( zones == 3 && smallLoadinMid) {
        smallLoadRowIds = row_Nrs.slice(4, (smalloadCount + 4))
        row_Nrs = row_Nrs.filter(item => !(new Set(smallLoadRowIds).has(item)));
    }
    else {
        
                // if small at the door we slize the rowNrs from the end( at the door)
        if(smallLoadAtDoor) {
            smallLoadRowIds = row_Nrs.slice(-smalloadCount);
            row_Nrs = row_Nrs.slice(0, -smalloadCount);
        }
        // else we slice the begining or the rowNr to be used as small load locations
        else {
            smallLoadRowIds = row_Nrs.slice(0, smalloadCount);
            row_Nrs = row_Nrs.slice(smalloadCount);
        }
    }
    /** now we rearrange the row_Nrs[] and smallLoadRowIds as we need them to be in sequesnce of columns */
    if (colStyle) {
        row_Nrs = makeThisColType(row_Nrs);
        smallLoadRowIds = makeThisColType(smallLoadRowIds);
    }
    let result = rowPalletMerge(pallets, row_Nrs, smallLoadRowIds, smallLoad);
    return result;
}

/** support function to merge rows and pallets into JSON data */
function rowPalletMerge(pallets, row_Nrs, smallLoadRowIds, smallLoad){
    let result = {};
    pallets.forEach(item => {
        /** here if we check label value for being in smallLoad, we can sent the item to 
         * the smallLoadRowIds and pop that from the list, else we add the item to 
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
    return result;
}

/** a support function to rearrange the row_id data in an array, in a sequesnce of rows _r or _l */
function makeThisColType(rowData) {
    let leftRow = [];
    let rightRow = [];
    rowData.forEach(element => {
        // if _l element goes to left row, else right row
        (element.slice(-2) == "_l")? leftRow.push(element) : rightRow.push(element);
    })
    rowData = leftRow.concat(rightRow);
    return rowData;
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

/** Function takes JSON and uses keys to target pallet IDs in the schema, by adding value to the 
 * divs and labels
 */
function drowThePallets(finalResultData, palletTypes) {
    Object.entries(finalResultData).forEach(entry => {
        const[key, value] = entry;
        const targetDiv = document.getElementById(key);
        targetDiv.innerHTML = value['Destination'];
        targetDiv.classList.add(palletTypes[value['label']]);
        const targetLabel = document.getElementById(`${key}_label`);
        targetLabel.innerHTML =value['label'];
    })
}

/**
 * Testing this JSON for neighbour relationships
 */
function neighbourIndex(data) {
    let dataToTest ={};
    Object.entries(data).forEach(entry => {
        const[key, value] = entry;
        if (value['Destination'] in dataToTest) {
            dataToTest[value['Destination']].push(key);
        }
        else {
            dataToTest[value['Destination']] = [key];
        }
    })
    let resultData = {};
    Object.entries(dataToTest).forEach(entry => {
        const [key, value] = entry;
        var points = 0;
        for ( let i = 0; i < value.length; i++) {
            let first = value[i];
            let second = value[i+1];
            if (second == undefined) { break;}
            /*
             * going to compare the two strings by cutting part of it
             * if first and second .slice(0, -1) are equal, means they are on the same row 
             * and this gives the +1 point, if .slice(-2) - this shows if they are in the same column
             * and  casted parseInt(first.slice(1,-2)) +1 ==  means same 
             * column and next row, gives +1 points.
             */
            if ( first.slice(0,-1) == second.slice(0,-1)) { points++;}
            else if ( parseInt(first.slice(1,-2)) + 1 == parseInt(second.slice(1,-2))) {points += 1;}
        }
        resultData[key] = (points / value.length);
    })

    // get the average value:
    var indexSum = 0;
    Object.entries(resultData).forEach(entry => {
        const [key, value] = entry;
        indexSum +=value;
    })
    var result = (indexSum / Object.keys(resultData).length).toFixed(2); 
    //fixed returns a string, need to cast result into float
    return parseFloat(result);
}