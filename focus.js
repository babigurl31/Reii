document.addEventListener('DOMContentLoaded', () => {
    const tabFocusBtn = document.getElementById('tabFocusBtn');
    const focusTab = document.getElementById('focusTab');
    const pomodoroUI = document.getElementById('pomodoroUI');
    const timerDisplay = document.getElementById('timerDisplay');
    const focusTaskName = document.getElementById('focusTaskName');
    const btnManualFocus = document.getElementById('btnManualFocus');
    const btnExitFocus = document.getElementById('btnExitFocus'); // Gọi Nút Thoát
    
    let timer;
    let timeLeft = 25 * 60; 
    let isRunning = false;

    // --- XỬ LÝ CHUYỂN TAB SANG TRẠM TẬP TRUNG (KÍCH HOẠT TÀNG HÌNH) ---
    tabFocusBtn.addEventListener('click', () => {
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        
        tabFocusBtn.classList.add('active');
        focusTab.classList.add('active');
        
        // Phép thuật Tàng Hình toàn web
        document.body.classList.add('is-focusing');
    });

    // --- NÚT QUAY LẠI (TẮT TÀNG HÌNH & VỀ PLANNER) ---
    btnExitFocus.addEventListener('click', () => {
        document.body.classList.remove('is-focusing'); // Hiện lại menu
        document.getElementById('tabDailyBtn').click(); // Về tab Việc Hôm Nay
    });

    // --- BẤM NÚT PLAY TỪ CÁC TAB KHÁC ---
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-play-task')) {
            const taskName = e.target.getAttribute('data-task');
            startFocusMode(taskName);
        }
    });

    // --- BẤM NÚT ICON RIÊNG ĐỂ HIỆN/ẨN POMODORO ---
    btnManualFocus.addEventListener('click', () => {
        pomodoroUI.style.opacity = '1';
        pomodoroUI.style.pointerEvents = 'auto';
        focusTaskName.innerText = "🎯 Tự do tập trung";
        resetTimer(25);
    });

    // --- HÀM KHỞI ĐỘNG NHANH FOCUS MODE ---
    function startFocusMode(taskName) {
        tabFocusBtn.click(); // Tự động chuyển trang và kích hoạt tàng hình
        
        pomodoroUI.style.opacity = '1';
        pomodoroUI.style.pointerEvents = 'auto';
        focusTaskName.innerText = "🎯 Đang Focus: " + taskName;
        
        resetTimer(25);
        startTimer();
    }

    // --- LOGIC ĐỒNG HỒ POMODORO ---
    function updateDisplay() {
        let m = Math.floor(timeLeft / 60);
        let s = timeLeft % 60;
        timerDisplay.innerText = `${m < 10 ? '0'+m : m}:${s < 10 ? '0'+s : s}`;
    }

    function resetTimer(minutes) {
        clearInterval(timer);
        isRunning = false;
        timeLeft = minutes * 60;
        updateDisplay();
    }

    function startTimer() {
        if (isRunning) return;
        isRunning = true;
        timer = setInterval(() => {
            timeLeft--;
            updateDisplay();
            if (timeLeft <= 0) {
                clearInterval(timer);
                isRunning = false;
                alert("⏰ Hết giờ Pomodoro! Babi làm tốt lắm, nghỉ giải lao xíu nha 🌸");
            }
        }, 1000);
    }

    document.getElementById('btnTimerStart').addEventListener('click', startTimer);
    document.getElementById('btnTimerPause').addEventListener('click', () => {
        clearInterval(timer);
        isRunning = false;
    });
    document.getElementById('btnTimerStop').addEventListener('click', () => {
        resetTimer(25);
    });
});
