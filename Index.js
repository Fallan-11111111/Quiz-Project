// ===========================
// SKÄRMHANERING
// ===========================
function showScreen(id) {
    document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");
}

// ===========================
// VARIABLER
// ===========================
let currentQuiz = { title: "", questions: [] };
let tempQuestions = [];
let currentQuestionIndex = 0;

// ===========================
// ADD QUESTION
// ===========================
function addQuestion() {
    const questionText = document.getElementById("questionInput").value.trim();
    const answers = [
        document.getElementById("answer1").value.trim(),
        document.getElementById("answer2").value.trim(),
        document.getElementById("answer3").value.trim(),
        document.getElementById("answer4").value.trim()
    ].filter(a => a !== "");

    if (questionText === "" || answers.length === 0) {
        alert("Fråga och minst ett svar krävs!");
        return;
    }

    tempQuestions.push({ question: questionText, answers: answers });

    // Rensa inputs
    document.getElementById("questionInput").value = "";
    document.getElementById("answer1").value = "";
    document.getElementById("answer2").value = "";
    document.getElementById("answer3").value = "";
    document.getElementById("answer4").value = "";

    // Visa antal frågor
    document.getElementById("questionCounter").textContent = `Frågor skapade: ${tempQuestions.length}`;

    // Gå tillbaka till quiz screen
    showScreen('createQuizScreen');
}

// ===========================
// SAVE QUIZ
// ===========================
function saveQuiz() {
    const title = document.getElementById("quizTitle").value.trim();
    if (title === "") {
        alert("Skriv en titel för quizen!");
        return;
    }
    if (tempQuestions.length === 0) {
        alert("Lägg till minst en fråga!");
        return;
    }

    currentQuiz = { title: title, questions: tempQuestions };

    // Hämta gamla quiz från localStorage
    let savedQuizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
    savedQuizzes.push(currentQuiz);
    localStorage.setItem("quizzes", JSON.stringify(savedQuizzes));

    alert("Quiz sparat!");
    tempQuestions = [];
    currentQuiz = { title: "", questions: [] };
    document.getElementById("quizTitle").value = "";
    document.getElementById("questionCounter").textContent = "Frågor skapade: 0";

    loadQuizzes();
    showScreen('projectsScreen');
}

// ===========================
// CANCEL QUIZ
// ===========================
function cancelQuiz() {
    tempQuestions = [];
    document.getElementById("quizTitle").value = "";
    document.getElementById("questionCounter").textContent = "Frågor skapade: 0";
    showScreen('projectsScreen');
}

// ===========================
// LOAD QUIZZES
// ===========================
function loadQuizzes() {
    const projectList = document.querySelector(".projectList");
    projectList.innerHTML = "";

    const savedQuizzes = JSON.parse(localStorage.getItem("quizzes")) || [];

    savedQuizzes.forEach((quiz, i) => {
        const card = document.createElement("div");
        card.classList.add("projectCard");
        card.innerHTML = `
            <span>${quiz.title}</span>
            <span class="arrow">›</span>
        `;
        card.onclick = () => startQuiz(i);
        projectList.appendChild(card);
    });
}

// ===========================
// START QUIZ
// ===========================
function startQuiz(index) {
    const savedQuizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
    currentQuiz = savedQuizzes[index];
    currentQuestionIndex = 0;

    document.getElementById("playTitle").textContent = currentQuiz.title;
    showScreen('playScreen');
    showQuestion();
}

// ===========================
// SHOW QUESTION
// ===========================
function showQuestion() {
    const questionObj = currentQuiz.questions[currentQuestionIndex];
    document.getElementById("playQuestion").textContent = questionObj.question;

    const answersDiv = document.getElementById("playAnswers");
    answersDiv.innerHTML = "";
    questionObj.answers.forEach(ans => {
        const btn = document.createElement("button");
        btn.textContent = ans;
        btn.classList.add("mainBtn");
        answersDiv.appendChild(btn);
    });

    document.getElementById("questionProgress").textContent =
        `Fråga ${currentQuestionIndex + 1} av ${currentQuiz.questions.length}`;
}

// ===========================
// NEXT QUESTION
// ===========================
function nextQuestion() {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    } else {
        alert("Quiz klart!");
        showScreen('projectsScreen');
    }
}

// ===========================
// INIT
// ===========================
window.onload = function() {
    loadQuizzes();
};