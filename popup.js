
let tasks = [];
let editingId = null;
let activeFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(['tasks'], result => {
    tasks = result.tasks || [];
    render();
  });
});

function saveTasks() {
  chrome.storage.sync.set({ tasks });
  render();
}

function render() {
  const el = document.getElementById('task-list');
  el.innerHTML = '';
  
  let list = [...tasks];
  if (activeFilter === 'done') list = list.filter(t => t.hoan_thanh);
  if (activeFilter === 'pending') list = list.filter(t => !t.hoan_thanh);
  
  // Sort theo ngày và giờ
  list.sort((a, b) => {
      const dateTimeA = new Date(`${a.ngay}T${a.gio || '00:00'}`);
      const dateTimeB = new Date(`${b.ngay}T${b.gio || '00:00'}`);
      return dateTimeA - dateTimeB;
  });

  list.forEach(task => {
    const item = document.createElement('div');
    item.className = `task-item ${task.hoan_thanh ? 'done' : ''}`;
    
    // Định dạng thẻ mức độ ưu tiên
    let prioClass = 'priority-medium';
    let prioText = 'TB';
    if(task.muc_do === 'high') { prioClass = 'priority-high'; prioText = 'Cao'; }
    if(task.muc_do === 'low') { prioClass = 'priority-low'; prioText = 'Thấp'; }

    // Định dạng ngày giờ
    const dateParts = task.ngay.split('-');
    const dateStr = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}` : task.ngay;
    const timeStr = task.gio ? `🕒 ${task.gio}` : '';

    item.innerHTML = `
      <div class="task-check" data-id="${task.id}">${task.hoan_thanh ? '✓' : ''}</div>
      <div class="task-content">
        <div class="task-name">${task.viec}</div>
        <div class="task-meta">
            <span class="priority-tag ${prioClass}">${prioText}</span>
            <span>📅 ${dateStr} ${timeStr}</span>
        </div>
      </div>
      <div class="task-actions">
        <button class="task-btn delete" data-id="${task.id}">🗑️</button>
      </div>
    `;
    el.appendChild(item);
  });

  document.getElementById('subtitle').textContent = `Tổng: ${tasks.length} | Xong: ${tasks.filter(t=>t.hoan_thanh).length}`;
}

// Bật form thêm
document.getElementById('btn-add').addEventListener('click', () => {
  document.getElementById('add-form').classList.add('visible');
  document.getElementById('overlay').classList.add('visible');
  document.getElementById('input-name').value = '';
  document.getElementById('input-date').value = new Date().toISOString().split('T')[0];
  document.getElementById('input-time').value = '08:00';
  document.getElementById('input-priority').value = 'medium';
});

// Đóng form
document.getElementById('btn-cancel-form').addEventListener('click', () => {
  document.getElementById('add-form').classList.remove('visible');
  document.getElementById('overlay').classList.remove('visible');
});

// Lưu công việc
document.getElementById('btn-save').addEventListener('click', () => {
  const name = document.getElementById('input-name').value.trim();
  const date = document.getElementById('input-date').value;
  const time = document.getElementById('input-time').value;
  const priority = document.getElementById('input-priority').value;

  if (!name || !date) return alert('Vui lòng nhập tên và ngày!');

  tasks.push({
    id: Date.now().toString(),
    viec: name,
    ngay: date,
    gio: time,
    muc_do: priority,
    hoan_thanh: false
  });

  saveTasks();
  document.getElementById('add-form').classList.remove('visible');
  document.getElementById('overlay').classList.remove('visible');
});

// Check & Xóa
document.getElementById('task-list').addEventListener('click', e => {
  const checkBtn = e.target.closest('.task-check');
  const deleteBtn = e.target.closest('.task-btn.delete');

  if (checkBtn) {
    const task = tasks.find(t => t.id === checkBtn.dataset.id);
    if (task) { task.hoan_thanh = !task.hoan_thanh; saveTasks(); }
  }
  if (deleteBtn) {
    tasks = tasks.filter(t => t.id !== deleteBtn.dataset.id);
    saveTasks();
  }
});

// Lọc tab
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeFilter = tab.dataset.filter;
    render();
  });
});
