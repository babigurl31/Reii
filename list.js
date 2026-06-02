document.addEventListener('DOMContentLoaded', () => {
    // 1. CHÈN GIAO DIỆN NÚT VÀ MODAL VÀO WEB (Cập nhật giao diện nhập liệu)
    const listHTML = `
        <div class="list-wrapper">
            <div class="list-menu" id="listMenu">
                <button class="set-btn" id="btnOpenWishlist" title="Wishlist"><img src="icon-wishlist.png" alt="Wishlist"></button>
                <button class="set-btn" id="btnOpenChecklist" title="Checklist"><img src="icon-checklist.png" alt="Checklist"></button>
                <button class="set-btn" id="btnOpenIdea" title="Ý tưởng"><img src="icon-idea.png" alt="Idea"></button>
                <button class="set-btn" id="btnOpenMisc" title="Thập cẩm"><img src="icon-misc.png" alt="Misc"></button>
                <button class="set-btn" id="btnOpenHistory" title="Lịch sử chung"><img src="icon-history.png" alt="History"></button>
            </div>
            <button class="main-set-btn" id="btnListMain"><img src="icon-list-main.png" alt="List Menu"></button>
        </div>

        <div id="wishlistModal" class="theme-modal-overlay">
            <div class="theme-modal" style="max-height: 80vh; overflow-y: auto;">
                <h3>✨ Wishlist</h3>
                <div class="mini-input-group">
                    <input type="text" id="wishlistInp" placeholder="Cậu muốn mua/làm gì? (Nhấn Enter để lưu)">
                    <button id="btnAddWishlist">Save</button>
                </div>
                <ul class="mini-list" id="wishlistUl"></ul>
            </div>
        </div>

        <div id="checklistModal" class="theme-modal-overlay">
            <div class="theme-modal" style="max-height: 80vh; overflow-y: auto; width: 90%; max-width: 450px;">
                <h3>✅ List mua đồ</h3>
                <div class="mini-input-group">
                    <input type="text" id="chkGroupInp" placeholder="Tạo mục mới (Nhấn Enter)...">
                    <button id="btnAddChkGroup">Tạo</button>
                </div>
                <div id="checklistContainer" style="text-align: left; margin-top: 15px;"></div>
            </div>
        </div>

        <div id="ideaModal" class="theme-modal-overlay">
            <div class="theme-modal" style="max-height: 80vh; overflow-y: auto; width: 90%; max-width: 500px;">
                <h3>💡 Ý tưởng</h3>
                <textarea id="ideaInp" placeholder="Viết thoải mái nhé Babi... (Enter để lưu, Shift+Enter để xuống dòng)" style="width: 100%; min-height: 80px; padding: 10px; border-radius: 8px; border: 1px solid var(--border); outline: none; margin-bottom: 10px; font-family: inherit; resize: vertical;"></textarea>
                <button id="btnAddIdea" style="width: 100%; padding: 10px; background: var(--accent); color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin-bottom: 15px;">Lưu Ý Tưởng</button>
                <ul class="mini-list" id="ideaUl" style="text-align: left;"></ul>
                <div class="modal-btns"><button class="cancel btnCloseList">Đóng</button></div>
            </div>
        </div>

        <div id="miscModal" class="theme-modal-overlay">
            <div class="theme-modal" style="max-height: 80vh; overflow-y: auto;">
                <h3>🍱 Try something new</h3>
                <select id="miscCategory" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border); margin-bottom: 10px; font-weight: bold; color: var(--accent); outline: none;">
                    <option value="movies">🎬 Movie</option>
                    <option value="hangout">⛺ Hangout</option>
                    <option value="food">🍕 F&D</option>
                </select>
                <div class="mini-input-group">
                    <input type="text" id="miscInp" placeholder="Nhập tên/Địa chỉ...">
                    <button id="btnAddMisc">Lưu</button>
                </div>
                <button id="btnRandomMovie" style="width: 100%; padding: 8px; background: #333; color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin-bottom: 10px;">🎲 Chọn ngẫu nhiên phim</button>
                <ul class="mini-list" id="miscUl" style="text-align: left;"></ul>
            </div>
        </div>

        <div id="listHistoryModal" class="theme-modal-overlay">
            <div class="theme-modal" style="max-height: 85vh; overflow-y: auto; width: 90%; max-width: 600px;">
                <h3>🕰️ Lịch Sử Lưu Trữ</h3>
                <div style="text-align: left; margin-bottom: 15px; border-left: 3px solid #ffb6c1; padding-left: 10px; background: #fff0f5; border-radius: 4px; padding: 10px;">
                    <h4 style="color: var(--accent); margin-bottom: 5px;">✨ Wishlist đã xong/xóa</h4>
                    <ul class="mini-list" id="histWishlistUl"></ul>
                </div>
                <div style="text-align: left; margin-bottom: 15px; border-left: 3px solid #64b5f6; padding-left: 10px; background: #e3f2fd; border-radius: 4px; padding: 10px;">
                    <h4 style="color: #1e88e5; margin-bottom: 5px;">✅ Checklist đã hoàn thành</h4>
                    <ul class="mini-list" id="histChecklistUl"></ul>
                </div>
                <div style="text-align: left; margin-bottom: 15px; border-left: 3px solid #ffd54f; padding-left: 10px; background: #fffde7; border-radius: 4px; padding: 10px;">
                    <h4 style="color: #fbc02d; margin-bottom: 5px;">💡 Ý tưởng đã thực hiện</h4>
                    <ul class="mini-list" id="histIdeaUl"></ul>
                </div>
                <div style="text-align: left; margin-bottom: 15px; border-left: 3px solid #81c784; padding-left: 10px; background: #e8f5e9; border-radius: 4px; padding: 10px;">
                    <h4 style="color: #43a047; margin-bottom: 5px;">🍱 Mix đã xóa</h4>
                    <ul class="mini-list" id="histMiscUl"></ul>
                </div>
                <div class="modal-btns">
                    <button id="btnClearHistory" style="background: var(--red);">Xóa sạch Lịch sử</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', listHTML);

    function saveToListHistory(category, text) {
        let historyData = JSON.parse(localStorage.getItem('qn_list_history')) || { wishlist: [], checklist: [], idea: [], misc: [] };
        let dateStr = new Date().toLocaleDateString('vi-VN');
        historyData[category].unshift({ text: text, date: dateStr }); 
        localStorage.setItem('qn_list_history', JSON.stringify(historyData));
    }

    document.getElementById('btnListMain').addEventListener('click', () => {
        if(window.toggleExclusiveMenu) window.toggleExclusiveMenu('listMenu');
        else document.getElementById('listMenu').classList.toggle('open');
    });

    document.querySelectorAll('.btnCloseList').forEach(b => b.addEventListener('click', () => {
        document.querySelectorAll('.theme-modal-overlay').forEach(m => m.style.display = 'none');
    }));

    // --- XỬ LÝ PHÍM ENTER CHO TẤT CẢ CÁC INPUT ---
    document.getElementById('wishlistInp').addEventListener('keypress', e => { if (e.key === 'Enter') document.getElementById('btnAddWishlist').click(); });
    document.getElementById('chkGroupInp').addEventListener('keypress', e => { if (e.key === 'Enter') document.getElementById('btnAddChkGroup').click(); });
    document.getElementById('checklistContainer').addEventListener('keypress', e => { 
        if (e.key === 'Enter' && e.target.id.startsWith('chkInp_')) {
            let gid = e.target.id.split('_')[1];
            document.querySelector(`.add-chk-item[data-gid="${gid}"]`).click();
        }
    });
    document.getElementById('ideaInp').addEventListener('keypress', e => { 
        if (e.key === 'Enter' && !e.shiftKey) { // Ấn Enter để lưu, Shift+Enter để xuống dòng
            e.preventDefault(); 
            document.getElementById('btnAddIdea').click(); 
        } 
    });
    document.getElementById('miscInp').addEventListener('keypress', e => { if (e.key === 'Enter') document.getElementById('btnAddMisc').click(); });

    // --- 2. WISHLIST (SỬ DỤNG CHECKBOX Ô VUÔNG) ---
    let wishlist = JSON.parse(localStorage.getItem('qn_wishlist')) || [];
    function renderWishlist() {
        let ul = document.getElementById('wishlistUl'); ul.innerHTML = '';
        wishlist.forEach((item, i) => {
            ul.innerHTML += `<li class="mini-item" style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
                <div style="display:flex; gap:8px; align-items:flex-start; flex:1;">
                    <input type="checkbox" class="chk-wish-done" data-idx="${i}" style="margin-top:2px; accent-color:var(--accent); width:15px; height:15px; cursor:pointer;">
                    <span>${item}</span>
                </div>
                <button class="mini-del-btn btn-wish-del" data-idx="${i}" style="background:transparent; color:var(--red); border:none; font-weight:bold; cursor:pointer; font-size:14px;">✕</button>
            </li>`;
        });
    }
    document.getElementById('btnOpenWishlist').addEventListener('click', () => { document.getElementById('wishlistModal').style.display='flex'; renderWishlist(); });
    document.getElementById('btnAddWishlist').addEventListener('click', () => {
        let v = document.getElementById('wishlistInp').value.trim();
        if(v) { wishlist.push(v); localStorage.setItem('qn_wishlist', JSON.stringify(wishlist)); document.getElementById('wishlistInp').value=''; renderWishlist(); }
    });
    
    // Bắt sự kiện Tick ô vuông cho Wishlist
    document.getElementById('wishlistUl').addEventListener('change', e => {
        if(e.target.classList.contains('chk-wish-done')) { 
            let idx = e.target.dataset.idx;
            setTimeout(() => { // Delay 0.1s để ngắm dấu tick xong mới xóa
                saveToListHistory('wishlist', `✅ Đã mua/Xong: ${wishlist[idx]}`); 
                wishlist.splice(idx, 1); localStorage.setItem('qn_wishlist', JSON.stringify(wishlist)); renderWishlist(); 
            }, 300);
        }
    });
    // Xóa ngang Wishlist
    document.getElementById('wishlistUl').addEventListener('click', e => {
        if(e.target.classList.contains('btn-wish-del')) { 
            let idx = e.target.dataset.idx;
            saveToListHistory('wishlist', `❌ Hủy bỏ: ${wishlist[idx]}`); 
            wishlist.splice(idx, 1); localStorage.setItem('qn_wishlist', JSON.stringify(wishlist)); renderWishlist(); 
        }
    });

    // --- 3. CHECKLIST ---
    let checklists = JSON.parse(localStorage.getItem('qn_checklists')) || [];
    function renderChecklist() {
        let c = document.getElementById('checklistContainer'); c.innerHTML = '';
        checklists.forEach(g => {
            let itemsHtml = g.items.map(i => `
                <div class="chk-item-row ${i.done ? 'done' : ''}">
                    <input type="checkbox" class="chk-cb" data-gid="${g.id}" data-iid="${i.id}" ${i.done ? 'checked' : ''} style="accent-color:var(--accent); width:15px; height:15px; cursor:pointer;">
                    <span>${i.text}</span>
                </div>
            `).join('');
            c.innerHTML += `
                <div class="checklist-group">
                    <div class="group-title chk-title" data-gid="${g.id}" title="Double click để đổi tên">📋 ${g.title}</div>
                    <div style="display:flex; gap:5px; margin-bottom:8px;">
                        <input type="text" id="chkInp_${g.id}" placeholder="Thêm đồ cần (Nhấn Enter)..." style="flex:1; padding:5px; border-radius:4px; border:1px solid var(--border); outline:none;">
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
            if(g.items.length > 0 && g.items.every(x => x.done)) {
                setTimeout(() => {
                    alert(`Tuyệt vời! Mục "${g.title}" đã chuẩn bị xong và được tự động xóa!`);
                    saveToListHistory('checklist', `Mục: ${g.title} (Đã chuẩn bị xong ${g.items.length} món)`);
                    checklists = checklists.filter(x => x.id !== gid);
                    localStorage.setItem('qn_checklists', JSON.stringify(checklists)); renderChecklist();
                }, 400);
            } else { localStorage.setItem('qn_checklists', JSON.stringify(checklists)); renderChecklist(); }
        }
    });

    // --- 4. IDEAS (SỬ DỤNG CHECKBOX Ô VUÔNG) ---
    let ideas = JSON.parse(localStorage.getItem('qn_ideas_v2')) || [];
    function renderIdeas() {
        let ul = document.getElementById('ideaUl'); ul.innerHTML = '';
        ideas.forEach((item, i) => {
            ul.innerHTML += `<li class="mini-item" style="display:flex; align-items:flex-start; gap:8px;">
                <input type="checkbox" class="chk-idea-done" data-idx="${i}" style="margin-top:2px; accent-color:var(--accent); width:15px; height:15px; cursor:pointer;" title="Đánh dấu hoàn thành">
                <span style="white-space: pre-wrap; font-size:13px; line-height: 1.4; flex:1;">${item}</span>
            </li>`;
        });
    }
    document.getElementById('btnOpenIdea').addEventListener('click', () => { document.getElementById('ideaModal').style.display='flex'; renderIdeas(); });
    document.getElementById('btnAddIdea').addEventListener('click', () => {
        let v = document.getElementById('ideaInp').value.trim();
        if(v) { ideas.push(v); localStorage.setItem('qn_ideas_v2', JSON.stringify(ideas)); document.getElementById('ideaInp').value=''; renderIdeas(); }
    });
    // Bắt sự kiện Tick ô vuông cho Idea
    document.getElementById('ideaUl').addEventListener('change', e => {
        if(e.target.classList.contains('chk-idea-done')) {
            let idx = e.target.dataset.idx;
            setTimeout(() => { // Delay 0.3s
                saveToListHistory('idea', ideas[idx]);
                ideas.splice(idx, 1); localStorage.setItem('qn_ideas_v2', JSON.stringify(ideas)); renderIdeas();
            }, 300);
        }
    });

    // --- 5. MISC (THÊM TÍCH HỢP MAP) ---
    let misc = JSON.parse(localStorage.getItem('qn_misc')) || { movies: [], hangout: [], food: [] };
    let curCat = 'movies';
    function renderMisc() {
        let ul = document.getElementById('miscUl'); ul.innerHTML = '';
        if(misc[curCat]) {
            misc[curCat].forEach((item, i) => {
                // Tạo nút Map nếu là mục đi chơi hoặc ăn uống
                let mapBtn = '';
                if(curCat === 'hangout' || curCat === 'food') {
                    let mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(item)}`;
                    mapBtn = `<a href="${mapUrl}" target="_blank" style="font-size:11px; background:#e3f2fd; color:#1e88e5; text-decoration:none; padding:4px 8px; border-radius:4px; white-space:nowrap; font-weight:bold;">📍 Map</a>`;
                }

                ul.innerHTML += `<li class="mini-item" style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="flex:1;">${item}</span>
                    <div style="display:flex; gap:8px; align-items:center;">
                        ${mapBtn}
                        <button class="mini-del-btn btn-misc-del" data-idx="${i}" style="background:transparent; color:var(--red); border:none; font-weight:bold; cursor:pointer; font-size:14px;">✕</button>
                    </div>
                </li>`;
            });
        }
        document.getElementById('btnRandomMovie').style.display = (curCat === 'movies') ? 'block' : 'none';
    }
    document.getElementById('btnOpenMisc').addEventListener('click', () => { document.getElementById('miscModal').style.display='flex'; renderMisc(); });
    document.getElementById('miscCategory').addEventListener('change', e => { curCat = e.target.value; renderMisc(); });
    document.getElementById('btnAddMisc').addEventListener('click', () => {
        let v = document.getElementById('miscInp').value.trim();
        if(v) { 
            if(!misc[curCat]) misc[curCat] = [];
            misc[curCat].push(v); localStorage.setItem('qn_misc', JSON.stringify(misc)); document.getElementById('miscInp').value=''; renderMisc(); 
        }
    });
    document.getElementById('miscUl').addEventListener('click', e => {
        if(e.target.classList.contains('btn-misc-del')) {
            let idx = e.target.dataset.idx;
            let catName = curCat === 'movies' ? '🎬 Phim' : (curCat === 'hangout' ? '⛺ Đi chơi' : '🍕 Ăn uống');
            saveToListHistory('misc', `[${catName}] Đã xóa: ${misc[curCat][idx]}`);
            misc[curCat].splice(idx, 1); localStorage.setItem('qn_misc', JSON.stringify(misc)); renderMisc();
        }
    });
    document.getElementById('btnRandomMovie').addEventListener('click', () => {
        if(!misc.movies || misc.movies.length === 0) return alert("Chưa có phim nào trong danh sách babi ơi!");
        let r = misc.movies[Math.floor(Math.random() * misc.movies.length)];
        alert(`🎲 Vũ trụ mách bảo hôm nay Babi hãy xem phim:\n\n🎬 "${r}"`);
    });

    // --- 6. LỊCH SỬ CHUNG ---
    function renderHistory() {
        let historyData = JSON.parse(localStorage.getItem('qn_list_history')) || { wishlist: [], checklist: [], idea: [], misc: [] };
        let ulWish = document.getElementById('histWishlistUl'); ulWish.innerHTML = '';
        if(historyData.wishlist) historyData.wishlist.forEach(i => ulWish.innerHTML += `<li class="mini-item"><span style="font-size:11px; color:#999; margin-right:5px;">[${i.date}]</span> <span>${i.text}</span></li>`);
        let ulChk = document.getElementById('histChecklistUl'); ulChk.innerHTML = '';
        if(historyData.checklist) historyData.checklist.forEach(i => ulChk.innerHTML += `<li class="mini-item"><span style="font-size:11px; color:#999; margin-right:5px;">[${i.date}]</span> <span>${i.text}</span></li>`);
        let ulIdea = document.getElementById('histIdeaUl'); ulIdea.innerHTML = '';
        if(historyData.idea) historyData.idea.forEach(i => ulIdea.innerHTML += `<li class="mini-item"><span style="font-size:11px; color:#999; margin-right:5px;">[${i.date}]</span> <span>${i.text}</span></li>`);
        let ulMisc = document.getElementById('histMiscUl'); ulMisc.innerHTML = '';
        if(historyData.misc) historyData.misc.forEach(i => ulMisc.innerHTML += `<li class="mini-item"><span style="font-size:11px; color:#999; margin-right:5px;">[${i.date}]</span> <span>${i.text}</span></li>`);
    }

    document.getElementById('btnOpenHistory').addEventListener('click', () => { 
        document.getElementById('listHistoryModal').style.display='flex'; 
        renderHistory(); 
    });

    document.getElementById('btnClearHistory').addEventListener('click', () => {
        if(confirm("Babi có chắc muốn xóa sạch toàn bộ lịch sử không? Hành động này không thể hoàn tác đâu nhé!")) {
            localStorage.setItem('qn_list_history', JSON.stringify({ wishlist: [], checklist: [], idea: [], misc: [] }));
            renderHistory();
        }
    });
// --- BỘ NHẬN DIỆN CLICK RA NGOÀI (TÁCH BIỆT POPUP VÀ MENU) ---
    document.addEventListener('click', (e) => {
        
        // --- LUỒNG 1: ƯU TIÊN ĐÓNG POP-UP TRƯỚC ---
        // Nếu click trúng cái nền tối (overlay) của Pop-up
        if (e.target.classList.contains('theme-modal-overlay')) {
            e.target.style.display = 'none';
            return; // LÁ CHẮN Ở ĐÂY! Lệnh này giúp dừng toàn bộ hành động lại, tuyệt đối không chạy xuống phần đóng Menu bên dưới nữa.
        }

        // --- LUỒNG 2: CHỈ ĐÓNG MENU KHI KHÔNG CÓ POP-UP CẢN ĐƯỜNG ---
        const listMenu = document.getElementById('listMenu');
        const btnListMain = document.getElementById('btnListMain');
        if (listMenu && listMenu.classList.contains('open') && !listMenu.contains(e.target) && !btnListMain.contains(e.target)) {
            listMenu.classList.remove('open');
        }

        const settingsMenu = document.getElementById('settingsMenu');
        const btnThemeMain = document.getElementById('btnThemeMain');
        if (settingsMenu && settingsMenu.classList.contains('open') && !settingsMenu.contains(e.target) && !btnThemeMain.contains(e.target)) {
            settingsMenu.classList.remove('open');
        }
    });
});