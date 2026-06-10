document.addEventListener('DOMContentLoaded', () => {
    const tabFocusBtn = document.getElementById('tabFocusBtn');
    const focusTab = document.getElementById('focusTab');
    const btnExitFocus = document.getElementById('btnExitFocus');
    const btnTimerStart = document.getElementById('btnTimerStart');
    const btnTimerPause = document.getElementById('btnTimerPause');
    const btnResetTimer = document.getElementById('btnResetTimer');
    
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
    
    // Tải dữ liệu tổng thời gian đã tích lũy từ LocalStorage
    let totalMinutes = parseInt(localStorage.getItem('qn_total_focus_minutes')) || 0;
    if (totalFocusTimeEl) totalFocusTimeEl.innerText = totalMinutes;

    // Danh sách câu nhắc nhở ngẫu nhiên (sức khỏe & tư thế)
    const reminderMessages = [
        "Babi ơi, nhấp một ngụm nước cho tỉnh táo đầu óc nhé! 💧",
        "Cậu ơi, chỉnh lại dáng ngồi thẳng lưng lên nào để bảo vệ cột sống nhé! 🧘‍♀️",
        "Thả lỏng đôi vai và chớp mắt vài cái cho đỡ mỏi nhé babi! ✨",
        "Vươn vai nhẹ nhàng một xíu và uống nước đi nào cậu ơi! 🌸"
    ];

    // Danh sách câu khen ngợi tạo động lực ngẫu nhiên khi hoàn thành việc
    const congratsMessages = [
        "Xuất sắc luôn babi ơi! Cậu đã hoàn thành mục tiêu vô cùng chăm chỉ! 🥰🌸",
        "Đỉnh quá đi mất! Hãy thưởng cho bản thân một khoảng thời gian nghỉ ngơi xứng đáng nhé! 🌟",
        "Babi làm tốt lắm nha, tự hào về sự tập trung của cậu ghê gớm! 🎉",
        "Hoàn thành xuất sắc rồi! Cậu là số một luôn nha! 🦄✨"
    ];

    // --- XỬ LÝ CHUYỂN TAB VÀ TÀNG HÌNH ---
    if (tabFocusBtn) {
        tabFocusBtn.addEventListener('click', () => {
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            tabFocusBtn.classList.add('active');
            if (focusTab) focusTab.classList.add('active');
            document.body.classList.add('is-focusing');
        });
    }

    if (btnExitFocus) {
        btnExitFocus.addEventListener('click', () => {
            document.body.classList.remove('is-focusing');
            const tabDailyBtn = document.getElementById('tabDailyBtn');
            if (tabDailyBtn) tabDailyBtn.click();
        });
    }

    function updateDisplay() {
        let m = Math.floor(timeLeft / 60);
        let s = timeLeft % 60;
        inputTimer.value = m;
        timerSeconds.innerText = s < 10 ? '0' + s : s;
    }

    // --- NHẬN LỆNH TỪ PLANNER VÀ CHỜ ẤN START ---
    window.startFocusFromPlanner = (taskName, minutes) => {
        if (tabFocusBtn) tabFocusBtn.click();
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

    // --- LOGIC ĐỒNG HỒ ĐẾM NGƯỢC ---
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

        // Kích hoạt đồng hồ nhắc nhở sức khỏe ngẫu nhiên khi đang ở mode làm việc
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
            // 1. Tích lũy thời gian vào tổng mục
            totalMinutes += initialMinutes;
            localStorage.setItem('qn_total_focus_minutes', totalMinutes);
            if (totalFocusTimeEl) totalFocusTimeEl.innerText = totalMinutes;

            // 2. Hiện popup khen ngợi tạo động lực ngẫu nhiên
            let randomCongrats = congratsMessages[Math.floor(Math.random() * congratsMessages.length)];
            alert(randomCongrats);

            // 3. Thiết lập Break time ngẫu nhiên hợp lý theo công thức
            let breakMins = 5;
            if (initialMinutes < 30) {
                // Dưới 30 phút -> Ngẫu nhiên từ 5 đến 10 phút
                breakMins = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
            } else {
                // Trên 30 phút -> Ngẫu nhiên từ 11 đến 15 phút (không nghỉ quá lâu gây mất tập trung)
                breakMins = Math.floor(Math.random() * (15 - 11 + 1)) + 11;
            }

            focusTaskName.innerText = `⏳ Nghỉ giải lao một chút nhé! (${breakMins} phút)`;
            timeLeft = breakMins * 60;
            switchModeVisual('break');
            updateDisplay();
        } else {
            // Hết giờ giải lao -> Tự động chuyển về mode làm việc để chuẩn bị tiếp tục
            alert("⏰ Thời gian nghỉ đã hết rồi babi ơi! Sẵn sàng quay lại vạch tập trung nào! 💪");
            focusTaskName.innerText = "🎯 Sẵn sàng tập trung chưa babi?";
            timeLeft = initialMinutes * 60;
            switchModeVisual('pomo');
            updateDisplay();
        }
    }

    // Cơ chế nhắc nhở uống nước / thẳng lưng ngẫu nhiên (Trong khoảng 6 đến 9 phút kiểm tra một lần)
    function startReminderFlow() {
        let randomTriggerTime = Math.floor(Math.random() * (540000 - 360000 + 1)) + 360000;
        reminderInterval = setInterval(() => {
            if (isRunning && currentMode === 'pomo') {
                let randomMsg = reminderMessages[Math.floor(Math.random() * reminderMessages.length)];
                alert(randomMsg);
            }
        }, randomTriggerTime);
    }

    // --- LIÊN KẾT SỰ KIỆN NÚT BẤM ---
    if (btnTimerStart) btnTimerStart.addEventListener('click', startTimer);
    if (btnTimerPause) btnTimerPause.addEventListener('click', pauseTimer);
    
    if (btnResetTimer) {
        btnResetTimer.addEventListener('click', () => {
            pauseTimer();
            let mins = parseInt(inputTimer.value) || 25;
            timeLeft = mins * 60;
            switchModeVisual('pomo');
            focusTaskName.innerText = "🎯 Sẵn sàng tập trung chưa babi?";
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
