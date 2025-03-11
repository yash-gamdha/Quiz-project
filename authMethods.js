async function signUp(username, email, password, callback) {
    const url = "http://localhost:8080/api/signup";

    const body = {
        "username": username,
        "email": email,
        "password": password
    };

    try {
        const response = await fetch(
            url,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body)
            }
        );

        if (response.status === 200) {
            const textResponse = await response.text();
            callback(textResponse, false);
        } else {
            const jsonResponse = await response.json();
            callback(jsonResponse, true);
        }
    } catch (error) {
        callback({ message: error.message }, true);
    }
}

async function login(username, password, callback) {
    console.log("hello from logIn");
    const url = "http://localhost:8080/api/login";

    const body = {
        "username": username,
        "password": password
    };

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body)
        });

        if (response.status === 200) {
            const data = await response.json();  // Parse the JSON
            console.log("Login successful:", data);
            setCookie("username", data.username, 30);
            callback(data, false);
        } else {
            const errResponse = await response.json();
            console.log("Login error:", errResponse);
            callback(errResponse, true);
        }
    } catch (error) {
        console.error("Login exception:", error);
        callback({ message: error.message }, true);
    }
}

async function deleteAccount(username, password, callback) {
    const url = "http://localhost:8080/api/remove";

    const body = {
        "username": username,
        "password": password
    };

    try {
        const response = await fetch(
            url,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body)
            }
        );

        if (response.status === 200) {
            const textResponse = await response.text();
            console.log("Delete account successful:", textResponse);
            deleteCookie("username");
            callback(textResponse, false);
        } else {
            const errorResponse = await response.text();
            console.log("Delete account failed:", errorResponse);
            callback(errorResponse, true);
        }
    } catch (error) {
        console.error("Delete account exception:", error);
        callback(error.message, true);
    }
}

// cookie functions
function setCookie(cname, cValue, exDays) {
    const d = new Date();
    d.setTime(d.getTime() + (exDays * 24 * 60 * 60 * 1000));
    let expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cValue + ";" + expires + ";path=/";
}

function deleteCookie(cname) {
    document.cookie = cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

function getCookie(cname) {
    let name = cname + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie(cname) {
    let cookieValue = getCookie(cname);

    if (cookieValue !== "") {
        return cookieValue;
    }

    return false;
}

export { signUp, login, deleteAccount, getCookie, checkCookie, deleteCookie }