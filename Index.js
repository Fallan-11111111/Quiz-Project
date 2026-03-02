function showScreen(id){

    let screens = document.querySelectorAll(".screen");
    screens.forEach(s => s.classList.add("hidden"));

    document.getElementById(id).classList.remove("hidden");
}

function saveQuestion(){

    const title = document.getElementById("quizTitle").value;
    const answers = document.querySelectorAll("#createQuestion .answerInput");

    if(title === ""){
        alert("Skriv en titel!");
        return;
    }

    let answerArray = [];

    answers.forEach(input => {
        if(input.value !== "" && input.id !== "quizTitle"){
            answerArray.push(input.value);
        }
    });

    if(answerArray.length === 0){
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

    // Lägg till nytt quiz
    savedQuizzes.push(quiz);

    // Spara igen
    localStorage.setItem("quizzes", JSON.stringify(savedQuizzes));

    alert("Quiz sparat!");
    loadQuizzes();
    goBack();
}
function goBack(){

    // Rensa alla inputfält
    let inputs = document.querySelectorAll(".answerInput");
    inputs.forEach(input => input.value = "");

    // Gå tillbaka till titleScreen
    showScreen('titleScreen');
}
function loadQuizzes(){

    const quizList = document.getElementById("quizList");
    quizList.innerHTML = "";

    let savedQuizzes = JSON.parse(localStorage.getItem("quizzes")) || [];

    savedQuizzes.forEach((quiz, index) => {

        const quizBtn = document.createElement("button");
        quizBtn.classList.add("mainBtn");
        quizBtn.textContent = quiz.title;

        quizList.appendChild(quizBtn);
    });
}   
loadQuizzes();