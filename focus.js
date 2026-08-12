document.addEventListener('DOMContentLoaded', () => {
    const tabFocusBtn = document.getElementById('tabFocusBtn');
    const focusTab = document.getElementById('focusTab');
    const btnExitFocus = document.getElementById('btnExitFocus');
    const btnTimerStart = document.getElementById('btnTimerStart');
    const btnTimerPause = document.getElementById('btnTimerPause');
    const btnResetTimer = document.getElementById('btnResetTimer');
    
    // UI Elements
    const btnCenterPomoIcon = document.getElementById('btnCenterPomoIcon');
    const pomodoroUIWrapper = document.getElementById('pomodoroUIWrapper');
    const focusWelcomeScreen = document.getElementById('focusWelcomeScreen');

    const inputTimer = document.getElementById('inputTimer');
    const timerSeconds = document.getElementById('timerSeconds');
    const focusTaskName = document.getElementById('focusTaskName');
    const totalFocusTimeEl = document.getElementById('totalFocusTime');
    
    const btnModePomo = document.getElementById('btnModePomo');
    const btnModeBreak = document.getElementById('btnModeBreak');

    let timer;
    let reminderInterval;
    let timeLeft = 25 * 60;
    let isRunning = false;
    let currentMode = 'pomo'; 
    let initialMinutes = 25;
    
    let totalMinutes = parseInt(localStorage.getItem('qn_total_focus_minutes')) || 0;
    if (totalFocusTimeEl) totalFocusTimeEl.innerText = totalMinutes;

    const reminderMessages = [
        "Hey Babi, take a sip of water to stay refreshed! 💧",
        "Hey, sit up straight to protect your spine! 🧘‍♀️",
        "Relax your shoulders and blink a few times to rest your eyes, Babi! ✨",
        "Do a gentle stretch and drink some water! 🌸"
    ];

    const congratsMessages = [
        "Excellent work, Babi! You worked so hard to reach your goal! 🥰🌸",
        "Awesome! Treat yourself to a well-deserved break! 🌟",
        "Great job, Babi! So proud of your focus! 🎉",
        "Outstandingly done! You're number one! 🦄✨"
    ];

    if (tabFocusBtn) {
        tabFocusBtn.addEventListener('click', () => {
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            tabFocusBtn.classList.add('active');
            if (focusTab) focusTab.classList.add('active');
            document.body.classList.add('is-focusing');
        });
    }

    if (btnCenterPomoIcon) {
        btnCenterPomoIcon.addEventListener('click', () => {
            if (focusWelcomeScreen) focusWelcomeScreen.style.display = 'none'; 
            if (pomodoroUIWrapper) pomodoroUIWrapper.style.display = 'flex'; 
            
            if (focusTaskName) focusTaskName.innerText = "🎯 Free Focus";
            initialMinutes = 25;
            if (inputTimer) inputTimer.value = 25;
            timeLeft = 25 * 60;
            switchModeVisual('pomo');
            updateDisplay();
        });
    }

    if (btnExitFocus) {
        btnExitFocus.addEventListener('click', () => {
            document.body.classList.remove('is-focusing');
            if (pomodoroUIWrapper) pomodoroUIWrapper.style.display = 'none';
            if (focusWelcomeScreen) focusWelcomeScreen.style.display = 'flex';
            pauseTimer();

            const tabDailyBtn = document.getElementById('tabDailyBtn');
            if (tabDailyBtn) tabDailyBtn.click();
        });
    }

    function updateDisplay() {
        let m = Math.floor(timeLeft / 60);
        let s = timeLeft % 60;
        if (inputTimer) inputTimer.value = m;
        if (timerSeconds) timerSeconds.innerText = s < 10 ? '0' + s : s;
    }

    window.startFocusFromPlanner = (taskName, minutes) => {
        if (tabFocusBtn) tabFocusBtn.click();
        if (focusWelcomeScreen) focusWelcomeScreen.style.display = 'none';
        if (pomodoroUIWrapper) pomodoroUIWrapper.style.display = 'flex';

        if (focusTaskName) focusTaskName.innerText = "🎯 Processing: " + taskName;
        let mins = parseInt(minutes) || 25;
        if (inputTimer) inputTimer.value = mins;
        initialMinutes = mins;
        timeLeft = mins * 60;
        switchModeVisual('pomo');
        updateDisplay();
    };

    function switchModeVisual(mode) {
        currentMode = mode;
        if (mode === 'pomo') {
            if (btnModePomo) btnModePomo.classList.add('active');
            if (btnModeBreak) {
                btnModeBreak.classList.remove('active');
                btnModeBreak.style.display = 'none';
            }
        } else {
            if (btnModePomo) btnModePomo.classList.remove('active');
            if (btnModeBreak) {
                btnModeBreak.classList.add('active');
                btnModeBreak.style.display = 'inline-block';
            }
        }
    }

    function startTimer() {
        if (isRunning) return;
        isRunning = true;

        if (timeLeft === parseInt(inputTimer.value) * 60 || timeLeft <= 0) {
            initialMinutes = parseInt(inputTimer.value) || 25;
            timeLeft = initialMinutes * 60;
        }

        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                handleTimeOut();
            }
        }, 1000);

        startReminderFlow();
    }

    function pauseTimer() {
        clearInterval(timer);
        clearInterval(reminderInterval);
        isRunning = false;
    }

    function handleTimeOut() {
        pauseTimer();

        if (currentMode === 'pomo') {
            totalMinutes += initialMinutes;
            localStorage.setItem('qn_total_focus_minutes', totalMinutes);
            if (totalFocusTimeEl) totalFocusTimeEl.innerText = totalMinutes;

            let randomCongrats = congratsMessages[Math.floor(Math.random() * congratsMessages.length)];
            alert(randomCongrats);

            let breakMins = 5;
            if (initialMinutes < 30) {
                breakMins = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
            } else {
                breakMins = Math.floor(Math.random() * (15 - 11 + 1)) + 11;
            }

            if (focusTaskName) focusTaskName.innerText = `⏳ Take a short break! (${breakMins} mins)`;
            timeLeft = breakMins * 60;
            switchModeVisual('break');
            updateDisplay();
        } else {
            alert("⏰ Break time is over, Babi! Ready to get back to focus! 💪");
            if (focusTaskName) focusTaskName.innerText = "🎯 Free Focus";
            timeLeft = initialMinutes * 60;
            switchModeVisual('pomo');
            updateDisplay();
        }
    }

    function startReminderFlow() {
        let randomTriggerTime = Math.floor(Math.random() * (540000 - 360000 + 1)) + 360000;
        reminderInterval = setInterval(() => {
            if (isRunning && currentMode === 'pomo') {
                let randomMsg = reminderMessages[Math.floor(Math.random() * reminderMessages.length)];
                alert(randomMsg);
            }
        }, randomTriggerTime);
    }

    if (btnTimerStart) btnTimerStart.addEventListener('click', startTimer);
    if (btnTimerPause) btnTimerPause.addEventListener('click', pauseTimer);
    
    if (btnResetTimer) {
        btnResetTimer.addEventListener('click', () => {
            pauseTimer();
            let mins = parseInt(inputTimer.value) || 25;
            timeLeft = mins * 60;
            switchModeVisual('pomo');
            if (focusTaskName) focusTaskName.innerText = "🎯 Free Focus";
            updateDisplay();
        });
    }

    if (inputTimer) {
        inputTimer.addEventListener('change', () => {
            if (!isRunning) {
                initialMinutes = parseInt(inputTimer.value) || 25;
                timeLeft = initialMinutes * 60;
                updateDisplay();
            }
        });
    }
});

window.startFocusFromPlanner = function(taskName, minutes) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    
    let focusTab = document.getElementById('focusTab');
    let focusBtn = document.getElementById('tabFocusBtn');
    if(focusTab) focusTab.classList.add('active');
    if(focusBtn) focusBtn.classList.add('active');

    let welcome = document.getElementById('focusWelcomeScreen');
    let ui = document.getElementById('pomodoroUIWrapper');
    if(welcome) welcome.style.display = 'none';
    if(ui) ui.style.display = 'flex';

    let taskLabel = document.getElementById('focusTaskName');
    if(taskLabel) taskLabel.innerText = `🎯 Processing: ${taskName}`;

    let timeInput = document.getElementById('inputTimer');
    let secDisplay = document.getElementById('timerSeconds');
    if(timeInput) {
        timeInput.value = minutes || 25; 
        if(secDisplay) secDisplay.innerText = '00';
        timeInput.dispatchEvent(new Event('input'));
    }
};
