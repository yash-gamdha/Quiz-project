import {checkCookie, deleteAccount, deleteCookie} from "./authMethods.js";

const baseUrl = "https://opentdb.com/"

let currentFragment = document.querySelector(".active")
const fragments = document.querySelectorAll(".fragment")
const fragmentWrapper = document.querySelector(".fragments")

const deleteAccDialog = document.getElementById("custom-dialog-box-delete-acc");
document.getElementById("dialog-close-btn-delete-acc").addEventListener("click", () => {
    deleteAccDialog.classList.add("hidden")
})

document.addEventListener("DOMContentLoaded", () => {
    changeFragment(1, "instant")
    const cookieValue = checkCookie("username")
    if (cookieValue !== false) {
        document.getElementById("username").innerText = cookieValue;
    } else {
        window.location.href = "auth.html";
    }
    const contextMenu = document.getElementById("contextMenu");
    const [...menuOptions] = contextMenu.children[0].children;
    menuOptions[0].addEventListener("click", e => {
        deleteCookie("username");
        if (document.cookie === "") {
            window.location.href = "auth.html";
        }
    });

    menuOptions[1].addEventListener("click", e => {
        deleteAccDialog.classList.remove("hidden");
    });

    document.getElementById("deleteAccBtn").addEventListener("click", () => {
        deleteAccount(cookieValue, document.getElementById("delete-acc-pw").value, (response, isError) => {
            if (!isError) {
                if (response.toLowerCase() === "success") {
                    alert("Account deleted successfully")
                } else {
                    alert("Failed to delete account")
                }
            } else {
                alert("Something went wrong")
            }
        })
    });
})

const categories = document.querySelector(".categories")
const catNotSelected =document.getElementById("category-not-selected")
let tabIndex = 4
let selectedCategory = null
let selectedCategoryId = null
let selectedCategoryName = null

const dialogBox = document.getElementById("custom-dialog-box")
document.getElementById("dialog-close-btn").addEventListener("click", () => {
    dialogBox.classList.add("hidden")
})

document.querySelectorAll(".nav-item").forEach((navItem) => {
    navItem.addEventListener("click", () => {
        currentFragment.classList.remove("active")
        currentFragment = navItem
        currentFragment.classList.add("active")

        if (navItem.innerText === "About") {
            changeFragment(0)
        } else if (navItem.innerText === "Home") {
            localStorage.setItem("isRandom", false.toString())
            changeFragment(1)
        } else {
            localStorage.setItem("isRandom", true.toString())
            changeFragment(2)
        }
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
}

function toggleContextMenu() {
    const contextMenu = document.getElementById('contextMenu');
    contextMenu.classList.toggle('hidden');
}

// Close context menu when clicking outside
document.addEventListener('click', function(event) {
    const username = document.getElementById('username');
    const contextMenu = document.getElementById('contextMenu');

    if (!username.contains(event.target) && !contextMenu.contains(event.target)) {
        contextMenu.classList.add('hidden');
    }
});

// Prevent context menu from closing when clicking inside it
document.getElementById('contextMenu').addEventListener('click', function(event) {
    event.stopPropagation();
});

fetch(
    baseUrl + "api_category.php",
    {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    }
).then((response) => {
    return response.json()
}).then((categoriesList) => {
    categoriesList.trivia_categories.forEach((category) => {
        const categoryLabel = document.createElement("label")
        categoryLabel.setAttribute("tabindex", `${tabIndex++}`)
        categoryLabel.onfocus = () => {
            categoryLabel.classList.add("shadow-2xl","hover:bg-black","hover:text-white")
        }
        categoryLabel.onblur = () => {
            categoryLabel.classList.remove("shadow-2xl")
        }
        categoryLabel.classList.add("category", "inconsolata-normal", "rounded-2xl", "inset-shadow-2xs", "hover:shadow-2xl", "cursor-pointer")

        const categoryRadio = document.createElement("input")
        categoryRadio.setAttribute("type", "radio")
        categoryRadio.setAttribute("name", "category")

        categoryLabel.appendChild(categoryRadio)
        categoryLabel.innerHTML = category.name

        categoryLabel.addEventListener("click", () => {
            if (selectedCategory != null) {
                selectedCategory.classList.remove("shadow-2xl", "bg-black","text-white", "shadow-black")
            }
            selectedCategory = categoryLabel
            selectedCategoryId = category.id
            selectedCategoryName = categoryLabel.innerText
            selectedCategory.classList.add("shadow-2xl", "bg-black","text-white", "shadow-black")
            catNotSelected.classList.add("hidden")
        })

        categories.appendChild(categoryLabel);
    })
}).catch((error) => {
    console.log(error)
})

document.getElementById("next").addEventListener("click", () => {
    let isOK = true
    if (selectedCategory == null) {
        catNotSelected.classList.remove("hidden")
        catNotSelected.innerText = "Please select a category"
        isOK = false
    }
    if (isOK) {
        localStorage.setItem("categoryId", selectedCategoryId.toString())
        localStorage.setItem("categoryName", selectedCategoryName)
        dialogBox.classList.remove("hidden")
    }
})

document.getElementById("start").addEventListener("click", () => {
    let isOK = true

    const noOfQue = document.getElementById("noOfQue").value
    const noOfQueError = document.getElementById("noOfQue-error")

    const difficulty = document.getElementById("difficulty-dropdown").value
    const diffNotSelected = document.getElementById("difficulty-error")

    if (parseInt(noOfQue) < 10 || parseInt(noOfQue) > 50 || noOfQue === "") {
        noOfQueError.classList.remove("hidden")
        noOfQueError.innerText = "Please enter a number between 10 and 50"
        isOK = false
    } else {
        localStorage.setItem("noOfQue", noOfQue)
    }

    if (difficulty === "Select Difficulty") {
        diffNotSelected.classList.remove("hidden")
        diffNotSelected.innerText = "Please select a difficulty"
        isOK = false
    } else {
        localStorage.setItem("difficulty", difficulty)
    }

    if (isOK) {
        localStorage.setItem("isRandom", false.toString())
        window.location.href = `${document.location.origin}/quiz.html`;
    }
})

document.getElementById("startRandom").addEventListener("click", () => {
    window.location.href = "./quiz.html";
})