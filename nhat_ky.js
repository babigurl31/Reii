document.addEventListener('DOMContentLoaded', () => {
    const diaryHTML = `
        <div id="secretDiaryModal" class="diary-overlay">
            <div class="diary-box">
                <svg class="doodle doodle-1" width="55" height="55" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="55" r="30" fill="none" stroke="#f48fb1" stroke-width="4"/><path d="M25,35 L15,10 L45,28 M75,35 L85,10 L55,28" fill="none" stroke="#f48fb1" stroke-width="4" stroke-linejoin="round"/><path d="M35,45 Q40,40 45,45 M55,45 Q60,40 65,45 M50,55 L45,60 M50,55 L55,60" fill="none" stroke="#f48fb1" stroke-width="3" stroke-linecap="round"/><path d="M20,50 L5,45 M20,60 L5,65 M80,50 L95,45 M80,60 L95,65" fill="none" stroke="#f48fb1" stroke-width="3" stroke-linecap="round"/></svg>
                <svg class="doodle doodle-2" width="45" height="45" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50,85 Q10,50 20,20 Q35,5 50,30 Q65,5 80,20 Q90,50 50,85 Z" fill="none" stroke="#ec407a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                <svg class="doodle doodle-3" width="45" height="45" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50,10 L60,40 L90,50 L60,60 L50,90 L40,60 L10,50 L40,40 Z" fill="none" stroke="#ffb6c1" stroke-width="5" stroke-linejoin="round"/></svg>
                <svg class="doodle doodle-4" width="55" height="55" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="8" fill="none" stroke="#f06292" stroke-width="4"/><path d="M42,50 L10,25 L10,75 Z M58,50 L90,25 L90,75 Z" fill="none" stroke="#f06292" stroke-width="4" stroke-linejoin="round"/><path d="M42,58 Q30,80 20,95 M58,58 Q70,80 80,95" fill="none" stroke="#f06292" stroke-width="4" stroke-linecap="round"/></svg>

                <div class="diary-header" style="flex-direction: column; align-items: stretch;">
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                        <h2 style="margin: 0;">💌 Góc Của Rei</h2>
                        <button id="closeDiaryBtn" class="close-diary-btn" style="position: static;">✕</button>
                    </div>
                    
                    <div style="display: flex; justify-content: center; align-items: center; gap: 15px; background: #fff0f5; padding: 8px; border-radius: 20px; border: 1px dashed #f8bbd0;">
                        <button id="prevDiaryBtn" style="background: none; border: none; font-size: 16px; color: #ec407a; cursor: pointer; font-weight: bold; padding: 0 10px;">◀ Trước</button>
                        <span id="diaryDateDisplay" style="font-weight: bold; color: #ec407a; min-width: 140px; text-align: center;">Hôm nay</span>
                        <button id="nextDiaryBtn" style="background: none; border: none; font-size: 16px; color: #ec407a; cursor: pointer; font-weight: bold; padding: 0 10px;">Sau ▶</button>
                    </div>
                </div>
                
                <div class="diary-toolbar">
                    <button id="btnFormatBold" title="In đậm"><b>B</b></button>
                    <button id="btnFormatItalic" title="In nghiêng"><i>I</i></button>
                    <button id="btnFormatUnderline" title="Gạch chân"><u>U</u></button>
                    <button id="btnFormatList" title="Tạo danh sách">• List</button>
                    
                    <select id="diaryMood" class="mood-selector">
                        <option value="">Tâm trạng...</option>
                        <option value="happy">🥰 Rất vui</option>
                        <option value="tired">🥱 Hơi mệt</option>
                        <option value="chill">🎧 Chill</option>
                        <option value="love">💖 Đang yêu</option>
                        <option value="sad">😢 Hơi buồn</option>
                    </select>
                </div>

                <div id="diaryContent" class="diary-editor" contenteditable="true" placeholder="Trút hết bầu tâm sự vào đây nhé..."></div>
                
                <button id="saveDiaryBtn" class="diary-save-btn">Khóa nhật ký 🔐</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', diaryHTML);

    // BẮT SỰ KIỆN CHO NÚT ĐỊNH DẠNG CHỮ
    document.getElementById('btnFormatBold').addEventListener('click', () => document.execCommand('bold', false, null));
    document.getElementById('btnFormatItalic').addEventListener('click', () => document.execCommand('italic', false, null));
    document.getElementById('btnFormatUnderline').addEventListener('click', () => document.execCommand('underline', false, null));
    document.getElementById('btnFormatList').addEventListener('click', () => document.execCommand('insertUnorderedList', false, null));

    const trigger = document.getElementById('secretTrigger');
    const modal = document.getElementById('secretDiaryModal');
    const editor = document.getElementById('diaryContent');
    const moodSelect = document.getElementById('diaryMood');
    const dateDisplay = document.getElementById('diaryDateDisplay');

    let diaryPages = JSON.parse(localStorage.getItem('qn_diary_pages')) || {};
    
    function getDateKey(date) {
        return date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0');
    }
    
    let todayKey = getDateKey(new Date());

    let oldSingleData = localStorage.getItem('qn_secret_diary');
    if (oldSingleData && !diaryPages[todayKey]) {
        diaryPages[todayKey] = { text: oldSingleData, mood: localStorage.getItem('qn_secret_mood') || '' };
        localStorage.removeItem('qn_secret_diary');
        localStorage.setItem('qn_diary_pages', JSON.stringify(diaryPages));
    }

    let viewDateObj = new Date(); 

    function updateDiaryView() {
        let key = getDateKey(viewDateObj);
        let data = diaryPages[key] || { text: '', mood: '' };
        editor.innerHTML = data.text;
        moodSelect.value = data.mood || '';
        let displayStr = viewDateObj.toLocaleDateString('vi-VN');
        if (key === todayKey) {
            dateDisplay.innerText = `Hôm nay (${displayStr})`;
        } else {
            dateDisplay.innerText = displayStr;
        }
    }

    function saveCurrentPage() {
        let key = getDateKey(viewDateObj);
        if (!diaryPages[key]) diaryPages[key] = {};
        diaryPages[key].text = editor.innerHTML;
        diaryPages[key].mood = moodSelect.value;
        localStorage.setItem('qn_diary_pages', JSON.stringify(diaryPages));
    }

    if(trigger) {
        trigger.addEventListener('dblclick', () => {
            let pass = prompt("Nhập mật khẩu mở cửa trái tim:");
            if(pass === "EmYeuBinhLam") {
                viewDateObj = new Date(); 
                updateDiaryView();
                modal.style.display = 'flex';
            } else if (pass !== null) {
                alert("Sai gòi! Người lạ không được vào đâu nha 😛");
            }
        });
    }

    document.getElementById('closeDiaryBtn').addEventListener('click', () => { saveCurrentPage(); modal.style.display = 'none'; });
    document.getElementById('saveDiaryBtn').addEventListener('click', () => { saveCurrentPage(); alert('Đã giấu kín những dòng tâm sự này rồi nhé! ✨'); modal.style.display = 'none'; });

    document.getElementById('prevDiaryBtn').addEventListener('click', () => { saveCurrentPage(); viewDateObj.setDate(viewDateObj.getDate() - 1); updateDiaryView(); });
    document.getElementById('nextDiaryBtn').addEventListener('click', () => { saveCurrentPage(); viewDateObj.setDate(viewDateObj.getDate() + 1); updateDiaryView(); });
    
    moodSelect.addEventListener('change', saveCurrentPage);

    let timeout = null;
    editor.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => { saveCurrentPage(); }, 2000);
    });
});