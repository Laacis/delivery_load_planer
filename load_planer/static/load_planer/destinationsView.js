document.addEventListener("DOMContentLoaded", function() {
    // Get the list of destinations
    loadDestinationList();
    loadInputField();
    styleCleanInput();
    styleRegForm();
});
// globals
let card_list = [];
let list_to_display = [];

/** cleaning up un reload and setting focus on the input field */
function styleCleanInput() {
    const inputField = document.getElementById('filter_input');
    inputField.value ="";
    inputField.placeholder = "filter by ID: AAA00";
    inputField.focus();
}

/** styling the form field */
function styleRegForm(){
    const idDict = {
        "id_destination_id": "id: AAA00", 
        "id_address":"Street name, building Nr. 00", 
        "id_zipcode": "0000", 
        "id_contact_number":"phone number"
    }
    Object.entries(idDict).forEach(entry =>{
        const [key,value] = entry;
        const targetIt = document.getElementById(key);
        targetIt.classList ='form-control mb-2';
        targetIt.value = "";
        targetIt.placeholder = value;
    })
}

/** fetches and generates a list of destination ID's */
function loadDestinationList() {
    fetch('/get_destination_list')
    .then(response => response.json())
    .then(data => {
        data = JSON.parse(data);
        data.forEach(element => {
            card_list.push(element['destination_id'])
        });
    })
}

/** event Listener for filter input */
function loadInputField() {
    const inputField = document.getElementById('filter_input');
    inputField.addEventListener("keyup", filterRequest);
}

/** function takes user input into filter on keyup, compares the inpiut on partial match with
 *  items from card_list and pushes that item to list_to display if match */
function filterRequest(event) {
    restoreAllCard();
    for ( let item of card_list) {
        if (item.toLocaleLowerCase().startsWith(event.target.value.toLocaleLowerCase()) && event.target.value != "") {
            if (!list_to_display.includes(item)){
                list_to_display.push(item);
            }
            // making visible the match on the card
            const targetT = document.getElementById(item);
            let match_char = "<b>" + item.substring(0, event.target.value.length) + "</b>";
            match_char += item.substring(event.target.value.length);
            targetT.innerHTML = match_char;
            displayFilteredList();
        }
    }
    // need to reset the list to clean up the partial matches
    list_to_display = [];  
}

/** target all cards and reset display to block */
function restoreAllCard() {
    try {
        const cardsDiv = document.querySelectorAll('.card');
        cardsDiv.forEach(item => {
            item.style.display = 'block';
        })
    }
    catch {
        console.log("Nothing to restore!");
    }
}

/** changes display of ids matching both lists card_list and list_to_display */
function displayFilteredList() {
    try {
        card_list.forEach(item => {
            const cardDivV = document.getElementById(`id_${item}`);
            cardDivV.style.display = (list_to_display.includes(item))? 'block':'none';
        })
    }
    catch {
        console.log("nothing to display!");
    }
}
    