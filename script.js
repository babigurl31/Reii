// Đã giữ nguyên hàm thời gian ở VN theo yêu cầu
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
    const newTitle = prompt("Enter new title:", document.getElementById('siteTitle').innerText);
    if(newTitle && newTitle.trim() !== '') { document.getElementById('siteTitle').innerText = newTitle.trim(); localStorage.setItem('qn_title', newTitle.trim()); }
}
function editGoal() {
    const newGoal = prompt("Enter new goal:", document.getElementById('myGoal').innerText);
    if(newGoal) { document.getElementById('myGoal').innerText = newGoal; localStorage.setItem('qn_goal', newGoal); }
}

// --- 1. DAILY TASKS (Xóa Priority) ---
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
                        <input type="checkbox" class="chk-daily" data-id="${t.id}" style="width:18px;height:18px;accent-color:var(--accent);" ${t.done ? 'checked' : ''}>
                        <button class="btn-play-task" data-name="${t.text}" style="background: transparent; border: none; cursor: pointer; font-size: 16px;" title="Focus this task!">▶️</button>
                        <span style="font-weight:bold">${t.text}</span>
                    </div>
                    <div style="display:flex; align-items:center; font-size:11px; margin-top:5px; margin-left:28px; color:#666;">
                        🕒 <input type="number" class="task-time-input" value="${t.time || 25}" style="width: 40px; padding: 2px; margin: 0 5px; border: 1px solid #ccc; border-radius: 4px; text-align: center; font-family: inherit;"> mins 
                    </div>
                </div>
                <button class="btn-del-daily" data-id="${t.id}" data-archived="${t.archived}" style="background:none;border:none;color:var(--red);font-weight:bold;cursor:pointer;" title="${t.archived ? 'Delete permanently' : 'Archive'}">${t.archived ? 'Del' : '✕'}</button>
            </div>`;        
            if(t.archived) history.innerHTML += html; else list.innerHTML += html;
    });
}
function addDaily() {
    const t=document.getElementById('dailyInput'), tm=document.getElementById('dailyTime');
    if(t.value.trim() !== '') { 
        dailyTasks.push({ id: Date.now(), text: t.value.trim(), time: tm.value, done: false, archived: false }); 
        localStorage.setItem('qn_daily_v2', JSON.stringify(dailyTasks)); t.value=''; tm.value=''; renderDaily(); 
    }
}
function toggleDaily(id) { let task = dailyTasks.find(t => t.id === id); if(task) task.done = !task.done; localStorage.setItem('qn_daily_v2', JSON.stringify(dailyTasks)); renderDaily(); }
function archiveDaily(id) { let task = dailyTasks.find(t => t.id === id); if(task) task.archived = true; localStorage.setItem('qn_daily_v2', JSON.stringify(dailyTasks)); renderDaily(); }
function hardDeleteDaily(id) { if(confirm("Permanently delete this task?")) { dailyTasks = dailyTasks.filter(t => t.id !== id); localStorage.setItem('qn_daily_v2', JSON.stringify(dailyTasks)); renderDaily(); }}

// --- 2. WEEKLY PLAN ---
let weekData = JSON.parse(localStorage.getItem('qn_week_v2')) || {};
const daysWk = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], timesWk = ['Morning','Afternoon','Evening'];
let currentWkKey = '';

function renderWk() {
    const grid = document.getElementById('weekGrid');
    if(!grid) return;
    grid.innerHTML = '<div class="wk-header"></div>' + daysWk.map(d=>`<div class="wk-header">${d}</div>`).join('');
    timesWk.forEach(t => {
        grid.innerHTML += `<div class="wk-time">${t}</div>`;
        daysWk.forEach(d => {
            let key = `${d}-${t}`;
            let tasks = (weekData[key] || []).map((task, idx) => {
                let bgStyle = '';
                let fwStyle = '';
                if (task.isHighlight) {
                    let baseColor = task.color || '#ffea00';
                    bgStyle = `background-color: ${baseColor}4D; border-left: 4px solid ${baseColor};`;
                    fwStyle = `font-weight: bold;`;
                }
                return `
                <div class="task-card" style="${bgStyle} border-radius: 6px; padding: 8px; margin-bottom: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05); transition: 0.2s;">
                    <div class="task-header" style="display:flex; justify-content:space-between; width:100%; align-items:flex-start;">
                        <div style="display:flex; align-items:center; flex:1;">
                            <span style="${fwStyle} line-height:1.4;">${task.text}</span>
                        </div>
                        <button class="task-del-btn btn-del-wk" data-key="${key}" data-idx="${idx}" style="background:transparent; border:none; cursor:pointer; color:var(--red); font-weight:bold; padding-left:10px;" title="Delete">✕</button>
                    </div>
                    <div class="task-meta" style="margin-top: 5px; font-size: 12px; color: #555;">
                        <span>🕒 ${task.startTime || '--:--'} - ${task.endTime || '--:--'}</span>
                    </div>
                </div>
                `;
            }).join('');
            grid.innerHTML += `<div class="wk-cell" data-label="${d} - ${t}">${tasks}<div class="add-btn-small btn-add-wk" data-key="${key}">+ Add</div></div>`;
        });
    });
}

function openWkModal(key) { 
    currentWkKey = key; 
    document.getElementById('wkModalTitle').innerText = `Add Task: ${key.replace('-', ' ')}`; 
    document.getElementById('wkInput').value = ''; 
    document.getElementById('wkTime').value = ''; 
    if(document.getElementById('wkTimeEnd')) document.getElementById('wkTimeEnd').value = '';
    if(document.getElementById('wkHighlight')) document.getElementById('wkHighlight').checked = false;
    if(document.getElementById('wkColor')) document.getElementById('wkColor').value = '#ffea00';
    document.getElementById('wkModal').style.display = 'flex'; 
}

function saveWk() {
    let t = document.getElementById('wkInput').value.trim();
    let startTm = document.getElementById('wkTime').value;
    let endTm = document.getElementById('wkTimeEnd') ? document.getElementById('wkTimeEnd').value : '';
    let isHi = document.getElementById('wkHighlight') ? document.getElementById('wkHighlight').checked : false;
    let chosenColor = document.getElementById('wkColor') ? document.getElementById('wkColor').value : '#ffea00';
    
    if(!t) return alert("Task description is required!");
    if(!weekData[currentWkKey]) weekData[currentWkKey] = [];
    
    weekData[currentWkKey].push({ text: t, startTime: startTm, endTime: endTm, isHighlight: isHi, color: chosenColor, done: false });
    localStorage.setItem('qn_week_v2', JSON.stringify(weekData)); 
    document.getElementById('wkModal').style.display='none'; 
    renderWk();
}

function deleteWk(key, idx) { weekData[key].splice(idx, 1); localStorage.setItem('qn_week_v2', JSON.stringify(weekData)); renderWk(); }

// --- 3. MONTHLY CALENDAR (Nâng cấp thêm màu) ---
let calData = JSON.parse(localStorage.getItem('qn_cal')) || {};
let currDate = new Date(); let currMonth = currDate.getMonth(); let currYear = currDate.getFullYear();
let currentCalKey = '';

function renderCal() {
    const grid = document.getElementById('calGrid');
    if(!grid) return;
    document.getElementById('monthYearDisplay').innerText = `Month ${currMonth + 1} / ${currYear}`;
    grid.innerHTML = `<div class="cal-header">Mon</div><div class="cal-header">Tue</div><div class="cal-header">Wed</div><div class="cal-header">Thu</div><div class="cal-header">Fri</div><div class="cal-header">Sat</div><div class="cal-header">Sun</div>`;
    let firstDay = new Date(currYear, currMonth, 1).getDay(), startOffset = firstDay === 0 ? 6 : firstDay - 1, daysInMonth = new Date(currYear, currMonth + 1, 0).getDate();
    
    for(let i = 0; i < startOffset; i++) grid.innerHTML += `<div class="cal-day" style="border:none; background:transparent;"></div>`;
    
    for(let i = 1; i <= daysInMonth; i++) {
        let dateKey = `${currYear}-${currMonth + 1}-${i}`;
        
        // Render với màu được chọn (Fallback nếu là data cũ dạng chuỗi)
        let events = (calData[dateKey] || []).map((ev, idx) => {
            let text = typeof ev === 'object' ? ev.text : ev;
            let bdColor = typeof ev === 'object' && ev.color ? ev.color : '#ffb3ba';
            let bgColor = bdColor + '4D'; // Pha trong suốt
            return `<div class="event-tag btn-del-cal" data-key="${dateKey}" data-idx="${idx}" style="background-color: ${bgColor}; border-left: 3px solid ${bdColor}; padding: 3px 6px; margin-bottom: 4px; border-radius: 4px; font-size: 11px; cursor: pointer;" title="Click to delete">${text}</div>`;
        }).join('');

        let isToday = (i === new Date().getDate() && currMonth === new Date().getMonth() && currYear === new Date().getFullYear());
        let todayStyle = isToday ? 'background: #fff0f6; border: 2px solid var(--accent);' : '';
        grid.innerHTML += `<div class="cal-day" style="${todayStyle}"><div class="day-num">${i}</div>${events}<div class="add-btn-small btn-add-cal" data-key="${dateKey}">+ Add</div></div>`;
    }
}

function openCalModal(dateKey) {
    currentCalKey = dateKey;
    document.getElementById('calModalTitle').innerText = `Add Event: ${dateKey}`;
    document.getElementById('calInput').value = '';
    document.getElementById('calColor').value = '#ffb3ba'; // Màu mặc định
    document.getElementById('calModal').style.display = 'flex';
}

function saveCal() {
    let v = document.getElementById('calInput').value.trim();
    let color = document.getElementById('calColor').value;
    if(v) { 
        if(!calData[currentCalKey]) calData[currentCalKey]=[]; 
        calData[currentCalKey].push({ text: v, color: color }); 
        localStorage.setItem('qn_cal', JSON.stringify(calData)); 
        document.getElementById('calModal').style.display = 'none';
        renderCal(); 
        if(typeof renderCircleProgress === 'function') renderCircleProgress(); 
    } else {
        alert("Event description is required!");
    }
}

function deleteCal(dateKey, idx) { 
    if(confirm('Delete this event?')) { 
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
    document.getElementById('tabFocusBtn').addEventListener('click', e => switchTab('focusTab', e.currentTarget));
    document.getElementById('tabSummaryBtn').addEventListener('click', e => switchTab('summary', e.currentTarget));

    document.getElementById('btnDailyAdd').addEventListener('click', addDaily);
    document.getElementById('dailyInput').addEventListener('keypress', e => { if(e.key === 'Enter') addDaily(); });
    document.getElementById('btnToggleHistory').addEventListener('click', () => document.getElementById('historyList').classList.toggle('show'));

    document.getElementById('btnPrevMonth').addEventListener('click', () => { currMonth--; if(currMonth < 0) { currMonth = 11; currYear--; } renderCal(); });
    document.getElementById('btnNextMonth').addEventListener('click', () => { currMonth++; if(currMonth > 11) { currMonth = 0; currYear++; } renderCal(); });

    document.getElementById('btnWkSave').addEventListener('click', saveWk);
    document.getElementById('btnWkCancel').addEventListener('click', () => document.getElementById('wkModal').style.display='none');

    // Nút Calendar Event Modal
    document.getElementById('btnCalSave').addEventListener('click', saveCal);
    document.getElementById('btnCalCancel').addEventListener('click', () => document.getElementById('calModal').style.display='none');

    document.getElementById('daily').addEventListener('change', e => { if(e.target.classList.contains('chk-daily')) toggleDaily(parseInt(e.target.dataset.id)); });
    document.getElementById('daily').addEventListener('click', e => {
        if(e.target.classList.contains('btn-del-daily')) { 
            let id = parseInt(e.target.dataset.id); 
            if(e.target.dataset.archived === 'true') hardDeleteDaily(id); 
            else archiveDaily(id); 
        }
        let playBtn = e.target.closest('.btn-play-task');
        if(playBtn) {
            let taskName = playBtn.dataset.name;
            let timeInput = playBtn.closest('.daily-task').querySelector('.task-time-input');
            let minutes = timeInput ? timeInput.value : 25;
            if(window.startFocusFromPlanner) {
                window.startFocusFromPlanner(taskName, minutes);
            }
        }
    });

    document.getElementById('weekly').addEventListener('click', e => {
        if(e.target.classList.contains('btn-add-wk')) openWkModal(e.target.dataset.key);
        if(e.target.classList.contains('btn-del-wk')) deleteWk(e.target.dataset.key, parseInt(e.target.dataset.idx));
    });

    document.getElementById('monthly').addEventListener('click', e => {
        if(e.target.classList.contains('btn-add-cal')) openCalModal(e.target.dataset.key);
        if(e.target.classList.contains('btn-del-cal')) deleteCal(e.target.dataset.key, parseInt(e.target.dataset.idx));
    });

    renderDaily(); renderWk(); renderCal();
});
