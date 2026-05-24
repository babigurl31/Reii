function renderCircleProgress() {
    const container = document.getElementById('circleProgressContainer');
    if(!container) return;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 1. TÍNH TIẾN ĐỘ NĂM (%)
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear() + 1, 0, 1);
    const yearPercent = Math.min(100, Math.max(0, ((now - startOfYear) / (endOfYear - startOfYear)) * 100)).toFixed(1);

    // 2. TÌM SỰ KIỆN GẦN NHẤT TRONG LỊCH
    let calData = JSON.parse(localStorage.getItem('qn_cal')) || {};
    let upcomingEvent = null;
    let minDaysToEvent = Infinity;

    for (const [dateStr, events] of Object.entries(calData)) {
        // BỘ LỌC MỚI: Nếu ngày đó đã bị xóa hết sự kiện (danh sách trống) thì bỏ qua hoàn toàn
        if (!events || events.length === 0) continue;

        const [y, m, d] = dateStr.split('-').map(Number);
        const eventDate = new Date(y, m - 1, d);
        const diffDays = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));

        // Chỉ lấy sự kiện từ hôm nay trở đi
        if (diffDays >= 0 && diffDays < minDaysToEvent) {
            minDaysToEvent = diffDays;
            upcomingEvent = { text: events[0], days: diffDays }; 
        }
    }

    // Thiết lập số liệu cho ô Sự kiện (Nếu không có sự kiện nào sẽ tự động reset về rỗng)
    let eventPercent = 0;
    let eventText = "Chưa có sự kiện";
    let eventDaysStr = "--";
    
    if (upcomingEvent) {
        eventPercent = Math.max(0, 100 - (upcomingEvent.days / 30 * 100));
        if(upcomingEvent.days === 0) eventPercent = 100; // Hôm nay = đầy 100% vòng
        eventText = upcomingEvent.text;
        eventDaysStr = upcomingEvent.days === 0 ? "Hôm nay" : upcomingEvent.days;
    }

    // 3. VẼ 2 VÒNG TRÒN RA WEB
    container.innerHTML = `
        <div class="circle-box">
            <div class="circle-title">⏳ Tiến độ năm</div>
            <div class="circle-progress" style="background: conic-gradient(var(--accent) ${yearPercent}%, rgba(255,255,255,0.6) 0);">
                <div class="circle-inner">
                    <span class="circle-val">${Math.floor(yearPercent)}<span style="font-size:14px">%</span></span>
                </div>
            </div>
            <div class="event-name">Năm ${now.getFullYear()}</div>
        </div>

        <div class="circle-box">
            <div class="circle-title">📌 Sự kiện tới</div>
            <div class="circle-progress" style="background: conic-gradient(var(--accent) ${eventPercent}%, rgba(255,255,255,0.6) 0);">
                <div class="circle-inner">
                    <span class="circle-val" ${upcomingEvent && upcomingEvent.days === 0 ? 'style="font-size:16px; margin-top:5px;"' : ''}>${eventDaysStr}</span>
                    ${upcomingEvent && upcomingEvent.days > 0 ? '<span class="circle-label">ngày nữa</span>' : ''}
                </div>
            </div>
            <div class="event-name" title="${eventText}">${eventText}</div>
        </div>
    `;
}

// Gọi hàm chạy tự động khi vừa mở web lên
document.addEventListener('DOMContentLoaded', renderCircleProgress);