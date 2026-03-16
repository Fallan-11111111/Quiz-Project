/* ================= STATE & INIT ================= */
let tempQuestions = [];
let currentQuiz = null;
let currentQuestionIndex = 0;
let score = 0;
let timerInterval;
let timeLeft = 15; // 15 sekunder per fråga

window.onload = () => {
    loadQuizzes();
};

/* ================= NAVIGATION ================= */
function showScreen(id) {
    clearInterval(timerInterval); // Stoppa timer om vi lämnar spel-skärmen
    document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
    document.getElementById(id).classList.remove("hidden");
    if(id === 'projectsScreen') loadQuizzes();
}

/* ================= MUS-STJÄRNOR ================= */
document.addEventListener("mousemove", (e) => {
    // Skapa bara stjärnor ibland för att inte krascha datorn
    if(Math.random() > 0.3) return; 
    
    const star = document.createElement("div");
    star.className = "mouse-star";
    star.style.left = e.clientX + "px";
    star.style.top = e.clientY + "px";
    const size = Math.random() * 4 + 2;
    star.style.width = size + "px";
    star.style.height = size + "px";
    
    document.body.appendChild(star);
    setTimeout(() => star.remove(), 800);
});

/* ================= ROBOT LOGIK & EFFEKTER ================= */
function robotSpeak(text, type = 'normal') {
    const r = document.getElementById("robotContainer");
    const b = document.getElementById("robotSpeech");
    
    b.textContent = text;
    b.style.display = "block";
    r.classList.remove("happy", "sad");
    
    if(type === 'correct') {
        r.classList.add("happy");
        createRobotEffect('correct');
    } else if(type === 'wrong') {
        r.classList.add("sad");
        createRobotEffect('wrong');
    }
    
    setTimeout(() => { r.classList.remove("happy", "sad"); }, 1000);
    setTimeout(() => { b.style.display = "none"; }, 3000);
}

function createRobotEffect(type) {
    const container = document.getElementById("robotEffects");
    container.innerHTML = ""; // Rensa gamla effekter

    if(type === 'correct') {
        // Skapa 8 stjärnor som skjuts ut i en cirkel
        for(let i = 0; i < 8; i++) {
            const star = document.createElement("div");
            star.className = "burst-star";
            const angle = (i / 8) * Math.PI * 2;
            const dist = 60; // Hur långt de åker
            star.style.setProperty('--tx', Math.cos(angle) * dist + 'px');
            star.style.setProperty('--ty', Math.sin(angle) * dist - 20 + 'px');
            container.appendChild(star);
        }
    } else if (type === 'wrong') {
        // Skapa blixt
        const bolt = document.createElement("div");
        bolt.className = "lightning";
        bolt.textContent = "⚡";
        container.appendChild(bolt);
        setTimeout(() => bolt.remove(), 600); // Blixten försvinner efter 0.6s
    }
}

/* ================= CRUD: SKAPA & SPARA QUIZ ================= */
function addQuestion() {
    const qText = document.getElementById("questionInput").value.trim();
    const radios = document.getElementsByName("correctRadio");
    const inputs = document.querySelectorAll(".answerInput");
    
    let ansArray = [];
    let correctMappedIndex = -1;
    let selectedRadioIndex = -1;

    // Hitta vilken radio-knapp som är itryckt
    radios.forEach((r, idx) => { if(r.checked) selectedRadioIndex = idx; });

    // Hämta svar, ignorera tomma
    for(let i = 0; i < 4; i++) {
        const val = inputs[i].value.trim();
        if(val !== "") {
            ansArray.push(val);
            if(i === selectedRadioIndex) {
                correctMappedIndex = ansArray.length - 1; // Kartlägg till den nya, kortare arrayen
            }
        } else if (i === selectedRadioIndex) {
            robotSpeak("Du kan inte sätta ett tomt fält som rätt svar!", "wrong");
            return;
        }
    }

    if(!qText || ansArray.length < 2) {
        robotSpeak("Frågan behöver text och minst 2 svarsalternativ!", "wrong");
        return;
    }
    
    if(correctMappedIndex === -1) {
        robotSpeak("Glöm inte att markera vilket svar som är rätt!", "wrong");
        return;
    }

    // Spara frågan temporärt
    tempQuestions.push({ question: qText, answers: ansArray, correct: correctMappedIndex });
    
    // Nollställ formuläret
    document.getElementById("questionInput").value = "";
    inputs.forEach(i => i.value = "");
    radios[0].checked = true; // Återställ radio till första
    document.getElementById("questionCounter").textContent = `Antal frågor i detta quiz: ${tempQuestions.length}`;
    
    robotSpeak("Fråga sparad! Riktigt smart.", "correct");
    showScreen('createQuizScreen');
}

