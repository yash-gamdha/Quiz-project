import { signUp, login } from "./authMethods.js";

const logInBtn = document.getElementById("log_in_btn");
const signUpBtn = document.getElementById("sign_up_btn");

document.getElementById("log-in-form").addEventListener("submit", e => {
    e.preventDefault();
});
document.getElementById("sign-up-form").addEventListener("submit", e => {
    e.preventDefault();
});

const fragmentButtons = document.querySelectorAll(".fragment-button")
const fragmentWrapper = document.querySelector(".fragments")
const fragments = document.querySelectorAll(".fragment")
const selectedFragment = document.getElementById("selected")

fragmentButtons.forEach((button, index) => {
    button.addEventListener("click", () => {
        changeFragment(index)
    })
})

function changeFragment(index, scrollBehavior = 'smooth') {
    const fragmentWidth = fragments[0].offsetWidth
    fragmentWrapper.scrollTo(
        {
            left: index * fragmentWidth,
            behavior: scrollBehavior
        }
    )

    if (selectedFragment.classList.contains("left-1/2")) {
        selectedFragment.classList.remove("-translate-x-full", "left-1/2")
        selectedFragment.classList.add("translate-x-full", "right-1/2")
    } else if (selectedFragment.classList.contains("right-1/2")) {
        selectedFragment.classList.remove("translate-x-full", "right-1/2")
        selectedFragment.classList.add("-translate-x-full", "left-1/2")
    }
}

signUpBtn.addEventListener("click", async () => {
    const username = document.getElementById("username")
    const email = document.getElementById("email")
    const password = document.getElementById("password")
    const confirm = document.getElementById("confirm-password")

    // username validation
    let usernameRegex = /^[a-zA-Z0-9]{6,}$/
    if (username.value.trim() === "") {
        showError(document.getElementById("un_error"), "Please enter a valid username");
        username.focus();
        return false;
    }
    if (!(username.value.trim()).match(usernameRegex)) {
        showError(document.getElementById("un_error"), "Please enter a valid username");
        username.value = "";
        username.focus();
        return false;
    }

    // email validation
    let emailRegex = /^\w+([\.-]?\w)*@\w+([\.-]?\w)*(\.\w{2,3})+$/;
    if (email.value.trim() === "") {
        showError(document.getElementById("email_error"), "Please enter a valid email");
        email.focus();
        return false;
    }
    if (!(email.value.trim()).match(emailRegex)) {
        showError(document.getElementById("email_error"), "Please enter a valid email");
        email.value = "";
        email.focus();
        return false;
    }

    // password and confirm password validation
    if (password.value.trim() === "") {
        showError(document.getElementById("pw_error"), "Please enter your password");
        password.focus();
        return false;
    }
    if (password.value.length < 8) {
        showError(document.getElementById("pw_error"), "Please enter your password");
        password.focus();
        return false;
    }

    if (confirm.value.trim() === "") {
        showError(document.getElementById("cpw_error"), "Please enter confirm password");
        confirm.focus();
        return false;
    }
    if (password.value !== confirm.value) {
        showError(document.getElementById("cpw_error"), "Confirm Password must match with Password");
        confirm.focus();
        return false;
    }

    // sign up function call
    const response = await signUp(username.value, email.value, password.value);

    if (response !== undefined && response != null) {
        if (response === "success") {
            signUpBtn.innerHTML = "Success";
            signUpBtn.classList.add("bg-green-400");
            document.getElementById("sign_up_success").classList.remove("hidden");
        } else {
            showError(document.getElementById("sign_up_error"), response.message);
        }
    }
});

logInBtn.addEventListener("click", async () => {
    const username = document.getElementById("log_in_un");
    const password = document.getElementById("log_in_pw");

    if (username.value.trim() === "") {
        showError(document.getElementById("log_un_error"), "Please enter your username");
        username.focus();
        return false;
    }

    if (password.value.trim() === "") {
        showError(document.getElementById("log_pw_error"), "Please enter your password");
        password.focus();
        return false;
    }

    // log in function call
    const response = await login(username.value, password.value);

    if (response !== undefined && response != null) {
        if (response.username !== null) {
            window.location.href = "./main.html";
        } else {
            showError(document.getElementById("log_in_error"), "Invalid username or password");
        }
    }
});

function showError(domElement, errorMessage) {
    domElement.classList.remove("hidden");
    domElement.innerHTML = errorMessage;
}