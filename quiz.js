import Question from "./Question.js";

const baseUrl = "https://opentdb.com/api.php"

const noOfQue = localStorage.getItem("noOfQue")
const categoryId = localStorage.getItem("categoryId")
const difficulty = localStorage.getItem("difficulty")
const isRandom = localStorage.getItem("isRandom")

let questionsFromAPI = null;
let currentQuestionIndex = 0;
let correctAnswerIndex = 0;

const categoryNameHTML = document.getElementById("category_name");
const difficultyHTML = document.getElementById("difficulty");
const questionHTML = document.getElementById("question");
const options = [
    document.getElementById("option1"),
    document.getElementById("option2"),
    document.getElementById("option3"),
    document.getElementById("option4"),
]
const finalScoreHTML = document.getElementById("final_score");
const homeTakerHTML = document.getElementById("home_taker");
const nextHTML = document.getElementById("next");

homeTakerHTML.addEventListener("click", () => {
    window.location.href = "index.html";
})

nextHTML.addEventListener("click", () => {
    currentQuestionIndex = currentQuestionIndex + 1;
    playQuiz()
})

const url = (isRandom === "true") ?
    `${baseUrl}?amount=${Math.floor(Math.random() * 50)}`
    : `${baseUrl}?amount=${noOfQue}&category=${categoryId}&difficulty=${difficulty}`

fetch(
    url,
    {
        method: "GET",
        headers: {
            "Accept": "application/json"
        }
    }
).then(response => response.json())
.then(data => {
    questionsFromAPI = data.results.map((question) => {
        return new Question(
            question.question,
            question.correct_answer,
            question.category,
            question.difficulty,
            question.type,
            question.incorrect_answers
        )
    })

    playQuiz();
}).catch(error => console.log(error))

function playQuiz() {
    if (currentQuestionIndex === questionsFromAPI.length) {
        calculateScore();
        return;
    }

    options.forEach(option => option.children[0].checked = false)

    difficultyHTML.innerText = questionsFromAPI[currentQuestionIndex].difficulty;
    questionHTML.innerHTML = `${currentQuestionIndex + 1}. ${questionsFromAPI[currentQuestionIndex].question}`;
    categoryNameHTML.innerText = questionsFromAPI[currentQuestionIndex].category;

    if (questionsFromAPI[currentQuestionIndex].type === "boolean") {
        options[2].classList.add("hidden")
        options[3].classList.add("hidden")
    } else {
        options[2].classList.remove("hidden")
        options[3].classList.remove("hidden")
    }

    questionsFromAPI[currentQuestionIndex].options.forEach((option, index) => {
        options[index].classList.remove("text-white")
        options[index].classList.add("text-gray-700")
        options[index].classList.remove("bg-green-400")
        options[index].classList.remove("bg-red-400")

        options[index].children[2].innerText = option;

        if (option === questionsFromAPI[currentQuestionIndex].answer) {
            correctAnswerIndex = index;
        }

        options[index].addEventListener("click", () => {
            questionsFromAPI[currentQuestionIndex].isCorrect = options[index].innerText === questionsFromAPI[currentQuestionIndex].answer;

            options[index].classList.remove("text-gray-700")
            options[index].classList.add("text-white")
            options[index].children[1].classList.add("peer-checked:border-white")

            if (questionsFromAPI[currentQuestionIndex].isCorrect) {
                options[index].classList.add("bg-green-400")
            } else {
                options[correctAnswerIndex].classList.add("bg-green-400")
                options[correctAnswerIndex].classList.add("text-white")
                options[index].classList.add("bg-red-400")
            }
        })
    })
}

function calculateScore() {
    let score = 0

    questionsFromAPI.forEach(question => {
        if (question.isCorrect) {
            score++;
        }
    })

    finalScoreHTML.innerText = score.toString();
    document.getElementById("result").classList.remove("hidden");
    homeTakerHTML.classList.remove("hidden");
    nextHTML.classList.add("hidden");
}