// Thời gian giới hạn: 5 phút = 300 giây
const MAX_TIME = 300; 

function blockTikTok() {
    // Thay thế toàn bộ trang TikTok bằng màn hình nhắc nhở màu hồng
    document.body.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background-color: #fce4ec; font-family: 'Segoe UI', Arial, sans-serif; text-align: center; padding: 20px;">
            <h1 style="font-size: 3rem; color: #ec407a; margin-bottom: 20px;">🌸 Hết giờ giải trí rồi! 🌸</h1>
            <p style="font-size: 1.5rem; color: #333;">Cậu đã dùng hết 5 phút lướt TikTok của ngày hôm nay.</p>
            <p style="font-size: 1.2rem; color: #666; margin-top: 10px;">Tắt tab này đi và quay lại hoàn thành các mục tiêu trong Weekly Planner thôi nào!</p>
        </div>
    `;
    document.body.style.overflow = 'hidden';
}

function checkAndTrackTime() {
    // Chỉ đếm thời gian khi cậu đang thực sự mở và nhìn vào tab TikTok
    if (document.visibilityState !== 'visible') return;

    const today = new Date().toISOString().split('T')[0]; // Lấy ngày hiện tại (YYYY-MM-DD)

    chrome.storage.local.get(['tiktokDate', 'tiktokTime'], (result) => {
        let date = result.tiktokDate;
        let time = result.tiktokTime || 0;

        // Nếu sang ngày mới, reset lại bộ đếm thời gian về 0
        if (date !== today) {
            date = today;
            time = 0;
        }

        // Nếu đã quá 5 phút thì khóa luôn
        if (time >= MAX_TIME) {
            blockTikTok();
            chrome.storage.local.set({ tiktokDate: date, tiktokTime: time });
            return;
        }

        // Nếu chưa quá, cộng thêm 1 giây và lưu lại
        time += 1;
        chrome.storage.local.set({ tiktokDate: date, tiktokTime: time });
    });
}

// Kiểm tra ngay khi vừa truy cập TikTok
chrome.storage.local.get(['tiktokDate', 'tiktokTime'], (result) => {
    const today = new Date().toISOString().split('T')[0];
    if (result.tiktokDate === today && result.tiktokTime >= MAX_TIME) {
        blockTikTok(); // Nếu hôm nay đã hết hạn, khóa ngay lập tức
    } else {
        // Nếu còn hạn, cho bộ đếm chạy ngầm mỗi 1 giây (1000 milliseconds)
        setInterval(checkAndTrackTime, 1000);
    }
});