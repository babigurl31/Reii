document.addEventListener('DOMContentLoaded', () => {
    const tabSummaryBtn = document.getElementById('tabSummaryBtn');

    if(tabSummaryBtn) {
        tabSummaryBtn.addEventListener('click', renderSummary);
    }

    function renderSummary() {
        let dailyNodes = document.querySelectorAll('#dailyList .daily-task');
        let dHtml = '';
        dailyNodes.forEach(node => {
            let textSpan = node.querySelector('span[style*="font-weight:bold"]');
            if (textSpan) {
                let text = textSpan.textContent.trim();
                let isDone = node.classList.contains('done');
                dHtml += `<div class="sum-item ${isDone ? 'done' : ''}" style="margin-bottom: 8px;">
                            <span>${isDone ? '✅' : '⏳'}</span> 
                            <span>${text}</span>
                          </div>`;
            }
        });
        let sumDaily = document.getElementById('sumDailyList');
        if(sumDaily) sumDaily.innerHTML = dHtml || '<div class="sum-empty" style="color:#888; font-style:italic;">No tasks yet~ 🌸</div>';

        let weeklyNodes = document.querySelectorAll('#weekGrid .task-card');
        let wHtml = '';
        weeklyNodes.forEach(node => {
            let textSpan = node.querySelector('.task-header span');
            if (textSpan) {
                let text = textSpan.textContent.trim();
                let isDone = node.classList.contains('done'); 
                wHtml += `<div class="sum-item ${isDone ? 'done' : ''}" style="margin-bottom: 8px;">
                            <span>${isDone ? '✅' : '📌'}</span> 
                            <span>${text}</span>
                          </div>`;
            }
        });
        let sumWeekly = document.getElementById('sumWeeklyList');
        if(sumWeekly) sumWeekly.innerHTML = wHtml || '<div class="sum-empty" style="color:#888; font-style:italic;">Nothing for this week~ 🌟</div>';

        let monthlyNodes = document.querySelectorAll('#calGrid .event-tag');
        let mHtml = '';
        monthlyNodes.forEach(node => {
            let text = node.textContent.trim();
            mHtml += `<div class="sum-item" style="margin-bottom: 8px;">
                        <span>🗓️</span> 
                        <span>${text}</span>
                      </div>`;
        });
        let sumMonthly = document.getElementById('sumMonthlyList');
        if(sumMonthly) sumMonthly.innerHTML = mHtml || '<div class="sum-empty" style="color:#888; font-style:italic;">No upcoming events~ ✨</div>';
    }
});
