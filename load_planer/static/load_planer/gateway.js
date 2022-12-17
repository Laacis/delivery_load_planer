document.addEventListener("DOMContentLoaded", function() {
    fixTheForm();
});

/** adding some custom bootstrap options to to form input elements,
 * that are not other way available for customization.
 */
function fixTheForm() {
    const listOfIds = ['id_first_name', 'id_last_name', 'id_driver_id']
    listOfIds.forEach(item => {
        try {
            const targetTag = document.getElementById(item);
            targetTag.classList = 'form-control';
        }
        catch {
            //probably it's Planners profile, they don't have any Details, and not supposed to have any.
        }
    })
}