document.addEventListener('DOMContentLoaded', () => {
    // 1. CHÈN GIAO DIỆN NÚT VÀ MODAL VÀO WEB (THÊM NÚT LỊCH SỬ)
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

        <!-- MODAL WISHLIST -->
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

        <!-- MODAL CHECKLIST -->
        <div id="checklistModal" class="theme-modal-overlay">
            <div class="theme-modal" style="max-height: 80vh; overflow-y: auto; width: 90%; max-width: 450px;">
                <h3>✅ Danh sách chuẩn bị</h3>
                <div class="mini-input-group">
                    <input type="text" id="chkGroupInp" placeholder="Tạo mục mới (VD: Quà SN)...">
                    <button id="btnAddChkGroup">Tạo</button>
                </div>
                <div id="checklistContainer" style="text-align: left; margin-top: 15px;"></div>
                <div class="modal-btns"><button class="cancel btnCloseList">Đóng</button></div>
            </div>
        </div>

        <!-- MODAL IDEAS -->
        <div id="ideaModal" class="theme-modal-overlay">
            <div class="theme-modal" style="max-height: 80vh; overflow-y: auto; width: 90%; max-width: 500px;">
                <h3>💡 Ý tưởng lóe lên</h3>
                <textarea id="ideaInp" placeholder="Viết dài thoải mái nhé Babi..." style="width: 100%; min-height: 80px; padding: 10px; border-radius: 8px; border: 1px solid var(--border); outline: none; margin-bottom: 10px; font-family: inherit;"></textarea>
                <button id="btnAddIdea" style="width: 100%; padding: 10px; background: var(--accent); color: white; border: none; border-radius: 8px; font-weight: bold; cursor: pointer; margin-bottom: 15px;">Lưu Ý Tưởng</button>
                <ul class="mini-list" id="ideaUl" style="text-align: left;"></ul>
                <div class="modal-btns"><button class="cancel btnCloseList">Đóng</button></div>
            </div>
        </div>

        <!-- MODAL MISC (THẬP CẨM) -->
        <div id="miscModal" class="theme-modal-overlay">
            <div class="theme-modal" style="max-height: 80vh; overflow-y: auto;">
                <h3>🍱 Góc Thập Cẩm</h3>
                <select id="miscCategory" style="width: 100%; padding: 10px; border-radius: 8px; border: 1px solid var(--border); margin-bottom: 10px; font-weight: bold; color: var(--accent); outline: none;">
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

        <!-- MODAL LỊCH SỬ CHUNG -->
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
                    <h4 style="color: #43a047; margin-bottom: 5px;">🍱 Thập cẩm đã xóa</h4>
                    <ul class="mini-list" id="histMiscUl"></ul>
                </div>

                <div class="modal-btns">
                    <button class="cancel btnCloseList">Đóng</button>
                    <button id="btnClearHistory" style="background: var(--red);">Xóa sạch Lịch sử</button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', listHTML);

    // --- HÀM LƯU LỊCH SỬ CHUYÊN BIỆT ---
    function saveToListHistory(category, text) {
        let historyData = JSON.parse(localStorage.getItem('qn_list_history')) || { wishlist: [], checklist: [], idea: [], misc: [] };
        let dateStr = new Date().toLocaleDateString('vi-VN');
        historyData[category].unshift({ text: text, date: dateStr }); // unshift để đẩy lên đầu
        localStorage.setItem('qn_list_history', JSON.stringify(historyData));
    }

    // --- 1. SỰ KIỆN MENU CHÍNH ---
    document.getElementById('btnListMain').addEventListener('click', () => {
        if(window.toggleExclusiveMenu) window.toggleExclusiveMenu('listMenu');
        else document.getElementById('listMenu').classList.toggle('open');
    });

    document.querySelectorAll('.btnCloseList').forEach(b => b.addEventListener('click', () => {
        document.querySelectorAll('.theme-modal-overlay').forEach(m => m.style.display = 'none');
    }));

    // --- 2. WISHLIST ---
    let wishlist = JSON.parse(localStorage.getItem('qn_wishlist')) || [];
    function renderWishlist() {
        let ul = document.getElementById('wishlistUl'); ul.innerHTML = '';
        wishlist.forEach((item, i) => {
            ul.innerHTML += `<li class="mini-item"><span>${item}</span>
                <div style="display:flex; gap:5px;">
                    <button class="mini-del-btn btn-wish-done" data-idx="${i}" style="background:#4caf50; color:white; border-radius:4px; padding:2px 6px;">✔</button>
                    <button class="mini-del-btn btn-wish-del" data-idx="${i}" style="background:var(--red); color:white; border-radius:4px; padding:2px 6px;">🗑</button>
                </div></li>`;
        });
    }
    document.getElementById('btnOpenWishlist').addEventListener('click', () => { document.getElementById('wishlistModal').style.display='flex'; renderWishlist(); document.getElementById('listMenu').classList.remove('open'); });
    document.getElementById('btnAddWishlist').addEventListener('click', () => {
        let v = document.getElementById('wishlistInp').value.trim();
        if(v) { wishlist.push(v); localStorage.setItem('qn_wishlist', JSON.stringify(wishlist)); document.getElementById('wishlistInp').value=''; renderWishlist(); }
    });
    document.getElementById('wishlistUl').addEventListener('click', e => {
        let idx = e.target.dataset.idx;
        if(e.target.classList.contains('btn-wish-done')) { 
            saveToListHistory('wishlist', `✅ Đã mua/Xong: ${wishlist[idx]}`); 
            wishlist.splice(idx, 1); localStorage.setItem('qn_wishlist', JSON.stringify(wishlist)); renderWishlist(); 
        }
        if(e.target.classList.contains('btn-wish-del')) { 
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
    document.getElementById('btnOpenChecklist').addEventListener('click', () => { document.getElementById('checklistModal').style.display='flex'; renderChecklist(); document.getElementById('listMenu').classList.remove('open'); });
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
                    saveToListHistory('checklist', `Mục: ${g.title} (Đã hoàn thành ${g.items.length} món)`);
                    checklists = checklists.filter(x => x.id !== gid);
                    localStorage.setItem('qn_checklists', JSON.stringify(checklists)); renderChecklist();
                }, 300);
            } else { localStorage.setItem('qn_checklists', JSON.stringify(checklists)); renderChecklist(); }
        }
    });

    // --- 4. IDEAS ---
    let ideas = JSON.parse(localStorage.getItem('qn_ideas_v2')) || [];
    function renderIdeas() {
        let ul = document.getElementById('ideaUl'); ul.innerHTML = '';
        ideas.forEach((item, i) => {
            ul.innerHTML += `<li class="mini-item" style="flex-direction:column; align-items:flex-start; gap:5px;">
                <span style="white-space: pre-wrap; font-size:13px; line-height: 1.4;">${item}</span>
                <button class="mini-del-btn btn-idea-done" data-idx="${i}" style="background:#4caf50; color:white; width:100%; border-radius:4px; padding:6px; margin-top:5px; font-weight:bold;">✔ Đã hoàn thành (Lưu lịch sử)</button>
            </li>`;
        });
    }
    document.getElementById('btnOpenIdea').addEventListener('click', () => { document.getElementById('ideaModal').style.display='flex'; renderIdeas(); document.getElementById('listMenu').classList.remove('open'); });
    document.getElementById('btnAddIdea').addEventListener('click', () => {
        let v = document.getElementById('ideaInp').value.trim();
        if(v) { ideas.push(v); localStorage.setItem('qn_ideas_v2', JSON.stringify(ideas)); document.getElementById('ideaInp').value=''; renderIdeas(); }
    });
    document.getElementById('ideaUl').addEventListener('click', e => {
        if(e.target.classList.contains('btn-idea-done')) {
            let idx = e.target.dataset.idx;
            saveToListHistory('idea', ideas[idx]);
            ideas.splice(idx, 1); localStorage.setItem('qn_ideas_v2', JSON.stringify(ideas)); renderIdeas();
        }
    });

    // --- 5. MISC ---
    let misc = JSON.parse(localStorage.getItem('qn_misc')) || { movies: [], hangout: [], food: [] };
    let curCat = 'movies';
    function renderMisc() {
        let ul = document.getElementById('miscUl'); ul.innerHTML = '';
        misc[curCat].forEach((item, i) => {
            ul.innerHTML += `<li class="mini-item"><span>${item}</span><button class="mini-del-btn btn-misc-del" data-idx="${i}">✕</button></li>`;
        });
        document.getElementById('btnRandomMovie').style.display = (curCat === 'movies') ? 'block' : 'none';
    }
    document.getElementById('btnOpenMisc').addEventListener('click', () => { document.getElementById('miscModal').style.display='flex'; renderMisc(); document.getElementById('listMenu').classList.remove('open'); });
    document.getElementById('miscCategory').addEventListener('change', e => { curCat = e.target.value; renderMisc(); });
    document.getElementById('btnAddMisc').addEventListener('click', () => {
        let v = document.getElementById('miscInp').value.trim();
        if(v) { misc[curCat].push(v); localStorage.setItem('qn_misc', JSON.stringify(misc)); document.getElementById('miscInp').value=''; renderMisc(); }
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
        if(misc.movies.length === 0) return alert("Chưa có phim nào trong danh sách babi ơi!");
        let r = misc.movies[Math.floor(Math.random() * misc.movies.length)];
        alert(`🎲 Vũ trụ mách bảo hôm nay Babi hãy xem phim:\n\n🎬 "${r}"`);
    });

    // --- 6. LỊCH SỬ CHUNG ---
    function renderHistory() {
        let historyData = JSON.parse(localStorage.getItem('qn_list_history')) || { wishlist: [], checklist: [], idea: [], misc: [] };
        
        let ulWish = document.getElementById('histWishlistUl'); ulWish.innerHTML = '';
        historyData.wishlist.forEach(i => ulWish.innerHTML += `<li class="mini-item"><span style="font-size:11px; color:#999; margin-right:5px;">[${i.date}]</span> <span>${i.text}</span></li>`);
        
        let ulChk = document.getElementById('histChecklistUl'); ulChk.innerHTML = '';
        historyData.checklist.forEach(i => ulChk.innerHTML += `<li class="mini-item"><span style="font-size:11px; color:#999; margin-right:5px;">[${i.date}]</span> <span>${i.text}</span></li>`);
        
        let ulIdea = document.getElementById('histIdeaUl'); ulIdea.innerHTML = '';
        historyData.idea.forEach(i => ulIdea.innerHTML += `<li class="mini-item"><span style="font-size:11px; color:#999; margin-right:5px;">[${i.date}]</span> <span>${i.text}</span></li>`);
        
        let ulMisc = document.getElementById('histMiscUl'); ulMisc.innerHTML = '';
        historyData.misc.forEach(i => ulMisc.innerHTML += `<li class="mini-item"><span style="font-size:11px; color:#999; margin-right:5px;">[${i.date}]</span> <span>${i.text}</span></li>`);
    }

    document.getElementById('btnOpenHistory').addEventListener('click', () => { 
        document.getElementById('listHistoryModal').style.display='flex'; 
        renderHistory(); 
        document.getElementById('listMenu').classList.remove('open'); 
    });

    document.getElementById('btnClearHistory').addEventListener('click', () => {
        if(confirm("Babi có chắc muốn xóa sạch toàn bộ lịch sử không? Hành động này không thể hoàn tác đâu nhé!")) {
            localStorage.setItem('qn_list_history', JSON.stringify({ wishlist: [], checklist: [], idea: [], misc: [] }));
            renderHistory();
        }
    });
});