function saveQuiz() {
    const title = document.getElementById("quizTitle").value.trim();
    if(!title || tempQuestions.length === 0) {
        robotSpeak("Du saknar titel eller frågor!", "wrong");
        return;
    }

    const savedQuizzes = JSON.parse(localStorage.getItem("quizzes")) || [];
    savedQuizzes.push({ id: Date.now(), title: title, questions: [...tempQuestions] });
    localStorage.setItem("quizzes", JSON.stringify(savedQuizzes));

    tempQuestions = [];
    document.getElementById("quizTitle").value = "";
    document.getElementById("questionCounter").textContent = "Antal frågor i detta quiz: 0";
    robotSpeak("Quizet sparades i ditt bibliotek!", "correct");
    showScreen('projectsScreen');
}

function cancelQuiz() {
    tempQuestions = [];
    document.getElementById("quizTitle").value = "";
    document.getElementById("questionCounter").textContent = "Antal frågor i detta quiz: 0";
    showScreen('projectsScreen');
}

/* ================= CRUD: LÄS & RADERA QUIZ ================= */
function loadQuizzes() {
    const list = document.getElementById("projectList");
    if (!list) return;

    list.innerHTML = "";
    const saved = JSON.parse(localStorage.getItem("quizzes")) || [];

    if (saved.length === 0) {
        list.innerHTML = `<p style="text-align:center; color:rgba(255,255,255,0.5)">Biblioteket är tomt.</p>`;
        return;
    }

    saved.forEach((quiz, index) => {
        const card = document.createElement("div");
        card.className = "projectCard";
        
        card.innerHTML = `
            <div style="flex-grow: 1;" onclick="startQuiz(${index})">
                <strong style="display:block; font-size:1.2em; color:var(--cyan)">${quiz.title}</strong>
                <small style="color:rgba(255,255,255,0.6)">${quiz.questions.length} frågor</small>
            </div>
            <button class="deleteBtn" onclick="deleteQuiz(event, ${index})">Radera</button>
        `;
        list.appendChild(card);
    });
}

function deleteQuiz(event, index) {
    event.stopPropagation(); // Förhindrar att spelet startar när man klickar Radera
    if(confirm("Är du säker på att du vill radera detta quiz?")) {
        let saved = JSON.parse(localStorage.getItem("quizzes")) || [];
        saved.splice(index, 1); // Ta bort elementet ur arrayen
        localStorage.setItem("quizzes", JSON.stringify(saved));
        loadQuizzes(); // Ladda om listan
        robotSpeak("Quiz raderat.", "normal");
    }
}

/* ================= PLAY & TIMER LOGIK ================= */
function startQuiz(index) {
    const saved = JSON.parse(localStorage.getItem("quizzes")) || [];
    currentQuiz = saved[index];
    currentQuestionIndex = 0;
    score = 0;
    showScreen('playScreen');
    showQuestion();
}

