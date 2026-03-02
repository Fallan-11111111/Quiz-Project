function showScreen(id) {
    let screens = document.querySelectorAll(".screen");
    screens.forEach(s => s.classList.add("hidden"));

    document.getElementById(id).classList.remove("hidden");
}

function saveQuestion() {

    const titleInput = document.getElementById("quizTitle");
    const title = titleInput ? titleInput.value : "";

    const answers = document.querySelectorAll("#createQuestionScreen .answerInput");

    if (title === "") {
        alert("Skriv en titel!");
        return;
    }

    let answerArray = [];

    answers.forEach(input => {
        if (input.value.trim() !== "" && input.id !== "quizTitle") {
            answerArray.push(input.value.trim());
        }
    });

    if (answerArray.length === 0) {
        alert("Skriv minst ett svar!");
        return;
    }

    // Skapa quiz-objekt
    const quiz = {
        title: title,
        answers: answerArray
    };

    // Hämta gamla quiz
    let savedQuizzes = JSON.parse(localStorage.getItem("quizzes")) || [];

    // Lägg till nytt
    savedQuizzes.push(quiz);

    // Spara
    localStorage.setItem("quizzes", JSON.stringify(savedQuizzes));

    alert("Quiz sparat!");

    clearInputs();
    showScreen('projectsScreen');
}

function clearInputs() {
    let inputs = document.querySelectorAll(".answerInput");
    inputs.forEach(input => input.value = "");
}

function loadQuizzes() {

    const projectList = document.querySelector(".projectList");
    if (!projectList) return;

    let savedQuizzes = JSON.parse(localStorage.getItem("quizzes")) || [];

    // rensa gamla auto-skapade (behåll dina fasta kort om du vill)
    savedQuizzes.forEach((quiz) => {

        const card = document.createElement("div");
        card.classList.add("projectCard");

        card.innerHTML = `
            <span>${quiz.title}</span>
            <span class="arrow">›</span>
        `;

        card.onclick = () => showScreen('createQuestionScreen');

        projectList.appendChild(card);
    });
}

// kör när sidan laddas
loadQuizzes();