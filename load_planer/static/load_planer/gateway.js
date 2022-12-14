document.addEventListener("DOMContentLoaded", function() {
    fixTheForm();
});

function fixTheForm() {
    const listOfIds = ['id_first_name', 'id_last_name', 'id_driver_id']
    listOfIds.forEach(item => {
        const targetTag = document.getElementById(item);
        targetTag.classList = 'form-control';
    })
}