function showQuestion() {
    const q = currentQuiz.questions[currentQuestionIndex];
    document.getElementById("playTitle").textContent = currentQuiz.title;
    document.getElementById("playQuestion").textContent = q.question;
    document.getElementById("scoreDisplay").textContent = `Poäng: ${score}`;
    
    const box = document.getElementById("playAnswers");
    box.innerHTML = "";

    // Skapa knappar för varje sparade svar (kan vara 2, 3 eller 4 st)
    q.answers.forEach((a, i) => {
        const btn = document.createElement("button");
        btn.className = "mainBtn";
        btn.textContent = a;
        btn.onclick = () => checkAnswer(i, btn);
        box.appendChild(btn);
    });

    const progress = (currentQuestionIndex / currentQuiz.questions.length) * 100;
    document.getElementById("progressFill").style.width = progress + "%";
    document.getElementById("nextBtn").disabled = true;

    startTimer(); // Starta Kahooot-timern!
}

function startTimer() {
    clearInterval(timerInterval);
    timeLeft = 15; // 15 sekunder
    const timerFill = document.getElementById("timerFill");
    timerFill.style.width = "100%";
    timerFill.style.backgroundColor = "var(--correct)";

    timerInterval = setInterval(() => {
        timeLeft -= 0.1;
        const percentage = (timeLeft / 15) * 100;
        timerFill.style.width = percentage + "%";

        // Ändra färg när tiden håller på att ta slut
        if(percentage < 50) timerFill.style.backgroundColor = "var(--gold)";
        if(percentage < 25) timerFill.style.backgroundColor = "var(--wrong)";

        if(timeLeft <= 0) {
            clearInterval(timerInterval);
            timeOut();
        }
    }, 100); // Uppdatera var 0.1 sekund för en mjuk animation
}

function timeOut() {
    robotSpeak("Tiden är ute!", "wrong");
    const q = currentQuiz.questions[currentQuestionIndex];
    const allBtns = document.querySelectorAll("#playAnswers button");
    
    allBtns.forEach(b => b.disabled = true);
    if(allBtns[q.correct]) {
        allBtns[q.correct].classList.add("correct"); // Visa rätt svar ändå
    }
    
    document.getElementById("nextBtn").disabled = false;
}

function checkAnswer(idx, btn) {
    clearInterval(timerInterval); // Stoppa timern när användaren klickar
    
    const q = currentQuiz.questions[currentQuestionIndex];
    const allBtns = document.querySelectorAll("#playAnswers button");
    allBtns.forEach(b => b.disabled = true);

    if(idx === q.correct) {
        btn.classList.add("correct");
        score += Math.ceil(timeLeft); // Bonuspoäng för att svara snabbt!
        robotSpeak(`Snyggt! +${Math.ceil(timeLeft)} poäng!`, "correct");
    } else {
        btn.classList.add("wrong");
        allBtns[q.correct].classList.add("correct");
        robotSpeak("Ah, fel svar denna gång.", "wrong");
    }
    
    document.getElementById("scoreDisplay").textContent = `Poäng: ${score}`;
    document.getElementById("nextBtn").disabled = false;
}

function nextQuestion() {
    if(currentQuestionIndex < currentQuiz.questions.length - 1) {
        currentQuestionIndex++;
        showQuestion();
    } else {
        finishQuiz();
    }
}

function finishQuiz() {
    clearInterval(timerInterval);
    showScreen('resultScreen');
    
    // Maxpoäng beräknas som "antal frågor * 15" eftersom man kan få max 15 p per fråga
    const maxPossibleScore = currentQuiz.questions.length * 15; 
    document.getElementById("finalScoreDisplay").textContent = `${score} p`;
    
    const percent = (score / maxPossibleScore) * 100;
    let msg = percent >= 75 ? "Mästerligt spelat!" : "Bra försök, träna mer!";
    document.getElementById("resultMessage").textContent = `Du fick ${score} av ${maxPossibleScore} möjliga poäng. ${msg}`;
    
    robotSpeak("Spelet är över!", "normal");
}