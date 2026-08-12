let timerInterval;
let isTimerRunning = false;
let isWorking = true; 
let timeRemaining = 25 * 60;
let totalFocusSeconds = 0;
let weeklyFocusSeconds = 0; 
let sessionFocusSeconds = 0;

const motivations = [ "Great job, Babi! Keep it up! 💪", "Your focus is creating magic, Babi! ✨", "Tired? Grab a sip of water and keep going! 💧", "You're so close to your goal, Babi! You can do it! 🚀", "A hardworking girl is the prettiest girl! 🌸", "Awesome! You're doing great! 👏" ];

function getMonday(d) {
    let date = new Date(d), day = date.getDay(), diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff)).toLocaleDateString('en-US');
}

let todayStr = new Date().toLocaleDateString('en-US');
let currentWeekStr = getMonday(new Date());

if (localStorage.getItem('qn_focus_date') !== todayStr) { localStorage.setItem('qn_total_focus', '0'); localStorage.setItem('qn_focus_date', todayStr); }
if (localStorage.getItem('qn_focus_week_date') !== currentWeekStr) { localStorage.setItem('qn_weekly_focus', '0'); localStorage.setItem('qn_focus_week_date', currentWeekStr); }

totalFocusSeconds = parseInt(localStorage.getItem('qn_total_focus')) || 0;
weeklyFocusSeconds = parseInt(localStorage.getItem('qn_weekly_focus')) || 0;

function formatTime(sec) {
    let m = Math.floor(sec / 60).toString().padStart(2, '0'), s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function updateTotalDisplay() {
    let totalMins = Math.floor(totalFocusSeconds / 60);
    let displayElem = document.getElementById('totalFocusDisplay'); if (displayElem) displayElem.innerText = `${totalMins} mins`;

    let wMins = Math.floor(weeklyFocusSeconds / 60), wHours = Math.floor(wMins / 60), remainMins = wMins % 60;
    let displayWeekly = document.getElementById('weeklyFocusDisplay');
    if (displayWeekly) { displayWeekly.innerText = wHours > 0 ? `${wHours} hrs ${remainMins} mins` : `${wMins} mins`; }
}

function toggleTimer() {
    const btn = document.getElementById('startTimerBtn'), modeText = document.getElementById('timerMode');
    let workMins = parseInt(document.getElementById('timerInput').value) || 25;
    if (isTimerRunning) { clearInterval(timerInterval); btn.innerText = "Resume"; isTimerRunning = false; } 
    else {
        if (timeRemaining <= 0 || btn.innerText === "Start") { timeRemaining = isWorking ? workMins * 60 : timeRemaining; if (isWorking) sessionFocusSeconds = 0; }
        btn.innerText = "Pause"; isTimerRunning = true;
        modeText.innerText = isWorking ? "🔥 Focusing..." : modeText.innerText;
        modeText.style.color = isWorking ? "var(--red)" : "#388e3c";

        timerInterval = setInterval(() => {
            timeRemaining--; document.getElementById('timerDisplay').innerText = formatTime(timeRemaining);
            if (isWorking) {
                totalFocusSeconds++; weeklyFocusSeconds++; sessionFocusSeconds++;
                if (totalFocusSeconds % 60 === 0) { localStorage.setItem('qn_total_focus', totalFocusSeconds); localStorage.setItem('qn_weekly_focus', weeklyFocusSeconds); updateTotalDisplay(); }
                if (sessionFocusSeconds > 0 && sessionFocusSeconds % 600 === 0) alert("💌 " + motivations[Math.floor(Math.random() * motivations.length)]);
                if (sessionFocusSeconds === 60 * 60) alert("🚨 WARNING: Babi, you've been sitting for an hour! Stretch and walk around a bit! 👀");
            }
            if (timeRemaining <= 0) {
                clearInterval(timerInterval); isTimerRunning = false;
                if (isWorking) {
                    let randomBreakMins = Math.floor(Math.random() * (25 - 5 + 1)) + 5;
                    isWorking = false; timeRemaining = randomBreakMins * 60;
                    modeText.innerText = `☕ Break Time (${randomBreakMins} mins)`; modeText.style.color = "#388e3c";
                    document.getElementById('timerDisplay').innerText = formatTime(timeRemaining); btn.innerText = "Start Break";
                    localStorage.setItem('qn_total_focus', totalFocusSeconds); localStorage.setItem('qn_weekly_focus', weeklyFocusSeconds); updateTotalDisplay();
                    alert(`Ting ting! 🎲 Babi, you randomly won a ${randomBreakMins}-minute break! 🎉`);
                } else {
                    isWorking = true; workMins = parseInt(document.getElementById('timerInput').value) || 25; timeRemaining = workMins * 60;
                    modeText.innerText = "🔥 Ready to work!"; modeText.style.color = "var(--accent)";
                    document.getElementById('timerDisplay').innerText = formatTime(timeRemaining); btn.innerText = "Start Focus";
                    alert("Break time is over, Babi! Back to work 💪");
                }
            }
        }, 1000);
    }
}

function resetTimer() {
    if (confirm("Reset the timer? (Accumulated minutes will be kept)")) {
        clearInterval(timerInterval); isTimerRunning = false; isWorking = true; sessionFocusSeconds = 0;
        let workMins = parseInt(document.getElementById('timerInput').value) || 25; timeRemaining = workMins * 60;
        document.getElementById('timerDisplay').innerText = formatTime(timeRemaining);
        document.getElementById('startTimerBtn').innerText = "Start";
        document.getElementById('timerMode').innerText = "Ready to work!"; document.getElementById('timerMode').style.color = "var(--accent)";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    let workMins = parseInt(document.getElementById('timerInput').value) || 25;
    timeRemaining = workMins * 60; document.getElementById('timerDisplay').innerText = formatTime(timeRemaining); updateTotalDisplay();
    document.getElementById('startTimerBtn').addEventListener('click', toggleTimer);
    document.getElementById('resetTimerBtn').addEventListener('click', resetTimer);
});
