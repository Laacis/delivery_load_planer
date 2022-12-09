document.addEventListener("DOMContentLoaded", function() {
    /** Function creates the top navigation A tags as button elements that 
     * redirects  the Planner in case to manage the displayed elements
     */
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

});


