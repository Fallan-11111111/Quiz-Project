function showScreen(id){ 
    document.querySelectorAll(".screen").forEach(s=>s.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");
}

/* ================= STATE ================= */
let tempQuestions = [];
let currentQuiz = null;
let currentQuestionIndex = 0;
let score = 0;

/* ================= ADD QUESTION ================= */
function addQuestion(){
    const questionText = document.getElementById("questionInput").value.trim();
    const answers = [
        answer1.value.trim(),
        answer2.value.trim(),
        answer3.value.trim(),
        answer4.value.trim()
    ].filter(a=>a!=="");

    const correctIndex = parseInt(document.getElementById("correctAnswer").value);

    if(!questionText || answers.length===0){
        alert("Fråga och minst ett svar krävs!");
        return;
    }

    tempQuestions.push({question:questionText,answers,correct:correctIndex});

    questionInput.value="";
    answer1.value="";
    answer2.value="";
    answer3.value="";
    answer4.value="";
    document.getElementById("correctAnswer").value="0";

    document.getElementById("questionCounter").textContent =
        `Frågor skapade: ${tempQuestions.length}`;

    showScreen('createQuizScreen');
}

/* ================= SAVE QUIZ ================= */
function saveQuiz(){
    const title=document.getElementById("quizTitle").value.trim();

    if(!title){
        alert("Skriv en titel!");
        return;
    }

    if(tempQuestions.length===0){
        alert("Lägg till minst en fråga!");
        return;
    }

    const quiz={title,questions:[...tempQuestions]};

    let saved=JSON.parse(localStorage.getItem("quizzes"))||[];
    saved.push(quiz);
    localStorage.setItem("quizzes",JSON.stringify(saved));

    tempQuestions=[];
    quizTitle.value="";
    document.getElementById("questionCounter").textContent="Frågor skapade: 0";

    loadQuizzes();
    showScreen('projectsScreen');
}

/* ================= CANCEL ================= */
function cancelQuiz(){
    tempQuestions=[];
    quizTitle.value="";
    document.getElementById("questionCounter").textContent="Frågor skapade: 0";
    showScreen('projectsScreen');
}

/* ================= LOAD ================= */
function loadQuizzes(){
    const list=document.querySelector(".projectList");
    list.innerHTML="";
    const saved=JSON.parse(localStorage.getItem("quizzes"))||[];

    saved.forEach((quiz,i)=>{
        const card=document.createElement("div");
        card.className="projectCard";
        card.innerHTML=`<span>${quiz.title}</span><span class="arrow">›</span>`;
        card.onclick=()=>startQuiz(i);
        list.appendChild(card);
    });
}

/* ================= PLAY ================= */
function startQuiz(index){
    const saved=JSON.parse(localStorage.getItem("quizzes"))||[];
    currentQuiz=saved[index];
    currentQuestionIndex=0;
    score=0;
    document.getElementById("scoreDisplay").textContent=`Poäng: ${score}`;
    playTitle.textContent=currentQuiz.title;
    showScreen('playScreen');
    showQuestion();
}

function showQuestion(){
    const q=currentQuiz.questions[currentQuestionIndex];
    playQuestion.textContent=q.question;

    const box=document.getElementById("playAnswers");
    box.innerHTML="";

    q.answers.forEach((a,i)=>{
        const btn=document.createElement("button");
        btn.className="mainBtn";
        btn.textContent=a;
        btn.onclick=()=>checkAnswer(i,btn);
        box.appendChild(btn);
    });

    questionProgress.textContent =
        `Fråga ${currentQuestionIndex+1} av ${currentQuiz.questions.length}`;
    document.getElementById("nextBtn").disabled=true;
}

function checkAnswer(index,button){
    const q=currentQuiz.questions[currentQuestionIndex];
    const buttons=document.querySelectorAll("#playAnswers button");
    buttons.forEach(b=>b.disabled=true);

    if(index===q.correct){
        button.classList.add("correct");
        score++;
    } else {
        button.classList.add("wrong");
        buttons[q.correct].classList.add("correct");
    }

    document.getElementById("scoreDisplay").textContent=`Poäng: ${score}`;
    document.getElementById("nextBtn").disabled=false;
}

function nextQuestion(){
    if(currentQuestionIndex<currentQuiz.questions.length-1){
        currentQuestionIndex++;
        showQuestion();
    } else {
        alert(`Quiz klart! Slutpoäng: ${score} / ${currentQuiz.questions.length}`);
        showScreen('projectsScreen');
    }
}

/* ================= GLOW ================= */
const glow=document.querySelector(".mouse-glow");
document.addEventListener("mousemove",e=>{
    glow.style.left=e.clientX+"px";
    glow.style.top=e.clientY+"px";
    glow.style.opacity="1";
});
document.addEventListener("mouseleave",()=>{glow.style.opacity="0";});

/* ================= INIT ================= */
window.onload=loadQuizzes;
function checkAnswer(index,button){
    const q = currentQuiz.questions[currentQuestionIndex];
    const buttons = document.querySelectorAll("#playAnswers button");
    buttons.forEach(b => b.disabled = true); // Stoppar fler klick

    if(index === q.correct){
        button.classList.add("correct");
        score++;
    } else {
        button.classList.add("wrong");
        buttons[q.correct].classList.add("correct"); // Visa rätt svar
    }

    document.getElementById("scoreDisplay").textContent = `Poäng: ${score}`;
    document.getElementById("nextBtn").disabled = false;
}