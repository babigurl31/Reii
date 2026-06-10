document.addEventListener('DOMContentLoaded', () => {
    const tabFocusBtn = document.getElementById('tabFocusBtn');
    const focusTab = document.getElementById('focusTab');
    const btnExitFocus = document.getElementById('btnExitFocus');
    const btnTimerStart = document.getElementById('btnTimerStart');
    const btnTimerPause = document.getElementById('btnTimerPause');
    const btnResetTimer = document.getElementById('btnResetTimer');
    
    // UI Elements mới
    const btnCenterPomoIcon = document.getElementById('btnCenterPomoIcon');
    const pomodoroUIWrapper = document.getElementById('pomodoroUIWrapper');

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
        "Babi ơi, nhấp một ngụm nước cho tỉnh táo đầu óc nhé! 💧",
        "Cậu ơi, chỉnh lại dáng ngồi thẳng lưng lên nào để bảo vệ cột sống nhé! 🧘‍♀️",
        "Thả lỏng đôi vai và chớp mắt vài cái cho đỡ mỏi nhé babi! ✨",
        "Vươn vai nhẹ nhàng một xíu và uống nước đi nào cậu ơi! 🌸"
    ];

    const congratsMessages = [
        "Xuất sắc luôn babi ơi! Cậu đã hoàn thành mục tiêu vô cùng chăm chỉ! 🥰🌸",
        "Đỉnh quá đi mất! Hãy thưởng cho bản thân một khoảng thời gian nghỉ ngơi xứng đáng nhé! 🌟",
        "Babi làm tốt lắm nha, tự hào về sự tập trung của cậu ghê gớm! 🎉",
        "Hoàn thành xuất sắc rồi! Cậu là số một luôn nha! 🦄✨"
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

// Khi bấm vào nút bự giữa màn hình trống của Tab Focus
    if (btnCenterPomoIcon) {
        btnCenterPomoIcon.addEventListener('click', () => {
            document.getElementById('focusWelcomeScreen').style.display = 'none'; // Ẩn màn hình chào chứa nút bự
            pomodoroUIWrapper.style.display = 'flex'; // Hiện bộ đếm giờ lên
            focusTaskName.innerText = "🎯 Tự do tập trung";
            initialMinutes = 25;
            inputTimer.value = 25;
            timeLeft = 25 * 60;
            switchModeVisual('pomo');
            updateDisplay();
        });
    }

    // Khi bấm nút Back (Quay lại)
    if (btnExitFocus) {
        btnExitFocus.addEventListener('click', () => {
            document.body.classList.remove('is-focusing');
            
            // Trả Tab Focus về lại trạng thái màn hình trống có nút bự ban đầu
            pomodoroUIWrapper.style.display = 'none';
            document.getElementById('focusWelcomeScreen').style.display = 'flex';
            pauseTimer();

            const tabDailyBtn = document.getElementById('tabDailyBtn');
            if (tabDailyBtn) tabDailyBtn.click();
        });
    }

    // Khi có lệnh Play từ Planner truyền sang
    window.startFocusFromPlanner = (taskName, minutes) => {
        if (tabFocusBtn) tabFocusBtn.click();
        
        // Vào thẳng giao diện đếm giờ luôn, không hiện nút bự nữa
        document.getElementById('focusWelcomeScreen').style.display = 'none';
        pomodoroUIWrapper.style.display = 'flex';

        focusTaskName.innerText = "🎯 Đang xử lý: " + taskName;
        let mins = parseInt(minutes) || 25;
        inputTimer.value = mins;
        initialMinutes = mins;
        timeLeft = mins * 60;
        switchModeVisual('pomo');
        updateDisplay();
    };

    function switchModeVisual(mode) {
        currentMode = mode;
        if (mode === 'pomo') {
            btnModePomo.classList.add('active');
            btnModeBreak.classList.remove('active');
            btnModeBreak.style.display = 'none';
        } else {
            btnModePomo.classList.remove('active');
            btnModeBreak.classList.add('active');
            btnModeBreak.style.display = 'inline-block';
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

            focusTaskName.innerText = `⏳ Nghỉ giải lao một chút nhé! (${breakMins} phút)`;
            timeLeft = breakMins * 60;
            switchModeVisual('break');
            updateDisplay();
        } else {
            alert("⏰ Thời gian nghỉ đã hết rồi babi ơi! Sẵn sàng quay lại vạch tập trung nào! 💪");
            focusTaskName.innerText = "🎯 Tự do tập trung";
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
            focusTaskName.innerText = "🎯 Tự do tập trung";
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
