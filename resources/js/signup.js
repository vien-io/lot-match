console.log("signup.js is loaded now");

document.addEventListener("DOMContentLoaded", function() {
    let checkbox = document.getElementById("agreeTerms");
    let signupBtn = document.getElementById("signupBtn");

    checkbox.addEventListener("change", function() {
        signupBtn.disabled = !this.checked;
    });
});