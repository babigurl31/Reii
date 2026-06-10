document.addEventListener('DOMContentLoaded', () => {
    const tabFocusBtn = document.getElementById('tabFocusBtn');
    const focusTab = document.getElementById('focusTab');
    const focusControls = document.getElementById('focusControls');
    
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

    // Mở Tab Focus thì hiện 3 nút điều khiển
    tabFocusBtn.addEventListener('click', () => {
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        tabFocusBtn.classList.add('active');
        focusTab.classList.add('active');
        focusControls.style.display = 'flex'; // Hiện thanh công cụ
        document.body.classList.add('is-focusing');
    });

    // Ẩn thanh công cụ khi click tab khác
    document.querySelectorAll('.tab-btn:not(#tabFocusBtn)').forEach(btn => {
        btn.addEventListener('click', () => { focusControls.style.display = 'none'; });
    });

    // Nút BACK
    document.getElementById('btnExitFocus').addEventListener('click', () => {
        document.body.classList.remove('is-focusing');
        document.getElementById('tabDailyBtn').click(); 
    });

    function updateDisplay() {
        let m = Math.floor(timeLeft / 60);
        let s = timeLeft % 60;
        inputTimer.value = m;
        timerSeconds.innerText = s < 10 ? '0' + s : s;
        if (overlayBreak.style.display === 'flex') breakCountdown.innerText = `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
    }

    // Nhận lệnh từ Planner nhưng KHÔNG TỰ ĐỘNG CHẠY
    window.startFocusFromPlanner = (taskName, minutes) => {
        tabFocusBtn.click();
        focusTaskName.innerText = "🎯 " + taskName;
        inputTimer.value = minutes;
        timeLeft = minutes * 60;
        switchMode('pomo', false);
        updateDisplay();
        // KHÔNG GỌI startTimer() Ở ĐÂY NỮA!
    };

    function startTimer() {
        if (isRunning) return;
        isRunning = true;
        if (timeLeft === 0 || !timer) timeLeft = parseInt(inputTimer.value) * 60;
        
        timer = setInterval(() => {
            if (timeLeft > 0) { timeLeft--; updateDisplay(); } 
            else { finishStep(); }
        }, 1000);
    }

    function finishStep() {
        clearInterval(timer);
        isRunning = false;
        if (currentMode === 'pomo') {
            overlayFinish.style.display = 'flex';
            switchMode('short', false);
        } else {
            overlayBreak.style.display = 'none';
            switchMode('pomo', false);
        }
    }

    function switchMode(mode, updateTime = true) {
        currentMode = mode;
        overlayBreak.style.display = (mode === 'short' || mode === 'long') ? 'flex' : 'none';
        document.querySelectorAll('.mode-btn-clean').forEach(btn => btn.classList.remove('active'));
        
        let mins = 25;
        if(mode === 'pomo') { document.getElementById('btnModePomo').classList.add('active'); mins = parseInt(inputTimer.value) || 25; }
        if(mode === 'short') { document.getElementById('btnModeShort').classList.add('active'); mins = 5; }
        if(mode === 'long') { document.getElementById('btnModeLong').classList.add('active'); mins = 15; }
        
        if (updateTime) { inputTimer.value = mins; timeLeft = mins * 60; updateDisplay(); }
    }

    // Nút START và PAUSE
    document.getElementById('btnTimerStart').addEventListener('click', startTimer);
    document.getElementById('btnTimerPause').addEventListener('click', () => {
        clearInterval(timer);
        isRunning = false;
    });

    document.getElementById('btnModePomo').addEventListener('click', () => switchMode('pomo'));
    document.getElementById('btnModeShort').addEventListener('click', () => switchMode('short'));
    document.getElementById('btnModeLong').addEventListener('click', () => switchMode('long'));

    inputTimer.addEventListener('change', () => {
        if(!isRunning) { timeLeft = parseInt(inputTimer.value) * 60; updateDisplay(); }
    });
});
