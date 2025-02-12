// JavaScript code to toggle the popup
document.getElementById("trigger-btn").addEventListener("click", function() {
    document.getElementById("notification-popup").style.display = "block";
});

// JavaScript code to close the popup
document.querySelector(".close-btn").addEventListener("click", function() {
    document.getElementById("notification-popup").style.display = "none";
});