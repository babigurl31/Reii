function updateClock() {
    const now = new Date();
    const options = { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const dateOptions = { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', year: 'numeric' };
    const clockEl = document.getElementById('vnClock');
    if(clockEl) clockEl.innerText = `🇻🇳 ${new Intl.DateTimeFormat('vi-VN', dateOptions).format(now)} - ${new Intl.DateTimeFormat('vi-VN', options).format(now)}`;
}
setInterval(updateClock, 1000); updateClock();

function switchTab(id, targetEl) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if(targetEl) targetEl.classList.add('active');
}

function editTitle() {
    const newTitle = prompt("Nhập tên mới:", document.getElementById('siteTitle').innerText);
    if(newTitle && newTitle.trim() !== '') { document.getElementById('siteTitle').innerText = newTitle.trim(); localStorage.setItem('qn_title', newTitle.trim()); }
}
function editGoal() {
    const newGoal = prompt("Nhập mục tiêu mới:", document.getElementById('myGoal').innerText);
    if(newGoal) { document.getElementById('myGoal').innerText = newGoal; localStorage.setItem('qn_goal', newGoal); }
}

const prioLabels = { high: '🔴 Quan trọng', medium: '🟡 Trong 12 tiếng', low: '🔵 Trong ngày' };
const prioClasses = { high: 'prio-high', medium: 'prio-medium', low: 'prio-low' };

let dailyTasks = JSON.parse(localStorage.getItem('qn_daily_v2')) || [];
function renderDaily() {
    const list = document.getElementById('dailyList'), history = document.getElementById('historyList');
    if(!list || !history) return;
    list.innerHTML = ''; history.innerHTML = '';
    dailyTasks.forEach(t => {
let html = `
            <div class="daily-task ${t.done ? 'done' : ''}" style="opacity: ${t.archived ? '0.6' : '1'}">
                <div style="flex:1">
                    <div style="display:flex; align-items:center; gap:10px;">
                        <input type="checkbox" class="chk-daily" data-id="${t.id}" style="width:18px;height:18px;accent-color:var(--accent);">
                        
                        <button class="btn-play-task" onclick="window.startFocusFromPlanner('${t.text}', this.parentElement.parentElement.querySelector('.task-time-input').value)" style="background: transparent; border: none; cursor: pointer; font-size: 16px;" title="Focus việc này!">▶️</button>
                        
                        <span style="font-weight:bold">${t.text}</span>
                    </div>
                    
                    <div style="display:flex; align-items:center; font-size:11px; margin-top:5px; margin-left:28px; color:#666;">
                        🕒 
                        <input type="number" class="task-time-input" value="${t.time || 25}" style="width: 45px; padding: 2px; margin: 0 5px; border: 1px solid #ccc; border-radius: 4px; text-align: center; font-family: inherit;"> phút 
                        </div>
                </div>
                <button class="btn-del-daily" data-id="${t.id}" data-archived="${t.archived}" style="background:none;border:none;cursor:pointer;">🗑</button>
            </div>
        `;
        if(t.archived) history.innerHTML += html; else list.innerHTML += html;
    });
}
function addDaily() {
    const t=document.getElementById('dailyInput'), tm=document.getElementById('dailyTime'), p=document.getElementById('dailyPrio');
    if(t.value.trim() !== '') { 
        dailyTasks.push({ id: Date.now(), text: t.value.trim(), time: tm.value, prio: p.value, done: false, archived: false }); 
        localStorage.setItem('qn_daily_v2', JSON.stringify(dailyTasks)); t.value=''; tm.value=''; renderDaily(); 
    }
}
function toggleDaily(id) { let task = dailyTasks.find(t => t.id === id); if(task) task.done = !task.done; localStorage.setItem('qn_daily_v2', JSON.stringify(dailyTasks)); renderDaily(); }
function archiveDaily(id) { let task = dailyTasks.find(t => t.id === id); if(task) task.archived = true; localStorage.setItem('qn_daily_v2', JSON.stringify(dailyTasks)); renderDaily(); }
function hardDeleteDaily(id) { if(confirm("Xóa vĩnh viễn công việc này?")) { dailyTasks = dailyTasks.filter(t => t.id !== id); localStorage.setItem('qn_daily_v2', JSON.stringify(dailyTasks)); renderDaily(); }}

let weekData = JSON.parse(localStorage.getItem('qn_week_v2')) || {};
const daysWk = ['Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7','CN'], timesWk = ['Sáng','Chiều','Tối'];
let currentWkKey = '';
function renderWk() {
    const grid = document.getElementById('weekGrid');
    if(!grid) return;
    grid.innerHTML = '<div class="wk-header"></div>' + daysWk.map(d=>`<div class="wk-header">${d}</div>`).join('');
    timesWk.forEach(t => {
        grid.innerHTML += `<div class="wk-time">${t}</div>`;
        daysWk.forEach(d => {
            let key = `${d}-${t}`;
            let tasks = (weekData[key] || []).map((task, idx) => `
                <div class="task-card ${task.done ? 'done' : ''}">
                    <div class="task-header">
                        <div style="display:flex; align-items:center; gap:5px;">
                            <input type="checkbox" class="chk-wk" data-key="${key}" data-idx="${idx}" ${task.done ? 'checked' : ''}>
                            <span style="font-weight:bold">${task.text}</span>
                        </div>
                        <button class="task-del-btn btn-del-wk" data-key="${key}" data-idx="${idx}">✕</button>
                    </div>
                    <div class="task-meta"><span>🕒 ${task.time || '--:--'}</span> • <span class="${prioClasses[task.prio]}">${prioLabels[task.prio]}</span></div>
                </div>
            `).join('');
            grid.innerHTML += `<div class="wk-cell" data-label="${d} - ${t}">${tasks}<div class="add-btn-small btn-add-wk" data-key="${key}">+ Thêm việc</div></div>`;
        });
    });
}
function openWkModal(key) { currentWkKey = key; document.getElementById('wkModalTitle').innerText = `Thêm việc: ${key.replace('-', ' ')}`; document.getElementById('wkInput').value = ''; document.getElementById('wkModal').style.display = 'flex'; }
function saveWk() {
    let t = document.getElementById('wkInput').value.trim(), tm = document.getElementById('wkTime').value, p = document.getElementById('wkPrio').value;
    if(!t) return alert("Cần nhập tên công việc!");
    if(!weekData[currentWkKey]) weekData[currentWkKey] = [];
    weekData[currentWkKey].push({ text: t, time: tm, prio: p, done: false });
    localStorage.setItem('qn_week_v2', JSON.stringify(weekData)); document.getElementById('wkModal').style.display='none'; renderWk();
}
function toggleWk(key, idx) { weekData[key][idx].done = !weekData[key][idx].done; localStorage.setItem('qn_week_v2', JSON.stringify(weekData)); renderWk(); }
function deleteWk(key, idx) { weekData[key].splice(idx, 1); localStorage.setItem('qn_week_v2', JSON.stringify(weekData)); renderWk(); }

let calData = JSON.parse(localStorage.getItem('qn_cal')) || {};
let currDate = new Date(); let currMonth = currDate.getMonth(); let currYear = currDate.getFullYear();
function renderCal() {
    const grid = document.getElementById('calGrid');
    if(!grid) return;
    document.getElementById('monthYearDisplay').innerText = `Tháng ${currMonth + 1} / ${currYear}`;
    grid.innerHTML = `<div class="cal-header">T2</div><div class="cal-header">T3</div><div class="cal-header">T4</div><div class="cal-header">T5</div><div class="cal-header">T6</div><div class="cal-header">T7</div><div class="cal-header">CN</div>`;
    let firstDay = new Date(currYear, currMonth, 1).getDay(), startOffset = firstDay === 0 ? 6 : firstDay - 1, daysInMonth = new Date(currYear, currMonth + 1, 0).getDate();
    for(let i = 0; i < startOffset; i++) grid.innerHTML += `<div class="cal-day" style="border:none; background:transparent;"></div>`;
    for(let i = 1; i <= daysInMonth; i++) {
        let dateKey = `${currYear}-${currMonth + 1}-${i}`;
        let events = (calData[dateKey] || []).map((ev, idx) => `<div class="event-tag btn-del-cal" data-key="${dateKey}" data-idx="${idx}">${ev}</div>`).join('');
        let isToday = (i === new Date().getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear());
        let todayStyle = isToday ? 'background: #fff0f6; border: 2px solid var(--accent);' : '';
        grid.innerHTML += `<div class="cal-day" style="${todayStyle}"><div class="day-num">${i}</div>${events}<div class="add-btn-small btn-add-cal" data-key="${dateKey}">+ Thêm</div></div>`;
    }
}
function addCal(dateKey) { 
    let v = prompt("Ghi chú sự kiện:"); 
    if(v){ 
        if(!calData[dateKey]) calData[dateKey]=[]; 
        calData[dateKey].push(v); 
        localStorage.setItem('qn_cal', JSON.stringify(calData)); 
        renderCal(); 
        if(typeof renderCircleProgress === 'function') renderCircleProgress(); 
    }
}
function deleteCal(dateKey, idx) { 
    if(confirm('Xóa sự kiện này?')) { 
        calData[dateKey].splice(idx, 1); 
        localStorage.setItem('qn_cal', JSON.stringify(calData)); 
        renderCal(); 
        if(typeof renderCircleProgress === 'function') renderCircleProgress(); 
    }
}

// BỘ LẮNG NGHE SỰ KIỆN TỰ ĐỘNG KHI MỞ WEB
document.addEventListener('DOMContentLoaded', () => {
    if(localStorage.getItem('qn_title')) document.getElementById('siteTitle').innerText = localStorage.getItem('qn_title');
    if(localStorage.getItem('qn_goal')) document.getElementById('myGoal').innerText = localStorage.getItem('qn_goal');

    document.getElementById('siteTitle').addEventListener('dblclick', editTitle);
    document.getElementById('myGoal').addEventListener('dblclick', editGoal);

    document.getElementById('tabDailyBtn').addEventListener('click', e => switchTab('daily', e.currentTarget));
    document.getElementById('tabWeeklyBtn').addEventListener('click', e => switchTab('weekly', e.currentTarget));
    document.getElementById('tabMonthlyBtn').addEventListener('click', e => switchTab('monthly', e.currentTarget));

    document.getElementById('btnDailyAdd').addEventListener('click', addDaily);
    document.getElementById('dailyInput').addEventListener('keypress', e => { if(e.key === 'Enter') addDaily(); });
    document.getElementById('btnToggleHistory').addEventListener('click', () => document.getElementById('historyList').classList.toggle('show'));

    document.getElementById('btnPrevMonth').addEventListener('click', () => { currMonth--; if(currMonth < 0) { currMonth = 11; currYear--; } renderCal(); });
    document.getElementById('btnNextMonth').addEventListener('click', () => { currMonth++; if(currMonth > 11) { currMonth = 0; currYear++; } renderCal(); });

    document.getElementById('btnWkSave').addEventListener('click', saveWk);
    document.getElementById('btnWkCancel').addEventListener('click', () => document.getElementById('wkModal').style.display='none');

    document.getElementById('daily').addEventListener('change', e => { if(e.target.classList.contains('chk-daily')) toggleDaily(parseInt(e.target.dataset.id)); });
    document.getElementById('daily').addEventListener('click', e => {
        if(e.target.classList.contains('btn-del-daily')) { let id = parseInt(e.target.dataset.id); if(e.target.dataset.archived === 'true') hardDeleteDaily(id); else archiveDaily(id); }
    });

    document.getElementById('weekly').addEventListener('change', e => { if(e.target.classList.contains('chk-wk')) toggleWk(e.target.dataset.key, parseInt(e.target.dataset.idx)); });
    document.getElementById('weekly').addEventListener('click', e => {
        if(e.target.classList.contains('btn-add-wk')) openWkModal(e.target.dataset.key);
        if(e.target.classList.contains('btn-del-wk')) deleteWk(e.target.dataset.key, parseInt(e.target.dataset.idx));
    });

    document.getElementById('monthly').addEventListener('click', e => {
        if(e.target.classList.contains('btn-add-cal')) addCal(e.target.dataset.key);
        if(e.target.classList.contains('btn-del-cal')) deleteCal(e.target.dataset.key, parseInt(e.target.dataset.idx));
    });

    renderDaily(); renderWk(); renderCal();
});
