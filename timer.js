let timerInterval;
let isTimerRunning = false;
let isWorking = true; // true = Đang làm, false = Đang nghỉ 5p
let timeRemaining = 20 * 60;
let totalFocusSeconds = 0;

// KIỂM TRA QUA NGÀY MỚI (Để reset tổng giờ và bó hoa)
let todayStr = new Date().toLocaleDateString('vi-VN');
let savedDate = localStorage.getItem('qn_focus_date');

if (savedDate !== todayStr) {
    localStorage.setItem('qn_bouquet', JSON.stringify([]));
    localStorage.setItem('qn_total_focus', '0');
    localStorage.setItem('qn_focus_date', todayStr);
}

let bouquetArr = JSON.parse(localStorage.getItem('qn_bouquet')) || [];
totalFocusSeconds = parseInt(localStorage.getItem('qn_total_focus')) || 0;

function renderBouquet() {
    const area = document.getElementById('bouquetArea');
    area.innerHTML = '';
    bouquetArr.forEach(flower => {
        let img = document.createElement('img');
        img.src = flower.src;
        img.style.position = 'absolute';
        img.style.width = '45px'; 
        img.style.left = flower.x + '%';
        img.style.bottom = flower.y + '%';
        img.style.transform = `rotate(${flower.rot}deg)`;
        img.style.zIndex = flower.z;
        area.appendChild(img);
    });
}

function formatTime(sec) {
    let m = Math.floor(sec / 60).toString().padStart(2, '0');
    let s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
}

function updateTotalDisplay() {
    let totalMins = Math.floor(totalFocusSeconds / 60);
    let displayElem = document.getElementById('totalFocusDisplay');
    if (displayElem) displayElem.innerText = `${totalMins} phút`;
}

window.toggleTimer = () => {
    const btn = document.getElementById('startTimerBtn');
    const modeText = document.getElementById('timerMode');
    let workMins = parseInt(document.getElementById('timerInput').value) || 20;

    if (isTimerRunning) {
        clearInterval(timerInterval);
        btn.innerText = "Tiếp tục";
        isTimerRunning = false;
    } else {
        if (timeRemaining <= 0 || btn.innerText === "Bắt đầu") {
            timeRemaining = isWorking ? workMins * 60 : 5 * 60;
        }

        btn.innerText = "Tạm dừng";
        isTimerRunning = true;
        modeText.innerText = isWorking ? "🔥 Đang tập trung..." : "☕ Đang nghỉ ngơi...";
        modeText.style.color = isWorking ? "var(--red)" : "#388e3c";

        timerInterval = setInterval(() => {
            timeRemaining--;
            document.getElementById('timerDisplay').innerText = formatTime(timeRemaining);

            // CỘNG DỒN GIỜ TẬP TRUNG (Chỉ cộng khi đang ở mode làm việc)
            if (isWorking) {
                totalFocusSeconds++;
                if (totalFocusSeconds % 60 === 0) { // Lưu dữ liệu mỗi phút
                    localStorage.setItem('qn_total_focus', totalFocusSeconds);
                    updateTotalDisplay();
                }
            }

            // KHI HẾT GIỜ ĐẾM NGƯỢC
            if (timeRemaining <= 0) {
                clearInterval(timerInterval);
                isTimerRunning = false;

                if (isWorking) {
                    // 1. Hoàn thành Phiên làm việc -> Cắm hoa
                    const types = [
                        'hoa-lavender.png', 'hoa-hong.png', 'hoa-cuc-hoa-mi.png', 
                        'hoa-huong-duong.png', 'hoa-tulip.png', 'hoa-linh-lan.png', 'hoa-lily-hong.png'
                    ];
                    let randomFlower = types[Math.floor(Math.random() * types.length)];
                    let randomX = Math.floor(Math.random() * 50) + 15;
                    let randomY = Math.floor(Math.random() * 30) + 35;
                    let randomRot = Math.floor(Math.random() * 40) - 20;
                    let randomZ = Math.floor(Math.random() * 10);

                    bouquetArr.push({ src: randomFlower, x: randomX, y: randomY, rot: randomRot, z: randomZ });
                    localStorage.setItem('qn_bouquet', JSON.stringify(bouquetArr));
                    renderBouquet();

                    // 2. Tự động chuyển sang mode Nghỉ ngơi (5 phút)
                    isWorking = false;
                    timeRemaining = 5 * 60;
                    modeText.innerText = "☕ Nghỉ giải lao (5 phút)";
                    modeText.style.color = "#388e3c";
                    document.getElementById('timerDisplay').innerText = "05:00";
                    btn.innerText = "Bắt đầu nghỉ";
                    
                    localStorage.setItem('qn_total_focus', totalFocusSeconds);
                    updateTotalDisplay();
                    alert("Giỏi quá! Cậu đã hoàn thành một phiên tập trung và được tặng 1 bông hoa 💐. Nghỉ ngơi 5 phút thôi nhé!");

                } else {
                    // 3. Hoàn thành Phiên nghỉ ngơi -> Chuẩn bị quay lại làm
                    isWorking = true;
                    workMins = parseInt(document.getElementById('timerInput').value) || 20;
                    timeRemaining = workMins * 60;
                    modeText.innerText = "🔥 Sẵn sàng làm việc!";
                    modeText.style.color = "var(--accent)";
                    document.getElementById('timerDisplay').innerText = formatTime(timeRemaining);
                    btn.innerText = "Bắt đầu làm";

                    alert("Hết giờ nghỉ rồi Nghi ơi! Quay lại chiến đấu tiếp nào 💪");
                }
            }
        }, 1000);
    }
};

// NÚT RESET: Khôi phục mọi thứ về lúc đầu và dọn sạch hoa
window.resetTimer = () => {
    if (confirm("Reset sẽ xóa sạch bó hoa hiện tại và bắt đầu lại thời gian. Cậu có chắc không?")) {
        clearInterval(timerInterval);
        isTimerRunning = false;
        isWorking = true;

        let workMins = parseInt(document.getElementById('timerInput').value) || 20;
        timeRemaining = workMins * 60;

        document.getElementById('timerDisplay').innerText = formatTime(timeRemaining);
        document.getElementById('startTimerBtn').innerText = "Bắt đầu";
        let modeText = document.getElementById('timerMode');
        modeText.innerText = "Sẵn sàng làm việc!";
        modeText.style.color = "var(--accent)";

        bouquetArr = [];
        localStorage.setItem('qn_bouquet', JSON.stringify(bouquetArr));
        renderBouquet();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    let workMins = parseInt(document.getElementById('timerInput').value) || 20;
    timeRemaining = workMins * 60;
    document.getElementById('timerDisplay').innerText = formatTime(timeRemaining);
    updateTotalDisplay();
    renderBouquet();
});
