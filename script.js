// --- CHUNG (Đồng hồ, Đổi Tab, Đổi Mục Tiêu) ---
function updateClock() {
    const now = new Date();
    const options = { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
    const dateOptions = { timeZone: 'Asia/Ho_Chi_Minh', day: '2-digit', month: '2-digit', year: 'numeric' };
    document.getElementById('vnClock').innerText = `🇻🇳 ${new Intl.DateTimeFormat('vi-VN', dateOptions).format(now)} - ${new Intl.DateTimeFormat('vi-VN', options).format(now)}`;
}
setInterval(updateClock, 1000); updateClock();

function switchTab(id) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    event.target.classList.add('active');
}

function editGoal() {
    const newGoal = prompt("Nhập mục tiêu mới:", document.getElementById('myGoal').innerText);
    if(newGoal) { document.getElementById('myGoal').innerText = newGoal; localStorage.setItem('qn_goal', newGoal); }
}
if(localStorage.getItem('qn_goal')) document.getElementById('myGoal').innerText = localStorage.getItem('qn_goal');

function setTheme(accent, bg) {
    document.documentElement.style.setProperty('--accent', accent); document.documentElement.style.setProperty('--bg-main', bg);
    localStorage.setItem('qn_theme_accent', accent); localStorage.setItem('qn_theme_bg', bg);
}
if(localStorage.getItem('qn_theme_accent')) setTheme(localStorage.getItem('qn_theme_accent'), localStorage.getItem('qn_theme_bg'));

const prioLabels = { high: '🔴 Hoàn thành trong thời gian quy định', medium: '🟡 Hoàn thành trong 12 tiếng', low: '🔵 Hoàn thành trong ngày' };
const prioClasses = { high: 'prio-high', medium: 'prio-medium', low: 'prio-low' };

// --- VIỆC HÔM NAY ---
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
                        <input type="checkbox" style="width:18px;height:18px;accent-color:var(--accent)" ${t.done ? 'checked' : ''} onchange="toggleDaily(${t.id})">
                        <span style="font-weight:bold">${t.text}</span>
                    </div>
                    <div style="font-size:11px; margin-top:5px; margin-left:28px; color:#666;">
                        🕒 ${t.time || '--:--'} | Mức độ: <span class="${prioClasses[t.prio]}">${prioLabels[t.prio]}</span>
                    </div>
                </div>
                <button style="background:none;border:none;color:var(--red);font-weight:bold;cursor:pointer;" onclick="${t.archived ? `hardDeleteDaily(${t.id})` : `archiveDaily(${t.id})`}">${t.archived ? 'Xóa hẳn' : '✕'}</button>
            </div>`;
        if(t.archived) history.innerHTML += html; else list.innerHTML += html;
    });
}
window.addDaily = () => {
    const t=document.getElementById('dailyInput'), tm=document.getElementById('dailyTime'), p=document.getElementById('dailyPrio');
    if(t.value.trim() !== '') { 
        dailyTasks.push({ id: Date.now(), text: t.value.trim(), time: tm.value, prio: p.value, done: false, archived: false }); 
        localStorage.setItem('qn_daily_v2', JSON.stringify(dailyTasks)); t.value=''; tm.value=''; renderDaily(); 
    }
};
window.toggleDaily = (id) => { let task = dailyTasks.find(t => t.id === id); if(task) task.done = !task.done; localStorage.setItem('qn_daily_v2', JSON.stringify(dailyTasks)); renderDaily(); };
window.archiveDaily = (id) => { let task = dailyTasks.find(t => t.id === id); if(task) task.archived = true; localStorage.setItem('qn_daily_v2', JSON.stringify(dailyTasks)); renderDaily(); };
window.hardDeleteDaily = (id) => { if(confirm("Xóa vĩnh viễn?")) { dailyTasks = dailyTasks.filter(t => t.id !== id); localStorage.setItem('qn_daily_v2', JSON.stringify(dailyTasks)); renderDaily(); }};
window.toggleHistory = () => { document.getElementById('historyList').classList.toggle('show'); };

// --- KẾ HOẠCH TUẦN ---
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
                    <div style="display:flex; justify-content:space-between; width:100%; align-items:center;">
                        <div style="display:flex; gap:3px;"><input type="checkbox" ${task.done ? 'checked' : ''} onchange="toggleWk('${key}', ${idx})"><span style="font-weight:bold">${task.text}</span></div>
                        <button style="background:none;border:none;color:var(--red);cursor:pointer;" onclick="deleteWk('${key}', ${idx})">✕</button>
                    </div>
                </div>
            `).join('');
            grid.innerHTML += `<div class="wk-cell">${tasks}<div class="add-btn-small" onclick="openWkModal('${key}')">+ Thêm</div></div>`;
        });
    });
}
window.openWkModal = (key) => { currentWkKey = key; document.getElementById('wkModalTitle').innerText = `Thêm việc: ${key.replace('-', ' ')}`; document.getElementById('wkInput').value = ''; document.getElementById('wkModal').style.display = 'flex'; }
window.saveWk = () => {
    let t = document.getElementById('wkInput').value.trim(), tm = document.getElementById('wkTime').value, p = document.getElementById('wkPrio').value;
    if(!t) return;
    if(!weekData[currentWkKey]) weekData[currentWkKey] = [];
    weekData[currentWkKey].push({ text: t, time: tm, prio: p, done: false });
    localStorage.setItem('qn_week_v2', JSON.stringify(weekData)); document.getElementById('wkModal').style.display='none'; renderWk();
}
window.toggleWk = (key, idx) => { weekData[key][idx].done = !weekData[key][idx].done; localStorage.setItem('qn_week_v2', JSON.stringify(weekData)); renderWk(); };
window.deleteWk = (key, idx) => { weekData[key].splice(idx, 1); localStorage.setItem('qn_week_v2', JSON.stringify(weekData)); renderWk(); };

// --- LỊCH THÁNG ---
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
        let events = (calData[dateKey] || []).map((ev, idx) => `<div class="event-tag" onclick="deleteCal('${dateKey}', ${idx})">${ev}</div>`).join('');
        let isToday = (i === new Date().getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear());
        let todayStyle = isToday ? 'background: #fff0f6; border: 2px solid var(--accent);' : '';
        grid.innerHTML += `<div class="cal-day" style="${todayStyle}"><div class="day-num">${i}</div>${events}<div class="add-btn-small" onclick="addCal('${dateKey}')">+</div></div>`;
    }
}
window.prevMonth = () => { currMonth--; if(currMonth < 0) { currMonth = 11; currYear--; } renderCal(); }
window.nextMonth = () => { currMonth++; if(currMonth > 11) { currMonth = 0; currYear++; } renderCal(); }
window.addCal = (dateKey) => { let v = prompt("Ghi chú sự kiện:"); if(v){ if(!calData[dateKey]) calData[dateKey]=[]; calData[dateKey].push(v); localStorage.setItem('qn_cal', JSON.stringify(calData)); renderCal(); }};
window.deleteCal = (dateKey, idx) => { if(confirm('Xóa sự kiện này?')) { calData[dateKey].splice(idx, 1); localStorage.setItem('qn_cal', JSON.stringify(calData)); renderCal(); }};

// --- KHỞI CHẠY ---
document.addEventListener('DOMContentLoaded', () => {
    renderDaily(); renderWk(); renderCal();
    const dailyInp = document.getElementById('dailyInput');
    if(dailyInp) dailyInp.addEventListener('keypress', e => { if(e.key === 'Enter') addDaily(); });
});
