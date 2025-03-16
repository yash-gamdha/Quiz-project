async function signUp(username, email, password, callback) {
    const url = "https://simpleauthproject-production.up.railway.app/api/signup";

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
    const url = "https://simpleauthproject-production.up.railway.app/api/login";

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
            setCookie("username", data.username, 30);
            callback(data, false);
        } else {
            const errResponse = await response.json();
            callback(errResponse, true);
        }
    } catch (error) {
        callback({ message: error.message }, true);
    }
}

async function deleteAccount(username, password, callback) {
    const url = "https://simpleauthproject-production.up.railway.app/api/remove";

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
            deleteCookie("username");
            callback(textResponse, false);
        } else {
            const errorResponse = await response.text();
            callback(errorResponse, true);
        }
    } catch (error) {
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
