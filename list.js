document.addEventListener('DOMContentLoaded', () => {
    // 1. CHÈN GIAO DIỆN NÚT VÀ MODAL VÀO WEB
    const listHTML = `
        <div class="list-wrapper">
            <div class="list-menu" id="listMenu">
                <button class="set-btn" id="btnOpenWishlist" title="Wishlist"><img src="icon-wishlist.png" onerror="this.style.display='none'"></button>
                <button class="set-btn" id="btnOpenChecklist" title="Checklist"><img src="icon-checklist.png" onerror="this.style.display='none'"></button>
                <button class="set-btn" id="btnOpenIdea" title="Ý tưởng"><img src="icon-idea.png" onerror="this.style.display='none'"></button>
                <button class="set-btn" id="btnOpenMisc" title="Thập cẩm"><img src="icon-misc.png" onerror="this.style.display='none'"></button>
            </div>
            <button class="main-set-btn" id="btnListMain"><img src="icon-list-main.png" onerror="this.style.display='none'"></button>
        </div>

        <div id="wishlistModal" class="theme-modal-overlay">
            <div class="theme-modal" style="max-height: 80vh; overflow-y: auto;">
                <h3>✨ Wishlist & Ước Mơ</h3>
                <div class="mini-input-group">
                    <input type="text" id="wishlistInp" placeholder="Cậu muốn mua/làm gì?">
                    <button id="btnAddWishlist">Lưu</button>
                </div>
                <ul class="mini-list" id="wishlistUl"></ul>
                <div class="modal-btns"><button class="cancel btnCloseList">Đóng</button></div>
            </div>
        </div>

        <div id="checklistModal" class="theme-modal-overlay">
            <div class="theme-modal" style="max-height: 80vh; overflow-y: auto;">
                <h3>✅ Danh sách chuẩn bị</h3>
                <div class="mini-input-group">
                    <input type="text" id="chkGroupInp" placeholder="Tạo mục mới (VD: Quà SN)...">
                    <button id="btnAddChkGroup">Tạo</button>
                </div>
                <div id="checklistContainer" style="text-align: left; margin-top: 15px;"></div>
                <div class="modal-btns"><button class="cancel btnCloseList">Đóng</button></div>
            </div>
        </div>

        <div id="ideaModal" class="theme-modal-overlay">
            <div class="theme-modal" style="max-height: 80vh; overflow-y: auto;">
                <h3>💡 Ý tưởng lóe lên</h3>
                <textarea id="ideaInp" placeholder="Viết dài thoải mái nhé Babi..." style="width: 100%; min-height: 80px; padding: 10px; border-radius: 8px; border: 1px solid var(--border); outline: none; margin-bottom: 10px;"></textarea>
                <button id="btnAddIdea" style="width: 100%; padding: 10px; background: var(--accent); color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin-bottom: 15px;">Lưu Ý Tưởng</button>
                <ul class="mini-list" id="ideaUl" style="text-align: left;"></ul>
                <div class="modal-btns"><button class="cancel btnCloseList">Đóng</button></div>
            </div>
        </div>

        <div id="miscModal" class="theme-modal-overlay">
            <div class="theme-modal" style="max-height: 80vh; overflow-y: auto;">
                <h3>🍱 Góc Thập Cẩm</h3>
                <select id="miscCategory" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border); margin-bottom: 10px; font-weight: bold; color: var(--accent);">
                    <option value="movies">🎬 Phim hay</option>
                    <option value="hangout">⛺ Chỗ đi chơi</option>
                    <option value="food">🍕 Chỗ ăn uống</option>
                </select>
                <div class="mini-input-group">
                    <input type="text" id="miscInp" placeholder="Nhập tên phim/quán...">
                    <button id="btnAddMisc">Lưu</button>
                </div>
                <button id="btnRandomMovie" style="width: 100%; padding: 8px; background: #333; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin-bottom: 10px;">🎲 Chọn ngẫu nhiên phim</button>
                <ul class="mini-list" id="miscUl" style="text-align: left;"></ul>
                <div class="modal-btns"><button class="cancel btnCloseList">Đóng</button></div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', listHTML);

    // HÀM CHUNG: LƯU VÀO LỊCH SỬ NHIỆM VỤ DAILY
    function saveToHistory(type, text, isDone) {
        let daily = JSON.parse(localStorage.getItem('qn_daily_v2')) || [];
        daily.push({
            id: Date.now(), text: `[${type}] ${text}`, time: '--:--', prio: 'low',
            done: isDone, archived: true // Đánh dấu archived để bay thẳng vào Lịch sử chung
        });
        localStorage.setItem('qn_daily_v2', JSON.stringify(daily));
        if(typeof renderDaily === 'function') renderDaily();
    }

    // --- 1. SỰ KIỆN MENU CHÍNH ---
    document.getElementById('btnListMain').addEventListener('click', () => {
        if(window.toggleExclusiveMenu) window.toggleExclusiveMenu('listMenu');
        else document.getElementById('listMenu').classList.toggle('open');
    });

    document.querySelectorAll('.btnCloseList').forEach(b => b.addEventListener('click', () => {
        document.querySelectorAll('.theme-modal-overlay').forEach(m => m.style.display = 'none');
    }));

    // --- 2. WISHLIST LOGIC ---
    let wishlist = JSON.parse(localStorage.getItem('qn_wishlist')) || [];
    function renderWishlist() {
        let ul = document.getElementById('wishlistUl'); ul.innerHTML = '';
        wishlist.forEach((item, i) => {
            ul.innerHTML += `<li class="mini-item"><span>${item}</span>
                <div style="display:flex; gap:5px;">
                    <button class="mini-del-btn btn-wish-done" data-idx="${i}" style="background:#4caf50;">✔</button>
                    <button class="mini-del-btn btn-wish-del" data-idx="${i}">🗑</button>
                </div></li>`;
        });
    }
    document.getElementById('btnOpenWishlist').addEventListener('click', () => { document.getElementById('wishlistModal').style.display='flex'; renderWishlist(); });
    document.getElementById('btnAddWishlist').addEventListener('click', () => {
        let v = document.getElementById('wishlistInp').value.trim();
        if(v) { wishlist.push(v); localStorage.setItem('qn_wishlist', JSON.stringify(wishlist)); document.getElementById('wishlistInp').value=''; renderWishlist(); }
    });
    document.getElementById('wishlistUl').addEventListener('click', e => {
        let idx = e.target.dataset.idx;
        if(e.target.classList.contains('btn-wish-done')) { saveToHistory('Wishlist', wishlist[idx], true); wishlist.splice(idx, 1); localStorage.setItem('qn_wishlist', JSON.stringify(wishlist)); renderWishlist(); }
        if(e.target.classList.contains('btn-wish-del')) { saveToHistory('Wishlist', wishlist[idx], false); wishlist.splice(idx, 1); localStorage.setItem('qn_wishlist', JSON.stringify(wishlist)); renderWishlist(); }
    });

    // --- 3. CHECKLIST LOGIC ---
    let checklists = JSON.parse(localStorage.getItem('qn_checklists')) || [];
    function renderChecklist() {
        let c = document.getElementById('checklistContainer'); c.innerHTML = '';
        checklists.forEach(g => {
            let itemsHtml = g.items.map(i => `
                <div class="chk-item-row ${i.done ? 'done' : ''}">
                    <input type="checkbox" class="chk-cb" data-gid="${g.id}" data-iid="${i.id}" ${i.done ? 'checked' : ''} style="accent-color:var(--accent)">
                    <span>${i.text}</span>
                </div>
            `).join('');
            c.innerHTML += `
                <div class="checklist-group">
                    <div class="group-title chk-title" data-gid="${g.id}" title="Double click để đổi tên">📋 ${g.title}</div>
                    <div style="display:flex; gap:5px; margin-bottom:8px;">
                        <input type="text" id="chkInp_${g.id}" placeholder="Thêm đồ cần..." style="flex:1; padding:5px; border-radius:4px; border:1px solid var(--border); outline:none;">
                        <button class="add-chk-item" data-gid="${g.id}" style="padding:5px 10px; background:var(--accent); color:white; border:none; border-radius:4px; cursor:pointer;">Thêm</button>
                    </div>
                    ${itemsHtml}
                </div>`;
        });
    }
    document.getElementById('btnOpenChecklist').addEventListener('click', () => { document.getElementById('checklistModal').style.display='flex'; renderChecklist(); });
    document.getElementById('btnAddChkGroup').addEventListener('click', () => {
        let v = document.getElementById('chkGroupInp').value.trim();
        if(v) { checklists.push({ id: Date.now(), title: v, items: [] }); localStorage.setItem('qn_checklists', JSON.stringify(checklists)); document.getElementById('chkGroupInp').value=''; renderChecklist(); }
    });
    document.getElementById('checklistContainer').addEventListener('click', e => {
        if(e.target.classList.contains('add-chk-item')) {
            let gid = parseInt(e.target.dataset.gid);
            let v = document.getElementById(`chkInp_${gid}`).value.trim();
            if(v) { let g = checklists.find(x => x.id === gid); g.items.push({ id: Date.now(), text: v, done: false }); localStorage.setItem('qn_checklists', JSON.stringify(checklists)); renderChecklist(); }
        }
    });
    document.getElementById('checklistContainer').addEventListener('dblclick', e => {
        if(e.target.classList.contains('chk-title')) {
            let gid = parseInt(e.target.dataset.gid); let g = checklists.find(x => x.id === gid);
            let n = prompt("Đổi tên mục checklist:", g.title);
            if(n) { g.title = n; localStorage.setItem('qn_checklists', JSON.stringify(checklists)); renderChecklist(); }
        }
    });
    document.getElementById('checklistContainer').addEventListener('change', e => {
        if(e.target.classList.contains('chk-cb')) {
            let gid = parseInt(e.target.dataset.gid), iid = parseInt(e.target.dataset.iid);
            let g = checklists.find(x => x.id === gid); let item = g.items.find(x => x.id === iid);
            item.done = !item.done;
            // Tự động xóa nếu tất cả đã hoàn thành
            if(g.items.length > 0 && g.items.every(x => x.done)) {
                setTimeout(() => {
                    alert(`Tuyệt vời! Mục "${g.title}" đã chuẩn bị xong và được xóa!`);
                    checklists = checklists.filter(x => x.id !== gid);
                    localStorage.setItem('qn_checklists', JSON.stringify(checklists)); renderChecklist();
                }, 300);
            } else { localStorage.setItem('qn_checklists', JSON.stringify(checklists)); renderChecklist(); }
        }
    });

    // --- 4. IDEAS LOGIC ---
    let ideas = JSON.parse(localStorage.getItem('qn_ideas_v2')) || [];
    function renderIdeas() {
        let ul = document.getElementById('ideaUl'); ul.innerHTML = '';
        ideas.forEach((item, i) => {
            ul.innerHTML += `<li class="mini-item" style="flex-direction:column; align-items:flex-start; gap:5px;">
                <span style="white-space: pre-wrap; font-size:12px;">${item}</span>
                <button class="mini-del-btn btn-idea-done" data-idx="${i}" style="background:#4caf50; width:100%; border-radius:4px; padding:4px;">✔ Đã hoàn thành (Lưu lịch sử)</button>
            </li>`;
        });
    }
    document.getElementById('btnOpenIdea').addEventListener('click', () => { document.getElementById('ideaModal').style.display='flex'; renderIdeas(); });
    document.getElementById('btnAddIdea').addEventListener('click', () => {
        let v = document.getElementById('ideaInp').value.trim();
        if(v) { ideas.push(v); localStorage.setItem('qn_ideas_v2', JSON.stringify(ideas)); document.getElementById('ideaInp').value=''; renderIdeas(); }
    });
    document.getElementById('ideaUl').addEventListener('click', e => {
        if(e.target.classList.contains('btn-idea-done')) {
            let idx = e.target.dataset.idx;
            saveToHistory('Ý tưởng', ideas[idx], true);
            ideas.splice(idx, 1); localStorage.setItem('qn_ideas_v2', JSON.stringify(ideas)); renderIdeas();
        }
    });

    // --- 5. MISC LOGIC ---
    let misc = JSON.parse(localStorage.getItem('qn_misc')) || { movies: [], hangout: [], food: [] };
    let curCat = 'movies';
    function renderMisc() {
        let ul = document.getElementById('miscUl'); ul.innerHTML = '';
        misc[curCat].forEach((item, i) => {
            ul.innerHTML += `<li class="mini-item"><span>${item}</span><button class="mini-del-btn btn-misc-del" data-idx="${i}">✕</button></li>`;
        });
        document.getElementById('btnRandomMovie').style.display = (curCat === 'movies') ? 'block' : 'none';
    }
    document.getElementById('btnOpenMisc').addEventListener('click', () => { document.getElementById('miscModal').style.display='flex'; renderMisc(); });
    document.getElementById('miscCategory').addEventListener('change', e => { curCat = e.target.value; renderMisc(); });
    document.getElementById('btnAddMisc').addEventListener('click', () => {
        let v = document.getElementById('miscInp').value.trim();
        if(v) { misc[curCat].push(v); localStorage.setItem('qn_misc', JSON.stringify(misc)); document.getElementById('miscInp').value=''; renderMisc(); }
    });
    document.getElementById('miscUl').addEventListener('click', e => {
        if(e.target.classList.contains('btn-misc-del')) {
            let idx = e.target.dataset.idx;
            misc[curCat].splice(idx, 1); localStorage.setItem('qn_misc', JSON.stringify(misc)); renderMisc();
        }
    });
    document.getElementById('btnRandomMovie').addEventListener('click', () => {
        if(misc.movies.length === 0) return alert("Chưa có phim nào trong danh sách babi ơi!");
        let r = misc.movies[Math.floor(Math.random() * misc.movies.length)];
        alert(`🎲 Vũ trụ mách bảo hôm nay Babi hãy xem phim:\n\n🎬 "${r}"`);
    });
});
