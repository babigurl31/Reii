let timerInterval;
let isTimerRunning = false;
let isWorking = true; 
let timeRemaining = 25 * 60;
let totalFocusSeconds = 0;
let weeklyFocusSeconds = 0; 
let sessionFocusSeconds = 0;

const motivations = [ "Babi giỏi quá! Cứ giữ đà này nhé! 💪", "Sự tập trung của Babi đang tạo ra phép màu đó! ✨", "Mệt không? Uống ngụm nước rồi chiến tiếp nha! 💧", "Babi sắp chạm đến mục tiêu rồi, cố lên! 🚀", "Một cô gái chăm chỉ là một cô gái xinh đẹp nhất! 🌸", "Tuyệt vời! Cậu đang làm rất tốt! 👏" ];

function getMonday(d) {
    let date = new Date(d), day = date.getDay(), diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff)).toLocaleDateString('vi-VN');
}

let todayStr = new Date().toLocaleDateString('vi-VN');
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
    let displayElem = document.getElementById('totalFocusDisplay'); if (displayElem) displayElem.innerText = `${totalMins} phút`;

    let wMins = Math.floor(weeklyFocusSeconds / 60), wHours = Math.floor(wMins / 60), remainMins = wMins % 60;
    let displayWeekly = document.getElementById('weeklyFocusDisplay');
    if (displayWeekly) { displayWeekly.innerText = wHours > 0 ? `${wHours} giờ ${remainMins} phút` : `${wMins} phút`; }
}

function toggleTimer() {
    const btn = document.getElementById('startTimerBtn'), modeText = document.getElementById('timerMode');
    let workMins = parseInt(document.getElementById('timerInput').value) || 25;
    if (isTimerRunning) { clearInterval(timerInterval); btn.innerText = "Tiếp tục"; isTimerRunning = false; } 
    else {
        if (timeRemaining <= 0 || btn.innerText === "Bắt đầu") { timeRemaining = isWorking ? workMins * 60 : timeRemaining; if (isWorking) sessionFocusSeconds = 0; }
        btn.innerText = "Tạm dừng"; isTimerRunning = true;
        modeText.innerText = isWorking ? "🔥 Đang tập trung..." : modeText.innerText;
        modeText.style.color = isWorking ? "var(--red)" : "#388e3c";

        timerInterval = setInterval(() => {
            timeRemaining--; document.getElementById('timerDisplay').innerText = formatTime(timeRemaining);
            if (isWorking) {
                totalFocusSeconds++; weeklyFocusSeconds++; sessionFocusSeconds++;
                if (totalFocusSeconds % 60 === 0) { localStorage.setItem('qn_total_focus', totalFocusSeconds); localStorage.setItem('qn_weekly_focus', weeklyFocusSeconds); updateTotalDisplay(); }
                if (sessionFocusSeconds > 0 && sessionFocusSeconds % 600 === 0) alert("💌 " + motivations[Math.floor(Math.random() * motivations.length)]);
                if (sessionFocusSeconds === 60 * 60) alert("🚨 CẢNH BÁO: Babi đã ngồi liên tục 1 tiếng rồi đó! Hãy vươn vai đi lại chút nha! 👀");
            }
            if (timeRemaining <= 0) {
                clearInterval(timerInterval); isTimerRunning = false;
                if (isWorking) {
                    let randomBreakMins = Math.floor(Math.random() * (25 - 5 + 1)) + 5;
                    isWorking = false; timeRemaining = randomBreakMins * 60;
                    modeText.innerText = `☕ Nghỉ giải lao (${randomBreakMins} phút)`; modeText.style.color = "#388e3c";
                    document.getElementById('timerDisplay').innerText = formatTime(timeRemaining); btn.innerText = "Bắt đầu nghỉ";
                    localStorage.setItem('qn_total_focus', totalFocusSeconds); localStorage.setItem('qn_weekly_focus', weeklyFocusSeconds); updateTotalDisplay();
                    alert(`Ting ting! 🎲 Bốc thăm ngẫu nhiên thưởng cho Babi ${randomBreakMins} phút nghỉ ngơi! 🎉`);
                } else {
                    isWorking = true; workMins = parseInt(document.getElementById('timerInput').value) || 25; timeRemaining = workMins * 60;
                    modeText.innerText = "🔥 Sẵn sàng làm việc!"; modeText.style.color = "var(--accent)";
                    document.getElementById('timerDisplay').innerText = formatTime(timeRemaining); btn.innerText = "Bắt đầu làm";
                    alert("Hết giờ nghỉ ngơi rồi Babi ơi! Quay lại chiến đấu thôi 💪");
                }
            }
        }, 1000);
    }
}

function resetTimer() {
    if (confirm("Cài lại đồng hồ từ đầu nhé? (Phút tích lũy vẫn được giữ)")) {
        clearInterval(timerInterval); isTimerRunning = false; isWorking = true; sessionFocusSeconds = 0;
        let workMins = parseInt(document.getElementById('timerInput').value) || 25; timeRemaining = workMins * 60;
        document.getElementById('timerDisplay').innerText = formatTime(timeRemaining);
        document.getElementById('startTimerBtn').innerText = "Bắt đầu";
        document.getElementById('timerMode').innerText = "Sẵn sàng làm việc!"; document.getElementById('timerMode').style.color = "var(--accent)";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    let workMins = parseInt(document.getElementById('timerInput').value) || 25;
    timeRemaining = workMins * 60; document.getElementById('timerDisplay').innerText = formatTime(timeRemaining); updateTotalDisplay();
    document.getElementById('startTimerBtn').addEventListener('click', toggleTimer);
    document.getElementById('resetTimerBtn').addEventListener('click', resetTimer);
});