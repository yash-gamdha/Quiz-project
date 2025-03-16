import {signUp, login, getCookie} from "./authMethods.js";

document.addEventListener("DOMContentLoaded", () => {
    const logInBtn = document.getElementById("log_in_btn");
    const signUpBtn = document.getElementById("sign_up_btn");
    document.getElementById("log-in-form").addEventListener("submit", e => {
        e.preventDefault();
    });
    document.getElementById("sign-up-form").addEventListener("submit", e => {
        e.preventDefault();
    });

    const closedEyePath = "M4 10C4 10 5.6 15 12 15M12 15C18.4 15 20 10 20 10M12 15V18M18 17L16 14.5M6 17L8 14.5";
    const openEyePath = "M4 12C4 12 5.6 7 12 7M12 7C18.4 7 20 12 20 12M12 7V4M18 5L16 7.5M6 5L8 7.5M15 13C15 14.6569 13.6569 16 12 16C10.3431 16 9 14.6569 9 13C9 11.3431 10.3431 10 12 10C13.6569 10 15 11.3431 15 13Z";

    $(document).ready(() => {
        $("#pw-toggle").click(() => {
            const pwHtml = $("#password");
            if (pwHtml.attr("type") === "password") {
                pwHtml.attr("type", "text");
                $("#pw-toggle").children("path").attr("d", closedEyePath);
            } else {
                pwHtml.attr("type", "password");
                $("#pw-toggle").children("path").attr("d", openEyePath);
            }
        });
        $("#cpw-toggle").click(() => {
            const cpwHtml = $("#confirm-password");
            if (cpwHtml.attr("type") === "password") {
                cpwHtml.attr("type", "text");
                $("#cpw-toggle").children("path").attr("d", closedEyePath);
            } else {
                cpwHtml.attr("type", "password");
                $("#cpw-toggle").children("path").attr("d", openEyePath);
            }
        });
        $("#log-pw-toggle").click(() => {
            const logInPwHtml = $("#log_in_pw");
            if (logInPwHtml.attr("type") === "password") {
                logInPwHtml.attr("type", "text");
                $("#log-pw-toggle").children("path").attr("d", closedEyePath);
            } else {
                logInPwHtml.attr("type", "password");
                $("#log-pw-toggle").children("path").attr("d", openEyePath);
            }
        });
    });

    const cookieValue = getCookie("username");

    if (cookieValue !== false && cookieValue !== "") {
        window.location.href = "main.html";
    }

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
        const username = document.getElementById("username");
        const email = document.getElementById("email");
        const password = document.getElementById("password");
        const confirm = document.getElementById("confirm-password");

        // username validation
        let usernameRegex = /^[a-zA-Z0-9]{6,}$/;
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

        // Disable button while processing to prevent multiple submissions
        signUpBtn.disabled = true;
        signUpBtn.innerHTML = "Signing up...";

        // sign up function call
        signUp(username.value, email.value, password.value, (response, isError) => {
            if (isError) {
                const errorMessage = typeof response === 'object' ? response.message : response;
                showError(document.getElementById("sign_up_error"), errorMessage);

                signUpBtn.disabled = false;
                signUpBtn.innerHTML = "Sign Up";
            } else {
                if (response !== undefined && response !== null) {
                    if (response.trim() === "success") {
                        signUpBtn.innerHTML = "Success";
                        signUpBtn.classList.add("bg-green-400");
                        document.getElementById("sign_up_success").classList.remove("hidden");
                    } else {
                        console.log("Unexpected success response:", response);
                        signUpBtn.disabled = false;
                        signUpBtn.innerHTML = "Sign Up";
                    }
                }
            }
        });
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

        logInBtn.disabled = true;
        logInBtn.innerHTML = "Logging in...";

        // log in function call
        login(username.value, password.value, (response, isError) => {
            if (isError) {
                showError(document.getElementById("log_in_error"), "Invalid username or password");
                logInBtn.disabled = false;
                logInBtn.innerHTML = "Log In";

                // log in function call
                login(username.value, password.value, (response, isError) => {
                    if (isError) {
                        showError(document.getElementById("log_in_error"), "Invalid username or password");
                        logInBtn.disabled = false;
                        logInBtn.innerHTML = "Log In";
                    } else {
                        if (response && response.username) {
                            window.location.href = "main.html";
                            // window.open("https://quiz-project-js.vercel.app/main.html", "_blank");
                        } else {
                            if (response && response.username) {
                                window.location.href = "./main.html";
                                // window.open("http://localhost:63342/Quiz-project/main.html", "_blank");
                            } else {
                                showError(document.getElementById("log_in_error"), "Login failed. Please try again.");
                            }
                        }
                    }
                })
            }
        })
    })
})

function showError(domElement, errorMessage) {
    domElement.classList.remove("hidden");
    domElement.innerHTML = errorMessage;
}
