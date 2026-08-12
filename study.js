document.addEventListener('DOMContentLoaded', () => {
    const studyHTML = `
        <div class="study-wrapper">
            <button class="main-set-btn" id="btnStudyMain" title="Study Corner">
                <img src="icon-study.png" alt="Study">
            </button>
            <div class="study-menu" id="studyMenu">
                <button class="set-btn" id="btnVocabGrammar" title="Vocab & Grammar Notebook">
                    <img src="icon-vocab.png" alt="Notebook">
                </button>
            </div>
        </div>

        <div id="studyModalOverlay" class="theme-modal-overlay">
            <div class="theme-modal" style="max-width: 800px; width: 95%; max-height: 85vh; overflow-y: auto; text-align: left;">
                <h3 style="text-align: center; border-bottom: 2px dashed var(--border); padding-bottom: 10px;">Vocab & Grammar Notebook 📖</h3>
                
                <div style="margin-bottom: 20px;">
                    <h4 style="color: var(--accent); margin-bottom: 10px;">📝 Vocabulary</h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                        <input type="text" id="vocabLang1" placeholder="Lang 1 (e.g., English)" class="study-input">
                        <input type="text" id="vocabMeaning" placeholder="Meaning (Native)" class="study-input">
                        <input type="text" id="vocabLang2" placeholder="Lang 2 (e.g., Japanese)" class="study-input">
                    </div>
                    <button id="btnAddVocab" class="btn-add-main" style="width: 100%; margin-bottom: 15px;">Save Vocab</button>
                    <div id="vocabList" style="max-height: 150px; overflow-y: auto; font-size: 13px; background: rgba(255,255,255,0.5); padding: 10px; border-radius: 8px;"></div>
                </div>

                <div style="border-top: 1px solid var(--border); padding-top: 20px;">
                    <h4 style="color: var(--accent); margin-bottom: 10px;">✍️ Grammar</h4>
                    <div style="display: flex; gap: 10px; margin-bottom: 10px;">
                        <input type="text" id="grammarLang" placeholder="Language (e.g., Japanese)" class="study-input" style="width: 30%;">
                        <input type="text" id="grammarFormula" placeholder="Formula (e.g., N + は + ...)" class="study-input" style="flex: 1;">
                    </div>
                    <textarea id="grammarNote" placeholder="Notes..." class="study-input" style="width: 100%; height: 60px; resize: none; margin-bottom: 10px;"></textarea>
                    <button id="btnAddGrammar" class="btn-add-main" style="width: 100%; margin-bottom: 15px;">Save Grammar</button>
                    <div id="grammarList" style="max-height: 150px; overflow-y: auto; font-size: 13px; background: rgba(255,255,255,0.5); padding: 10px; border-radius: 8px;"></div>
                </div>

                <div class="modal-btns" style="margin-top: 20px;">
                    <button class="cancel btnCloseStudyModal" style="width: 100%;">Close</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', studyHTML);

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

    let vocabData = JSON.parse(localStorage.getItem('qn_vocab')) || [];
    let grammarData = JSON.parse(localStorage.getItem('qn_grammar')) || [];

    function renderVocab() {
        const list = document.getElementById('vocabList');
        if(vocabData.length === 0) {
            list.innerHTML = '<span style="color:#888; font-style:italic;">No vocabulary yet~</span>';
            return;
        }
        list.innerHTML = vocabData.map((v, i) => `
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 10px; border-bottom: 1px dashed var(--border); padding: 5px 0;">
                <span style="font-weight:bold; color: var(--accent);">${v.l1}</span>
                <span>${v.vi}</span>
                <span style="font-weight:bold;">${v.l2}</span>
                <button class="btn-del-vocab" data-idx="${i}" style="background:none; border:none; color:red; cursor:pointer;" title="Delete">✕</button>
            </div>
        `).join('');
    }

    function renderGrammar() {
        const list = document.getElementById('grammarList');
        if(grammarData.length === 0) {
            list.innerHTML = '<span style="color:#888; font-style:italic;">No grammar yet~</span>';
            return;
        }
        list.innerHTML = grammarData.map((g, i) => `
            <div style="border-bottom: 1px dashed var(--border); padding: 8px 0;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                    <span style="font-weight:bold; color: var(--accent);">[${g.lang}] ${g.formula}</span>
                    <button class="btn-del-grammar" data-idx="${i}" style="background:none; border:none; color:red; cursor:pointer;" title="Delete">✕</button>
                </div>
                <div style="color: #555;">💡 ${g.note}</div>
            </div>
        `).join('');
    }

    document.getElementById('btnAddVocab').addEventListener('click', () => {
        let l1 = document.getElementById('vocabLang1').value.trim();
        let vi = document.getElementById('vocabMeaning').value.trim();
        let l2 = document.getElementById('vocabLang2').value.trim();
        
        if (!vi) return alert('Please enter the meaning!');

        let isDuplicate = vocabData.some(item => item.vi.toLowerCase() === vi.toLowerCase());
        if (isDuplicate) {
            let confirmSave = confirm(`⚠️ Warning: The meaning "${vi}" already exists!\n\nIf it's a synonym or different part of speech, click 'OK' to save.\nIf it's a duplicate, click 'Cancel'.`);
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

        if (!formula || !note) return alert('Please enter formula and notes!');

        grammarData.unshift({ lang, formula, note });
        localStorage.setItem('qn_grammar', JSON.stringify(grammarData));

        document.getElementById('grammarLang').value = '';
        document.getElementById('grammarFormula').value = '';
        document.getElementById('grammarNote').value = '';
        renderGrammar();
    });

    document.getElementById('vocabList').addEventListener('click', (e) => {
        if(e.target.classList.contains('btn-del-vocab')) {
            let idx = parseInt(e.target.dataset.idx);
            if(confirm('Delete this vocab?')) { 
                vocabData.splice(idx, 1); 
                localStorage.setItem('qn_vocab', JSON.stringify(vocabData)); 
                renderVocab(); 
            }
        }
    });

    document.getElementById('grammarList').addEventListener('click', (e) => {
        if(e.target.classList.contains('btn-del-grammar')) {
            let idx = parseInt(e.target.dataset.idx);
            if(confirm('Delete this grammar?')) { 
                grammarData.splice(idx, 1); 
                localStorage.setItem('qn_grammar', JSON.stringify(grammarData)); 
                renderGrammar(); 
            }
        }
    });
});
