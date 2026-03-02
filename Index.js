function showScreen(id){

    let screens = document.querySelectorAll(".screen");
    screens.forEach(s => s.classList.add("hidden"));

    document.getElementById(id).classList.remove("hidden");
}

function saveQuestion(){
    alert("Frågan sparades!");
}
function goBack(){

    // Rensa alla inputfält
    let inputs = document.querySelectorAll(".answerInput");
    inputs.forEach(input => input.value = "");

    // Gå tillbaka till titleScreen
    showScreen('titleScreen');
}