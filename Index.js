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

    let savedQuizzes = JSON.parse(localStorage.getItem("quizzes")) || [];

    console.log("Sparade quiz:", savedQuizzes);
}
loadQuizzes();