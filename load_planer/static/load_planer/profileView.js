document.addEventListener("DOMContentLoaded", function() {
    checkifPlanner();
});
// globals here
var uid = 0; 

/** Function checks if requesting user is Planner */
function checkifPlanner() {
    fetch('/am_i_planner')
    .then(result => result.json())
    .then(result => {
        if( result['planner']){driverButtonLoad();}        
    })
}


/** function checks if text in action list is matching the innerHTM lext of v_result <li>
 * if so it creates a button to register/ remove the driver from verified list.
 * Other cases when user has not provided the db with personal information like:
 * name, lastname and Driver ID(ID is given by Employer), can not be registred until user provides 
 * the required data. in Case of Planner viewing own profile: only admin can verify Planner
 * via admin pannel.
 * Should only work for Planners. All requested API used here.
 * are chacking if the user is verified and has Planner status.
 */
function driverButtonLoad() {
    const actionlist = [
        "Verified as Driver.",
        "Not verified as Driver."
        ]
    // check the innerHTML of #v_result
    const resultLi = document.getElementById('v_result');
    const resulKey = (resultLi.innerHTML).trim();
    if (actionlist.includes(resulKey)) {
        const profileDiv = document.getElementById('profile_strong');
        uid = parseInt(profileDiv.innerHTML);
        // get to ul tag and append child button
        const mainUl = document.getElementById('card_ul');
        const buttonD = document.createElement('button');
        buttonD.classList = 'btn btn-success form-contro';
        buttonD.textContent = 'Button';
        mainUl.appendChild(buttonD);
        if (resulKey.includes('Not')){
            buttonD.classList = 'btn btn-success form-control';
            buttonD.textContent = 'Verify as Driver';
            resultLi.classList.add('text-danger');
        }
        else {
            buttonD.classList = 'btn-outline-danger form-control';
            buttonD.textContent = 'Remove from verified Driver';
            resultLi.classList.add('text-success');
        }
        buttonD.addEventListener('click', function(){
            fetch(`/verify_driver/${uid}`, {
                'method': 'POST'
            })
            .then(result => result.json())
            .then(data => {
                location.reload();
            })
        })
    }
}