import Question from "./Question.js"
import question from "./Question.js";

const baseUrl = "https://opentdb.com/api.php"

const username = localStorage.getItem("name")
const noOfQue = localStorage.getItem("noOfQue")
const categoryId = localStorage.getItem("categoryId")
const difficulty = localStorage.getItem("difficulty")

const questionsHTML = document.getElementById("questions")
let questionIdForRadio = 0
let score = 0

let questionsFromAPI = null

fetch(
    `${baseUrl}?amount=${noOfQue}&category=${categoryId}&difficulty=${difficulty}`,
    {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        }
).then((response) => {
    return response.json()
}).then((questionsList) => {
    questionsFromAPI = questionsList.results.map(question => {
        return new Question(
            question.question,
            question.correct_answer,
            question.incorrect_answers
        )
    })

    addQuestions()
}).catch((error) => {
    console.log(error)
})

function addQuestions() {
    if (questionsFromAPI != null) {
        questionsFromAPI.forEach((question, index) => {
            const questionsContainer = document.createElement("div")
            questionsContainer.classList.add("question-container")

            const questionDiv = document.createElement("div")
            questionDiv.classList.add("question", "fs-x-large")
            questionDiv.innerHTML = `${index + 1}. ${question.question}`

            questionsContainer.appendChild(questionDiv)


            const options = document.createElement("div")
            options.classList.add("options")

            question.options.forEach(option => {
                const radio = document.createElement("input")
                radio.setAttribute("type", "radio")
                radio.setAttribute("name", `Question${index + 1}`)
                radio.setAttribute("id", `${questionIdForRadio}`)

                const label = document.createElement("label")
                label.setAttribute("for", `${questionIdForRadio}`)
                label.innerHTML = `<span class="custom-radio"></span>${option}`

                label.addEventListener("click", () => {
                    question.isCorrect = label.innerText === question.answer;
                })

                options.appendChild(radio)
                options.appendChild(label)

                questionIdForRadio++
            })

            questionsContainer.appendChild(options)
            questionsHTML.appendChild(questionsContainer)
        })
    }
}

document.getElementById("submitBtn").addEventListener("click", () => {
    if (questionsFromAPI != null) {
        questionsFromAPI.forEach(question => {
            if (question.isCorrect) {
                score++
            }
        })
    }
    console.log(score)
})