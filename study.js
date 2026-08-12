document.addEventListener('DOMContentLoaded', () => {
    // 1. "Bơm" toàn bộ khung HTML của Nút Study và Cửa sổ Học tập
    const studyHTML = `
        <div class="study-wrapper">
            <button class="main-set-btn" id="btnStudyMain" title="Góc Học Tập">
                <img src="icon-study.png" alt="Study">
            </button>
            <div class="study-menu" id="studyMenu">
                <button class="set-btn" id="btnVocabGrammar" title="Sổ Vocab & Grammar">
                    <img src="icon-vocab.png" alt="Sổ">
                </button>
                <!-- Nơi thêm các nút nhỏ khác sau này -->
            </div>
        </div>

        <div id="studyModalOverlay" class="theme-modal-overlay">
            <div class="theme-modal" style="max-width: 800px; width: 95%; max-height: 85vh; overflow-y: auto; text-align: left;">
                <h3 style="text-align: center; border-bottom: 2px dashed var(--border); padding-bottom: 10px;">Sổ Vocab & Grammar 📖</h3>
                
                <!-- NỬA TRÊN: TỪ VỰNG -->
                <div style="margin-bottom: 20px;">
                    <h4 style="color: var(--accent); margin-bottom: 10px;">📝 Từ Vựng</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                        <input type="text" id="vocabLang1" placeholder="Từ NN 1 (VD: Anh)" class="study-input">
                        <input type="text" id="vocabMeaning" placeholder="Nghĩa tiếng Việt" class="study-input">
                        <input type="text" id="vocabLang2" placeholder="Từ NN 2 (VD: Nhật)" class="study-input">
                    </div>
                    <button id="btnAddVocab" class="btn-add-main" style="width: 100%; margin-bottom: 15px;">Lưu Từ Vựng</button>
                    <div id="vocabList" style="max-height: 150px; overflow-y: auto; font-size: 13px; background: rgba(255,255,255,0.5); padding: 10px; border-radius: 8px;"></div>
                </div>

                <!-- NỬA DƯỚI: NGỮ PHÁP -->
                <div style="border-top: 1px solid var(--border); padding-top: 20px;">
                    <h4 style="color: var(--accent); margin-bottom: 10px;">✍️ Ngữ Pháp</h4>
                    <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                        <input type="text" id="grammarLang" placeholder="Ngôn ngữ (VD: Nhật)" class="study-input" style="width: 30%;">
                        <input type="text" id="grammarFormula" placeholder="Công thức (VD: N + は + ...)" class="study-input" style="flex: 1;">
                    </div>
                    <textarea id="grammarNote" placeholder="Ghi chú thuần Việt..." class="study-input" style="width: 100%; height: 60px; resize: none; margin-bottom: 10px;"></textarea>
                    <button id="btnAddGrammar" class="btn-add-main" style="width: 100%; margin-bottom: 15px;">Lưu Ngữ Pháp</button>
                    <div id="grammarList" style="max-height: 150px; overflow-y: auto; font-size: 13px; background: rgba(255,255,255,0.5); padding: 10px; border-radius: 8px;"></div>
                </div>

                <div class="modal-btns" style="margin-top: 20px;">
                    <button class="cancel btnCloseStudyModal" style="width: 100%;">Đóng Cửa Sổ</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', studyHTML);

    // 2. LOGIC ĐÓNG MỞ NÚT VÀ CỬA SỔ
    const btnStudyMain = document.getElementById('btnStudyMain');
    const btnVocabGrammar = document.getElementById('btnVocabGrammar');
    const studyModalOverlay = document.getElementById('studyModalOverlay');

    if (btnStudyMain) {
        btnStudyMain.addEventListener('click', () => {
            if (window.toggleExclusiveMenu) window.toggleExclusiveMenu('studyMenu');
        });
    }

    if (btnVocabGrammar) {
        btnVocabGrammar.addEventListener('click', () => {
            studyModalOverlay.style.display = 'flex';
            renderVocab();
            renderGrammar();
        });
    }

    document.querySelectorAll('.btnCloseStudyModal').forEach(btn => {
        btn.addEventListener('click', () => studyModalOverlay.style.display = 'none');
    });

    // 3. LOGIC LƯU TRỮ VÀ CẢNH BÁO TRÙNG LẶP
    let vocabData = JSON.parse(localStorage.getItem('qn_vocab')) || [];
    let grammarData = JSON.parse(localStorage.getItem('qn_grammar')) || [];

    function renderVocab() {
        const list = document.getElementById('vocabList');
        if(vocabData.length === 0) {
            list.innerHTML = '<span style="color:#888; font-style:italic;">Chưa có từ vựng nào~</span>';
            return;
        }
        // Dùng data-idx thay vì onclick để extension không báo lỗi
        list.innerHTML = vocabData.map((v, i) => `
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 10px; border-bottom: 1px dashed var(--border); padding: 5px 0;">
                <span style="font-weight:bold; color: var(--accent);">${v.l1}</span>
                <span>${v.vi}</span>
                <span style="font-weight:bold;">${v.l2}</span>
                <button class="btn-del-vocab" data-idx="${i}" style="background:none; border:none; color:red; cursor:pointer;" title="Xóa">✕</button>
            </div>
        `).join('');
    }

    function renderGrammar() {
        const list = document.getElementById('grammarList');
        if(grammarData.length === 0) {
            list.innerHTML = '<span style="color:#888; font-style:italic;">Chưa có ngữ pháp nào~</span>';
            return;
        }
        list.innerHTML = grammarData.map((g, i) => `
            <div style="border-bottom: 1px dashed var(--border); padding: 8px 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span style="font-weight:bold; color: var(--accent);">[${g.lang}] ${g.formula}</span>
                    <button class="btn-del-grammar" data-idx="${i}" style="background:none; border:none; color:red; cursor:pointer;" title="Xóa">✕</button>
                </div>
                <div style="color: #555;">💡 ${g.note}</div>
            </div>
        `).join('');
    }

    document.getElementById('btnAddVocab').addEventListener('click', () => {
        let l1 = document.getElementById('vocabLang1').value.trim();
        let vi = document.getElementById('vocabMeaning').value.trim();
        let l2 = document.getElementById('vocabLang2').value.trim();
        
        if (!vi) return alert('Vui lòng nhập ít nhất nghĩa tiếng Việt!');

        let isDuplicate = vocabData.some(item => item.vi.toLowerCase() === vi.toLowerCase());
        if (isDuplicate) {
            let confirmSave = confirm(`⚠️ Cảnh báo: Nghĩa tiếng Việt "${vi}" đã tồn tại trong sổ!\n\nNếu đây là từ đồng nghĩa, từ có nhiều nghĩa hoặc khác từ loại, hãy nhấn "OK" để tiếp tục lưu.\nNếu nhập trùng, hãy nhấn "Hủy".`);
            if (!confirmSave) return;
        }

        vocabData.unshift({ l1, vi, l2 });
        localStorage.setItem('qn_vocab', JSON.stringify(vocabData));
        
        document.getElementById('vocabLang1').value = '';
        document.getElementById('vocabMeaning').value = '';
        document.getElementById('vocabLang2').value = '';
        renderVocab();
    });

    document.getElementById('btnAddGrammar').addEventListener('click', () => {
        let lang = document.getElementById('grammarLang').value.trim();
        let formula = document.getElementById('grammarFormula').value.trim();
        let note = document.getElementById('grammarNote').value.trim();

        if (!formula || !note) return alert('Vui lòng nhập công thức và ghi chú!');

        grammarData.unshift({ lang, formula, note });
        localStorage.setItem('qn_grammar', JSON.stringify(grammarData));

        document.getElementById('grammarLang').value = '';
        document.getElementById('grammarFormula').value = '';
        document.getElementById('grammarNote').value = '';
        renderGrammar();
    });

    // Bắt sự kiện xóa bằng Radar (Chuẩn Extension)
    document.getElementById('vocabList').addEventListener('click', (e) => {
        if(e.target.classList.contains('btn-del-vocab')) {
            let idx = parseInt(e.target.dataset.idx);
            if(confirm('Xóa từ vựng này?')) { 
                vocabData.splice(idx, 1); 
                localStorage.setItem('qn_vocab', JSON.stringify(vocabData)); 
                renderVocab(); 
            }
        }
    });

    document.getElementById('grammarList').addEventListener('click', (e) => {
        if(e.target.classList.contains('btn-del-grammar')) {
            let idx = parseInt(e.target.dataset.idx);
            if(confirm('Xóa ngữ pháp này?')) { 
                grammarData.splice(idx, 1); 
                localStorage.setItem('qn_grammar', JSON.stringify(grammarData)); 
                renderGrammar(); 
            }
        }
    });
});