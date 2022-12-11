document.addEventListener("DOMContentLoaded", function() {
    // Get the list of destinations
    loadDestinationList();
});


function loadDestinationList() {
    fetch('/get_destination_list')
    .then(response => response.json())
    .then(data => {
        data = JSON.parse(data);
        data.forEach(element => {
            console.log(element);
        });
    })
}