let timerInterval;
let isTimerRunning = false;
let timeRemaining = 20 * 60; 
let focusSeconds = 0; 
let flowerArr = JSON.parse(localStorage.getItem('qn_flowers')) || [];

function renderFlowers() { document.getElementById('flowerGarden').innerText = flowerArr.join(' '); }
function formatTime(sec) { let m = Math.floor(sec / 60).toString().padStart(2, '0'); let s = (sec % 60).toString().padStart(2, '0'); return `${m}:${s}`; }

window.toggleTimer = () => {
    const btn = document.getElementById('startTimerBtn');
    if(isTimerRunning) {
        clearInterval(timerInterval); btn.innerText = "Tiếp tục"; isTimerRunning = false;
    } else {
        let inputMins = parseInt(document.getElementById('timerInput').value) || 20;
        if(timeRemaining <= 0 || btn.innerText === "Bắt đầu") timeRemaining = inputMins * 60;
        btn.innerText = "Tạm dừng"; isTimerRunning = true;
        
        timerInterval = setInterval(() => {
            timeRemaining--; focusSeconds++;
            document.getElementById('timerDisplay').innerText = formatTime(timeRemaining);
            if(focusSeconds > 0 && focusSeconds % 1200 === 0) {
                const types = ['🌸', '🌻', '🌹', '🌼', '🌷', '🌺'];
                flowerArr.push(types[Math.floor(Math.random() * types.length)]);
                localStorage.setItem('qn_flowers', JSON.stringify(flowerArr)); renderFlowers();
            }
            if(timeRemaining <= 0) { clearInterval(timerInterval); isTimerRunning = false; btn.innerText = "Bắt đầu"; alert("Hết giờ! Nghỉ tay chút nhé Nghi ơi ☕"); }
        }, 1000);
    }
};

window.resetTimer = () => {
    clearInterval(timerInterval); isTimerRunning = false;
    let inputMins = parseInt(document.getElementById('timerInput').value) || 20;
    timeRemaining = inputMins * 60; focusSeconds = 0; 
    document.getElementById('timerDisplay').innerText = formatTime(timeRemaining);
    document.getElementById('startTimerBtn').innerText = "Bắt đầu";
};

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('timerDisplay').innerText = formatTime(timeRemaining); renderFlowers();
});
