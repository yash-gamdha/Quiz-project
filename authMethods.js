async function signUp(username, email, password) {
    const url = "https://simple-auth-project-latest.onrender.com/api/signup"

    const body = {
        "username": username,
        "email": email,
        "password": password
    }

    try {
        const response = fetch(
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
            return await response.text()
        } else {
            return await response.json().message;
        }
    } catch (error) {
        return error.message;
    }
}

async function login(username, password) {
    const url = "https://simple-auth-project-latest.onrender.com/api/login";

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
            return data.username;  // Return the username
        } else {
            const errMessage = await response.json();
            return errMessage.message;
        }
    } catch (error) {
        return error.message;  // Return error message if something goes wrong
    }
}

async function deleteAccount(username, password) {
    const url = "https://simple-auth-project-latest.onrender.com/api/remove"

    const body = {
        "username": username,
        "password": password
    }

    try {
        const response = fetch(
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
            return await response.text();
        }
    } catch (error) {
        return error.message;
    }
}

export { signUp, login, deleteAccount }