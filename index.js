import {getCookie} from "./authMethods.js";

document.addEventListener("DOMContentLoaded", () => {
    const cookieValue = getCookie("username");

    if (cookieValue !== false && cookieValue !== "") {
        window.location.href = "main.html";
    }
})