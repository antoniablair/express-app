$(document).ready(function() {
    console.log( "Page is loaded");
});


function checkform(content) {
    console.log("Checked");
    console.log("Content is: " + content);
    if (!content) {
        console.log("You can't do that");
    }
}