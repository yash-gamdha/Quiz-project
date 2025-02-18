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
            selectedCategory.classList.add("category-hover-checked")
        })

        categories.appendChild(categoryLabel);
    })
}).catch((error) => {
    console.log(error)
})

document.getElementById("start").addEventListener("click", () => {
    const name = document.getElementById("name")
    const noOfQues = document.getElementById("no_of_que")
    const difficulty = document.getElementById("difficulty")
    let okValidation = true

    let nameRegex = /^[a-zA-Z]+(?:\s+[a-zA-Z]+)*$/g
    if (name.value === '') {
        alert("Enter name")
        okValidation = false
    } else {
        if (nameRegex.test(name.value)) {
            localStorage.setItem("name", name.value)
        } else {
            alert("Enter name properly")
            okValidation = false
        }
    }

    if (noOfQues.value === '') {
        alert("Enter no of questions")
        okValidation = false
    } else {
        if (noOfQues.value < '1' || noOfQues.value > '50') {
            alert("Invalid No. of questions")
            okValidation = false
        } else {
            localStorage.setItem("noOfQue", noOfQues.value)
        }
    }

    if (selectedCategoryId == null) {
        alert("select a category")
        okValidation = false
    } else {
        localStorage.setItem("categoryId", selectedCategoryId.toString())
    }

    if (difficulty.value === 'Select difficulty') {
        alert("Select difficulty")
        okValidation = false
    } else {
        localStorage.setItem("difficulty", difficulty.value)
    }

    if (okValidation) {
        window.location.href = "quiz.html"
    }
})