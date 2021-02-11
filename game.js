const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");
let currentQuestion = {};
let acceptingAnswers = true;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questions = [];

fetch("questions.json")
    .then(res => {
        return res.json();
    })
    .then(loadedQuestions => {
        console.log(loadedQuestions);
        questions = loadedQuestions;
        startGame();
    })
    .catch(err => {
        console.error(err);
    });
//constants
const Correct_bonus = 10;
const Max_questions = 3;
startGame = () => {
    questionCounter = 0;
    score = 0;
    availableQuestions = [...questions];
    getNewQuestion();
    game.classList.remove("hidden");
    loader.classList.add("hidden");
};
getNewQuestion = () => {

    if (availableQuestions.length == 0 || questionCounter >= Max_questions) {
        localStorage.setItem("mostRecentScore",score);
        return window.location.assign("end.html");
    }
    questionCounter++;
    progressText.innerText = "Question  " + questionCounter + "/" + Max_questions;
    //Update Progress Bar

    progressBarFull.style.width = (questionCounter/Max_questions * 100)+"%";

    const questionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionIndex];
    question.innerText = currentQuestion.question;
    choices.forEach(choice => {
        const number = choice.dataset["number"];
        choice.innerText = currentQuestion["choice" + number];
    });
    availableQuestions.splice(questionIndex, 1);
    acceptingAnswers = true;
};
choices.forEach(choice => {
    choice.addEventListener("click", e => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset["number"];
        const classToApply = selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

        if (classToApply == "correct") {
            incrementScore(Correct_bonus);
        }

        selectedChoice.parentElement.classList.add(classToApply);
        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    });
});

incrementScore = num => {
    score += num;
    scoreText.innerText = score;
}
