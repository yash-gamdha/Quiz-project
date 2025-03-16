import Question from "./Question.js";
import {getCookie} from "./authMethods.js";

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
const optionsLabels = [
    document.getElementById("option1"),
    document.getElementById("option2"),
    document.getElementById("option3"),
    document.getElementById("option4"),
]

const optionsRadios = []

optionsLabels.forEach(option => {
    optionsRadios.push(option.children[0]);
});

const scoreTextHTML = document.getElementById("scoreText");
const homeTakerHTML = document.getElementById("home_taker");
const nextHTML = document.getElementById("next");

let countdownTimer;
let timeLeft = 90;
let timerDisplay = document.getElementById("timer");

function startTimer() {
    countdownTimer = setInterval(() => {
        if (timeLeft <= 0) {
            stopTimer();
            currentQuestionIndex += 1;
            playQuiz();
        } else {
            if (timeLeft <= 30) {
                timerDisplay.classList.add("text-red-500")
            }
            let minutes = Math.floor(timeLeft / 60);
            let seconds = timeLeft % 60;
            timerDisplay.innerText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            timeLeft--;
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(countdownTimer);
}


$(document).ready(() => {
    const cookieValue = getCookie("username");
    if (cookieValue !== "") {
        $("#username").text(cookieValue).fadeIn(2000);
    } else {
        window.location.href = "auth.html";
    }
})

homeTakerHTML.addEventListener("click", () => {
    window.location.href = "main.html";
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

    $("#loader").hide();
    $("#questions").fadeIn(2000);
    playQuiz();
}).catch(error => console.log(error))

function playQuiz() {
    if (currentQuestionIndex === questionsFromAPI.length) {
        calculateScore();
        return;
    }

    timeLeft = 90;
    startTimer(); // Restart the timer for the next question

    optionsLabels.forEach(option => option.children[0].checked = false)
    enableOptions();

    difficultyHTML.innerText = questionsFromAPI[currentQuestionIndex].difficulty;
    questionHTML.innerHTML = `${currentQuestionIndex + 1}. ${questionsFromAPI[currentQuestionIndex].question}`;
    categoryNameHTML.innerText = questionsFromAPI[currentQuestionIndex].category;

    if (questionsFromAPI[currentQuestionIndex].type === "boolean") {
        optionsLabels[2].classList.add("hidden")
        optionsLabels[3].classList.add("hidden")
    } else {
        optionsLabels[2].classList.remove("hidden")
        optionsLabels[3].classList.remove("hidden")
    }

    questionsFromAPI[currentQuestionIndex].options.forEach((option, index) => {
        optionsLabels[index].classList.remove("text-white")
        optionsLabels[index].classList.add("text-gray-700")
        optionsLabels[index].classList.remove("bg-green-400")
        optionsLabels[index].classList.remove("bg-red-400")

        optionsLabels[index].children[2].innerText = option;

        if (option === questionsFromAPI[currentQuestionIndex].answer) {
            correctAnswerIndex = index;
        }

        optionsLabels[index].addEventListener("click", () => {
            questionsFromAPI[currentQuestionIndex].isCorrect = optionsLabels[index].innerText === questionsFromAPI[currentQuestionIndex].answer;

            optionsLabels[index].classList.remove("text-gray-700")
            optionsLabels[index].classList.add("text-white")
            optionsLabels[index].children[1].classList.add("peer-checked:border-white")

            if (questionsFromAPI[currentQuestionIndex].isCorrect) {
                optionsLabels[index].classList.add("bg-green-400")
            } else {
                optionsLabels[correctAnswerIndex].classList.add("bg-green-400")
                optionsLabels[correctAnswerIndex].classList.add("text-white")
                optionsLabels[index].classList.add("bg-red-400")
            }

            stopTimer();
            disableOptions(index);
        })
    })
}

function disableOptions(selectedOptionIndex) {
    optionsRadios.forEach((option, index) => {
        if (selectedOptionIndex !== index) {
            option.disabled = true;
        }
    })
}

function enableOptions() {
    optionsRadios.forEach(option => {
        option.disabled = false;
    })
}

function calculateScore() {
    let score = 0;

    questionsFromAPI.forEach(question => {
        if (question.isCorrect) {
            score++;
        }
    });

    const scoreCard = document.getElementById('scoreCard');
    const scoreGauge = document.getElementById('scoreGauge');
    const scoreText = document.getElementById('scoreText');

    // Reveal the scorecard
    scoreCard.classList.add("revealed");
    $("#result").slideDown(3000);
    homeTakerHTML.classList.remove("hidden");
    nextHTML.classList.add("hidden");

    // Calculate score percentage
    const scorePercent = (score / questionsFromAPI.length) * 100;
    const roundedScorePercent = Math.round(scorePercent);
    scoreText.textContent = `${roundedScorePercent}%`;

    // Update the path for the score gauge
    const radius = 65; // Radius used in the SVG path
    const center = { x: 100, y: 100 }; // Center point of the gauge
    const startAngle = Math.PI; // Start from left (180 degrees or π radians)
    const maxAngle = 0; // End at right (0 degrees)
    const totalAngle = Math.abs(startAngle - maxAngle); // Total angle of the arc

    // Calculate the angle for the current score
    const scoreAngle = startAngle - (scorePercent / 100) * totalAngle;

    // Convert angle to end point coordinates
    const endX = center.x + radius * Math.cos(scoreAngle);
    const endY = center.y - radius * Math.sin(scoreAngle); // Subtract because SVG Y axis is inverted

    // Create the arc path
    const largeArcFlag = scorePercent > 50 ? 1 : 0;
    const path = `M 35 100 A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY}`;

    scoreGauge.setAttribute('d', path);

    scoreTextHTML.innerText = score.toString();
}