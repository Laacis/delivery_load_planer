document.addEventListener("DOMContentLoaded", function() {
    // let's make the page display Tours for today when loaded
    const todaydate = new Date().toISOString().split('T')[0];
    getTourList(todaydate);
    crdateInpandButton();

    // load the top navigation
    loadTopNav();
});

// createing input field
function crdateInpandButton() {
    const sideBar = document.getElementById('view_tours_input_field');
    const viewDate = document.createElement('input');
    viewDate.type = 'date';
    viewDate.id = 'view_date_input';
    viewDate.classList = 'form-control';
    
    sideBar.appendChild(viewDate);
    //creating label for input
    const dateLabel = document.createElement('label');
    dateLabel.for = 'view_date_input';
    dateLabel.innerHTML = 'Date:';
    dateLabel.classList = "form-label";
    sideBar.appendChild(dateLabel);

    //creating button
    const buttonField = document.getElementById('view_tours_button_field');
    const showToursButton = document.createElement('button');
    showToursButton.classList = 'btn btn-success form-control';
    showToursButton.type = 'submit';
    showToursButton.textContent = "Find Tours";
    buttonField.appendChild(showToursButton);
    showToursButton.addEventListener('click', function(){
        //cleaning up all data in tour_display_list if any
        const tourDisp = document.getElementById('tour_display_list');
        tourDisp.replaceChildren();
        //get value from viewDate input
        if (viewDate.value != "") {
            getTourList(viewDate.value);
        }
        else {
            viewDate.focus();
        }

    })
}

function getTourList(date){
    const tourList = document.getElementById('tour_display_list');

    const headderL = document.createElement('h4');
    headderL.innerHTML = `Tour list for: ${date}`
    tourList.appendChild(headderL);

    // make table
    const tableL = document.createElement('table');
    tableL.id = 'tour_table'
    tableL.classList = "table table-hover";
    tourList.appendChild(tableL);
    // adding table head
    const tlHead = document.createElement('thead');
    tableL.appendChild(tlHead);
    const trHead = document.createElement('tr');
    tlHead.appendChild(trHead);
    const trHeadList = ['Tour id', 'Delivery id', 'Driver id', 'Truck id', 'Destinations'];
    trHeadList.forEach( item => {
        const thItem = document.createElement('th');
        thItem.innerHTML = item;
        trHead.appendChild(thItem);
    }) 
     // adding table body
    const tBody = document.createElement('tbody');
    tableL.appendChild(tBody);

    // getting data
    fetch(`/get_tour_list/${date}`)
    .then(response => response.json())
    .then(data => {
        data.forEach(element => {
            const rowL = document.createElement('tr');
            tBody.appendChild(rowL);
            console.log(element);
            Object.entries(element).forEach(entry => {
                const [key, value] = entry
                console.log(entry);
                const rowData = document.createElement('td');
                rowData.innerHTML = value;
                rowData.classList = 'table-control';
                rowL.appendChild(rowData);
            });
        })
    })
}


/** Function creates the top navigation A tags as button elements that 
 * redirects  the Planner in case to manage the displayed elements
 */
function loadTopNav() {
    const topNavRow = document.getElementById('top_nav_row');
    const navItemNames = ['Trucks', 'Drivers', 'Destinations', 'Delivery plans']
    navItemNames.forEach( element => {
        //div col
        const colMdDiv = document.createElement('div');
        colMdDiv.classList = 'col-md';
        topNavRow.appendChild(colMdDiv);
        // a tag as button
        const aTagB = document.createElement('a');
        aTagB.classList = 'btn btn-outline-secondary form-control';
        aTagB.role = 'button';
        aTagB.innerHTML = element;
        if (element.includes("plans")){
            aTagB.href = `/delivery_plans`;
        }
        else {
            aTagB.href = `/${element.toLowerCase()}`;
        }
        colMdDiv.appendChild(aTagB);
    })

}