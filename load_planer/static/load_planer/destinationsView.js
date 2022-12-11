document.addEventListener("DOMContentLoaded", function() {
    // Get the list of destinations
    loadDestinationList();
    loadInputField();
});
// globals
let card_list = [];
let list_to_display = [];

function loadDestinationList() {
    fetch('/get_destination_list')
    .then(response => response.json())
    .then(data => {
        data = JSON.parse(data);
        data.forEach(element => {
            card_list.push(element['destination_id'])
        });
        console.log(card_list);
    })
}


function loadInputField() {
    const inputField = document.getElementById('filter_input');
    inputField.addEventListener("keyup", filterRequest);

}

function filterRequest(event) {
    // displayFilteredList();
    restoreAllCard();
    
    for ( let item of card_list) {
        if (item.toLocaleLowerCase().startsWith(event.target.value.toLocaleLowerCase()) && event.target.value != "") {
            if (!list_to_display.includes(item)){
                list_to_display.push(item);
            }

            const targetT = document.getElementById(item);
            let match_char = "<b>" + item.substring(0, event.target.value.length) + "</b>";
            match_char += item.substring(event.target.value.length);
            targetT.innerHTML = match_char;
            displayFilteredList();
        }
    }
    console.log(list_to_display);
    list_to_display = [];
    
}


function restoreAllCard() {
    // target all cards and reset display to block
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

function displayFilteredList() {
    try {
        card_list.forEach(item => {
            if ( list_to_display.includes(item)){
                console.log(item);
                const cardDivV = document.getElementById(`id_${item}`);
                cardDivV.style.display = 'block';
            }
            else {
                const cardDivV = document.getElementById(`id_${item}`);
                cardDivV.style.display = 'none';
            }
            
        })
    }
    catch {
        console.log("nothing to display!");
    }
}
    