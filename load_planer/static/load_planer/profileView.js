document.addEventListener("DOMContentLoaded", function() {
    console.log("loaded!");
    checkifPlanner();
});

var profId = 0; // ned this later
function checkifPlanner() {
    const profileDiv = document.getElementById('profile_strong');
    profId = parseInt(profileDiv.innerHTML);
    console.log(profId)

}