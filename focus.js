document.addEventListener('DOMContentLoaded', () => {
    const tabFocusBtn = document.getElementById('tabFocusBtn');
    const focusTab = document.getElementById('focusTab');
    const btnExitFocus = document.getElementById('btnExitFocus'); // Nút Quay Lại
    
    let timer;
    let timeLeft = 25 * 60;
    let isRunning = false;
    let currentMode = 'pomo'; 

    const inputTimer = document.getElementById('inputTimer');
    const timerSeconds = document.getElementById('timerSeconds');
    const focusTaskName = document.getElementById('focusTaskName');
    
    const overlayBreak = document.getElementById('overlayBreak');
    const breakCountdown = document.getElementById('breakCountdown');
    const overlayFinish = document.getElementById('overlayFinish');

    // --- LOGIC CHUYỂN TAB VÀ TÀNG HÌNH ---
    tabFocusBtn.addEventListener('click', () => {
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        tabFocusBtn.classList.add('active');
        focusTab.classList.add('active');
        document.body.classList.add('is-focusing');
    });

    btnExitFocus.addEventListener('click', () => {
        document.body.classList.remove('is-focusing'); 
        document.getElementById('tabDailyBtn').click(); 
    });

    // --- CẬP NHẬT HIỂN THỊ ĐỒNG HỒ ---
    function updateDisplay() {
        let m = Math.floor(timeLeft / 60);
        let s = timeLeft % 60;
        inputTimer.value = m; // Update thẳng vào ô input
        timerSeconds.innerText = s < 10 ? '0' + s : s;
        
        if (overlayBreak.style.display === 'flex') {
            breakCountdown.innerText = `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
        }
    }

    // --- NHẬN LỆNH PLAY TỪ PLANNER TRUYỀN SANG ---
    window.startFocusFromPlanner = (taskName, minutes) => {
        tabFocusBtn.click();
        focusTaskName.innerText = "🎯 " + taskName;
        inputTimer.value = minutes;
        timeLeft = minutes * 60;
        switchMode('pomo', false); // Chuyển về mode làm việc
        updateDisplay();
        startTimer();
    };

    function startTimer() {
        if (isRunning) return;
        isRunning = true;
        
        // Nếu người dùng lỡ sửa số trên màn hình Pomodoro thì lấy số đó
        if (timeLeft === 0 || !timer) {
            timeLeft = parseInt(inputTimer.value) * 60;
        }

        timer = setInterval(() => {
            if (timeLeft > 0) {
                timeLeft--;
                updateDisplay();
            } else {
                finishStep();
            }
        }, 1000);
    }

    // --- KHI CHẠY HẾT GIỜ ---
    function finishStep() {
        clearInterval(timer);
        isRunning = false;
        
        if (currentMode === 'pomo') {
            // Hết giờ làm -> Hiện bảng Hoàn Thành
            overlayFinish.style.display = 'flex';
            switchMode('short', false); // Tự động set sẵn giờ nghỉ
        } else {
            // Hết giờ nghỉ -> Đóng bảng Bình nước
            overlayBreak.style.display = 'none';
            switchMode('pomo', false); // Quay lại giờ làm
        }
    }

    function switchMode(mode, updateTime = true) {
        currentMode = mode;
        // Bật/tắt ảnh bình nước
        overlayBreak.style.display = (mode === 'short' || mode === 'long') ? 'flex' : 'none';
        
        document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
        
        let mins = 25;
        if(mode === 'pomo') { document.getElementById('btnModePomo').classList.add('active'); mins = parseInt(inputTimer.value) || 25; }
        if(mode === 'short') { document.getElementById('btnModeShort').classList.add('active'); mins = 5; }
        if(mode === 'long') { document.getElementById('btnModeLong').classList.add('active'); mins = 15; }
        
        if (updateTime) {
            inputTimer.value = mins;
            timeLeft = mins * 60;
            updateDisplay();
        }
    }

    // --- SỰ KIỆN NÚT BẤM CỦA POMODORO ---
    document.getElementById('btnTimerStart').addEventListener('click', startTimer);
    document.getElementById('btnResetTimer').addEventListener('click', () => {
        clearInterval(timer);
        isRunning = false;
        timeLeft = parseInt(inputTimer.value) * 60;
        updateDisplay();
    });

    document.getElementById('btnModePomo').addEventListener('click', () => switchMode('pomo'));
    document.getElementById('btnModeShort').addEventListener('click', () => switchMode('short'));
    document.getElementById('btnModeLong').addEventListener('click', () => switchMode('long'));

    inputTimer.addEventListener('change', () => {
        if(!isRunning) { timeLeft = parseInt(inputTimer.value) * 60; updateDisplay(); }
    });
});
