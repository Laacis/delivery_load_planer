document.addEventListener("DOMContentLoaded", function() {
    checkifPlanner();
});
// globals

let planner = false;

/** probavbly not the best way to check if user is a planner, but
 * rest of API won't return anything useful if this is manipulated to be true if it's not
 * this only tells the script to draw the Fields and tables 
 * that are valuable for Planner only. 
 * Pestination page is left to be accessed by drivers, so they have access to the 
 * contacts and address in case of need.
 * this function returns bool and set's up global 
 */
function checkifPlanner() {
    fetch('/am_i_planner')
    .then(response => response.json())
    .then(data => {
        if ( data['planner'] == true) { planner = true;}
        console.log(planner);
    })
}