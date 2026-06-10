document.addEventListener('DOMContentLoaded', () => {
    let timer;
    let timeLeft = 25 * 60;
    let isRunning = false;
    let currentMode = 'pomo'; // pomo, short, long

    const inputTimer = document.getElementById('inputTimer');
    const timerSeconds = document.getElementById('timerSeconds');
    const focusTaskName = document.getElementById('focusTaskName');
    const overlayBreak = document.getElementById('overlayBreak');
    const breakCountdown = document.getElementById('breakCountdown');
    const overlayFinish = document.getElementById('overlayFinish');

    function updateDisplay() {
        let m = Math.floor(timeLeft / 60);
        let s = timeLeft % 60;
        inputTimer.value = m < 10 ? '0' + m : m;
        timerSeconds.innerText = s < 10 ? '0' + s : s;
        
        if (overlayBreak.style.display === 'flex') {
            breakCountdown.innerText = `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
        }
    }

    // Nhận lệnh "Play" từ planner
    window.startFocusFromPlanner = (taskName, minutes) => {
        document.getElementById('tabFocusBtn').click();
        focusTaskName.innerText = "🎯 " + taskName;
        inputTimer.value = minutes;
        timeLeft = minutes * 60;
        updateDisplay();
        startTimer();
    };

    function startTimer() {
        if (isRunning) return;
        isRunning = true;
        // Lấy thời gian từ ô input nếu người dùng có chỉnh sửa
        if (timeLeft === (inputTimer.value * 60) || timeLeft === 0) {
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

    function finishStep() {
        clearInterval(timer);
        isRunning = false;
        
        if (currentMode === 'pomo') {
            overlayFinish.style.display = 'flex';
            // Sau khi xong việc thì tự động chuyển sang mode break
            switchMode('short');
        } else {
            overlayBreak.style.display = 'none';
            switchMode('pomo');
        }
    }

    function switchMode(mode) {
        currentMode = mode;
        overlayBreak.style.display = (mode === 'short' || mode === 'long') ? 'flex' : 'none';
        
        let mins = 25;
        if(mode === 'short') mins = 5;
        if(mode === 'long') mins = 15;
        
        inputTimer.value = mins;
        timeLeft = mins * 60;
        updateDisplay();

        // Cập nhật giao diện nút
        document.querySelectorAll('.mode-btn').forEach(btn => btn.classList.remove('active'));
        if(mode === 'pomo') document.getElementById('btnModePomo').classList.add('active');
        if(mode === 'short') document.getElementById('btnModeShort').classList.add('active');
        if(mode === 'long') document.getElementById('btnModeLong').classList.add('active');
    }

    // Sự kiện nút bấm
    document.getElementById('btnTimerStart').addEventListener('click', startTimer);
    document.getElementById('btnResetTimer').addEventListener('click', () => {
        clearInterval(timer);
        isRunning = false;
        switchMode('pomo');
    });

    document.getElementById('btnModePomo').addEventListener('click', () => switchMode('pomo'));
    document.getElementById('btnModeShort').addEventListener('click', () => switchMode('short'));
    document.getElementById('btnModeLong').addEventListener('click', () => switchMode('long'));

    // Cho phép chỉnh sửa thời gian bằng tay khi đang dừng
    inputTimer.addEventListener('change', () => {
        if(!isRunning) timeLeft = parseInt(inputTimer.value) * 60;
    });
});
