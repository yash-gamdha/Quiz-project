const baseUrl = "https://opentdb.com/"

const categories = document.querySelector(".categories")

let selectedCategory = null
let selectedCategoryId = null

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
        categoryLabel.classList.add("category", "fs-medium")

        const categoryRadio = document.createElement("input")
        categoryRadio.setAttribute("type", "radio")
        categoryRadio.setAttribute("name", "category")

        categoryLabel.appendChild(categoryRadio)
        categoryLabel.innerHTML = category.name

        categoryLabel.addEventListener("click", () => {
            if (selectedCategory != null) {
                selectedCategory.classList.remove("category-hover-checked")
            }
            selectedCategory = categoryLabel
            selectedCategoryId = category.id
            console.log(selectedCategoryId)
            selectedCategory.classList.add("category-hover-checked")
        })

        categories.appendChild(categoryLabel);
    })
}).catch((error) => {
    console.log(error)
})

document.getElementById("start").addEventListener("click", () => {
    let name = document.getElementById("name")
    let noOfQues = document.getElementById("no_of_que")

    let nameRegex = /^[a-zA-Z\-]+$/g
    if (name.value === '') {
        alert("Enter name")
    } else {
        if (nameRegex.test(name.value)) {
            localStorage.setItem("name", name.value)
        } else {
            alert("Enter name properly")
        }
    }

    if (noOfQues.value === '') {
        localStorage.setItem("noOfQue", '10')
    } else {
        localStorage.setItem("noOfQue", noOfQues.value)
    }

    if (selectedCategoryId == null) {
        alert("select a category")
    } else {
        localStorage.setItem("categoryId", selectedCategoryId.toString())
    }

    window.location.href = "quiz.html"
})