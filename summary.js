document.addEventListener('DOMContentLoaded', () => {
    const tabSummaryBtn = document.getElementById('tabSummaryBtn');
    const summaryTab = document.getElementById('summaryTab');

    // Chuyển qua tab Tổng Hợp
    tabSummaryBtn.addEventListener('click', () => {
        // Tắt hết các tab khác
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        
        // Bật tab Tổng Hợp
        tabSummaryBtn.classList.add('active');
        summaryTab.classList.add('active');

        // Chạy hàm quét dữ liệu
        renderSummary();
    });

    // Rời khỏi tab Tổng Hợp
    document.querySelectorAll('.tab-btn:not(#tabSummaryBtn)').forEach(btn => {
        btn.addEventListener('click', () => {
            summaryTab.classList.remove('active');
            tabSummaryBtn.classList.remove('active');
        });
    });

    // Hàm quét và hiển thị dữ liệu
    function renderSummary() {
        // 1. Quét Việc Hôm Nay (Daily)
        let dailyNodes = document.querySelectorAll('#dailyList .daily-task');
        let dHtml = '';
        dailyNodes.forEach(node => {
            // Loại bỏ chữ của nút Play (▶️) và các khoảng trắng thừa
            let text = node.innerText.replace('▶️', '').replace('🗑', '').trim();
            let isDone = node.classList.contains('done');
            dHtml += `<div class="sum-item ${isDone ? 'done' : ''}">
                        <span>${isDone ? '✅' : '⏳'}</span> 
                        <span>${text}</span>
                      </div>`;
        });
        document.getElementById('sumDailyList').innerHTML = dHtml || '<div class="sum-empty">Không có việc nào cả~ Babi nghỉ ngơi đi! 🌸</div>';

        // 2. Quét Kế Hoạch Tuần (Weekly)
        let weeklyNodes = document.querySelectorAll('#weekGrid .task-card');
        let wHtml = '';
        weeklyNodes.forEach(node => {
            let text = node.innerText.replace('✕', '').trim(); // Lọc bỏ dấu Xóa nếu có
            let isDone = node.classList.contains('done');
            wHtml += `<div class="sum-item ${isDone ? 'done' : ''}">
                        <span>${isDone ? '✅' : '📌'}</span> 
                        <span>${text}</span>
                      </div>`;
        });
        document.getElementById('sumWeeklyList').innerHTML = wHtml || '<div class="sum-empty">Tuần này trống trơn~ 🌟</div>';

        // 3. Quét Lịch Quan Trọng (Monthly)
        let monthlyNodes = document.querySelectorAll('#calGrid .event-tag');
        let mHtml = '';
        monthlyNodes.forEach(node => {
            let text = node.innerText.trim();
            mHtml += `<div class="sum-item">
                        <span>🗓️</span> 
                        <span>${text}</span>
                      </div>`;
        });
        document.getElementById('sumMonthlyList').innerHTML = mHtml || '<div class="sum-empty">Chưa có sự kiện nào~ ✨</div>';
    }
});
