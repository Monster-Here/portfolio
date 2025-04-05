console.log("JavaScript is live");
const themeBtn = document.getElementById("themeBtn");
let isDark = false;

themeBtn.addEventListener("click", () => {
    isDark = !isDark; // Toggle state

    document.body.style.backgroundColor = isDark ? "#1e1e1e" : "#f0f0f0";
    document.body.style.color = isDark ? "#fff" : "#333";

    themeBtn.textContent = isDark ? "Change Theme ☀️" : "Change Theme 🌗";
});

