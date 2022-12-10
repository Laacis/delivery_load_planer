document.addEventListener("DOMContentLoaded", function() {
    makeVerifyButton();
});
var uid = 0;
/** creates a button and add event listener that veryfies a driver
 * via POST to /verufy_drive/<uid>
 */
function makeVerifyButton() {
    const liField = document.getElementById('button_li');
    if (liField == null) {
        console.log("liField is NULL!");
        const unverId = document.getElementById('unver_driver');
        const textDiv = document.createElement('div');
        textDiv.innerHTML = "No unverified Drivers to display.";
        unverId.appendChild(textDiv);
    }
    else {
        uid = liField.innerHTML;
        liField.innerHTML = "";
        const buttonLi = document.createElement('button');
        buttonLi.classList = "btn btn-warning form-control";
        buttonLi.textContent = "Quick verify";
        liField.appendChild(buttonLi);
        buttonLi.addEventListener('click', verifyDriver);
    }


}

function verifyDriver(event){
    // getting profile id
    uid = parseInt(uid);
    fetch(`/verify_driver/${uid}`, {
        'method': 'POST'
    })
    .then(response => response.json())
    .then(response => {
        location.reload();
    })

}