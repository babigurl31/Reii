function renderCircleProgress() {
    const container = document.getElementById('circleProgressContainer');
    if(!container) return;

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // 1. Calculate Year Progress (%)
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const endOfYear = new Date(now.getFullYear() + 1, 0, 1);
    const yearPercent = Math.min(100, Math.max(0, ((now - startOfYear) / (endOfYear - startOfYear)) * 100)).toFixed(1);

    // 2. Find Upcoming Event
    let calData = JSON.parse(localStorage.getItem('qn_cal')) || {};
    let upcomingEvent = null;
    let minDaysToEvent = Infinity;

    for (const [dateStr, events] of Object.entries(calData)) {
        if (!events || events.length === 0) continue;

        const [y, m, d] = dateStr.split('-').map(Number);
        const eventDate = new Date(y, m - 1, d);
        const diffDays = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));

        if (diffDays >= 0 && diffDays < minDaysToEvent) {
            minDaysToEvent = diffDays;
            
            // Xử lý an toàn cho cả dữ liệu lịch cũ (string) và mới (object có màu)
            let firstEvent = events[0];
            let eventText = typeof firstEvent === 'object' ? firstEvent.text : firstEvent;
            
            upcomingEvent = { text: eventText, days: diffDays }; 
        }
    }

    let eventPercent = 0;
    let eventText = "No events";
    let eventDaysStr = "--";
    
    if (upcomingEvent) {
        eventPercent = Math.max(0, 100 - (upcomingEvent.days / 30 * 100));
        if(upcomingEvent.days === 0) eventPercent = 100;
        eventText = upcomingEvent.text;
        eventDaysStr = upcomingEvent.days === 0 ? "Today" : upcomingEvent.days;
    }

    // 3. Render
    container.innerHTML = `
        <div class="circle-box">
            <div class="circle-title">⏳ Year Progress</div>
            <div class="circle-progress" style="background: conic-gradient(var(--accent) ${yearPercent}%, rgba(255,255,255,0.6) 0);">
                <div class="circle-inner">
                    <span class="circle-val">${Math.floor(yearPercent)}<span style="font-size:14px">%</span></span>
                </div>
            </div>
            <div class="event-name">Year ${now.getFullYear()}</div>
        </div>

        <div class="circle-box">
            <div class="circle-title">📌 Upcoming Event</div>
            <div class="circle-progress" style="background: conic-gradient(var(--accent) ${eventPercent}%, rgba(255,255,255,0.6) 0);">
                <div class="circle-inner">
                    <span class="circle-val" ${upcomingEvent && upcomingEvent.days === 0 ? 'style="font-size:16px; margin-top:5px;"' : ''}>${eventDaysStr}</span>
                    ${upcomingEvent && upcomingEvent.days > 0 ? '<span class="circle-label">days left</span>' : ''}
                </div>
            </div>
            <div class="event-name" title="${eventText}">${eventText}</div>
        </div>
    `;
}

document.addEventListener('DOMContentLoaded', renderCircleProgress);
