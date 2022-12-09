document.addEventListener("DOMContentLoaded", function() {
    setPlaceholder();
    loadTruckList();
});

/** Fucntion adds form-control class to django form elements
 */
function setPlaceholder(){
    const idList = ['id_truck_id', 'id_pallet_size', 'id_zones'];
    idList.forEach(item => {
        const targetIt = document.getElementById(item);
        targetIt.classList.add('form-control');
    })

}

function loadTruckList() {
    const mainDiv = document.getElementById('truck_main');
    // Creating a row fitting 3 col, for each one card
    const row3col = document.createElement('div');
 

    const dicToUse = {'pallet_size':'Maximum EUR pallets: ', 'zones':'Temperature zones: '}
    fetch('/trucks_list')
    .then(response => response.json())
    .then(data => {
        data = JSON.parse(data);
        console.log(data.length);

        for( let i = 0; i < data.length; i++) {
            if (i % 3 == 0 || i == 0){
                row3col.classList = "row row-cols-3";
                mainDiv.appendChild(row3col);
                console.log('hit shat!');
            }
            const colMd = document.createElement('div');
            colMd.classList = 'col-md';
            row3col.appendChild(colMd);
            const cardDiv = document.createElement('div');
            cardDiv.classList = 'card border-success';
            colMd.appendChild(cardDiv);
            const cardBodyDiv = document.createElement('div');
            cardBodyDiv.classList = 'card-body text-success';
            cardDiv.appendChild(cardBodyDiv);
            
            const cardLi = document.createElement('ul');
            cardLi.classList = 'list-group list-group-flush';
            cardDiv.appendChild(cardLi);

            Object.entries(data[i]).forEach(record => {
                const [key, value] = record;
                if (key == 'truck_id') {
                    // createing card title
                    const cardTitle = document.createElement('strong')
                    cardTitle.classList = 'card-title';
                    cardTitle.innerHTML = `Reefer: ${value}`;
                    cardBodyDiv.appendChild(cardTitle);
                }
                else {
                    const cardText = document.createElement('li')
                    cardText.classList = 'list-group-item';
                    const text = (key in dicToUse)? dicToUse[key]:"some number:"
                    cardText.innerHTML = `${text} ${value}`;
                    cardLi.appendChild(cardText);
                }
            })
        }
    })
}