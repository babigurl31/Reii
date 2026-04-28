document.addEventListener('DOMContentLoaded', () => {
    // 1. Tự động chèn HTML của Nhật ký (bao gồm các hình vẽ SVG doodle) vào trang
    const diaryHTML = `
        <div id="secretDiaryModal" class="diary-overlay">
            <div class="diary-box">
                <svg class="doodle doodle-1" width="55" height="55" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="55" r="30" fill="none" stroke="#f48fb1" stroke-width="4"/>
                    <path d="M25,35 L15,10 L45,28 M75,35 L85,10 L55,28" fill="none" stroke="#f48fb1" stroke-width="4" stroke-linejoin="round"/>
                    <path d="M35,45 Q40,40 45,45 M55,45 Q60,40 65,45 M50,55 L45,60 M50,55 L55,60" fill="none" stroke="#f48fb1" stroke-width="3" stroke-linecap="round"/>
                    <path d="M20,50 L5,45 M20,60 L5,65 M80,50 L95,45 M80,60 L95,65" fill="none" stroke="#f48fb1" stroke-width="3" stroke-linecap="round"/>
                </svg>

                <svg class="doodle doodle-2" width="45" height="45" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50,85 Q10,50 20,20 Q35,5 50,30 Q65,5 80,20 Q90,50 50,85 Z" fill="none" stroke="#ec407a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>

                <svg class="doodle doodle-3" width="45" height="45" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <path d="M50,10 L60,40 L90,50 L60,60 L50,90 L40,60 L10,50 L40,40 Z" fill="none" stroke="#ffb6c1" stroke-width="5" stroke-linejoin="round"/>
                </svg>

                <svg class="doodle doodle-4" width="55" height="55" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="8" fill="none" stroke="#f06292" stroke-width="4"/>
                    <path d="M42,50 L10,25 L10,75 Z M58,50 L90,25 L90,75 Z" fill="none" stroke="#f06292" stroke-width="4" stroke-linejoin="round"/>
                    <path d="M42,58 Q30,80 20,95 M58,58 Q70,80 80,95" fill="none" stroke="#f06292" stroke-width="4" stroke-linecap="round"/>
                </svg>

                <div class="diary-header">
                    <h2>💌 Góc Của Rei</h2>
                    <button id="closeDiaryBtn" class="close-diary-btn">✕</button>
                </div>
                
                <div class="diary-toolbar">
                    <button onclick="document.execCommand('bold', false, null)" title="In đậm"><b>B</b></button>
                    <button onclick="document.execCommand('italic', false, null)" title="In nghiêng"><i>I</i></button>
                    <button onclick="document.execCommand('underline', false, null)" title="Gạch chân"><u>U</u></button>
                    <button onclick="document.execCommand('insertUnorderedList', false, null)" title="Tạo danh sách">• List</button>
                    
                    <select id="diaryMood" class="mood-selector">
                        <option value="">Tâm trạng hôm nay...</option>
                        <option value="happy">🥰 Rất vui</option>
                        <option value="tired">🥱 Hơi mệt</option>
                        <option value="chill">🎧 Chill</option>
                    </select>
                </div>

                <div id="diaryContent" class="diary-editor" contenteditable="true" placeholder="Trút hết bầu tâm sự vào đây nhé..."></div>
                
                <button id="saveDiaryBtn" class="diary-save-btn">Lưu giữ bí mật 🔐</button>
            </div>
        </div>
    `;
    
    // Chèn vào cuối body
    document.body.insertAdjacentHTML('beforeend', diaryHTML);

    // 2. Các biến điều khiển
    const trigger = document.getElementById('secretTrigger'); // Bông hoa 🌸 trên index.html
    const modal = document.getElementById('secretDiaryModal');
    const closeBtn = document.getElementById('closeDiaryBtn');
    const saveBtn = document.getElementById('saveDiaryBtn');
    const editor = document.getElementById('diaryContent');
    const moodSelect = document.getElementById('diaryMood');

    // 3. Tải lại dữ liệu cũ khi mở trang
    editor.innerHTML = localStorage.getItem('qn_secret_diary') || '';
    moodSelect.value = localStorage.getItem('qn_secret_mood') || '';

    // 4. Bật nhật ký (Yêu cầu Mật khẩu cực xịn)
    if(trigger) {
        trigger.addEventListener('dblclick', () => {
            let pass = prompt("Nhập mật khẩu mở cửa trái tim:");
            if(pass === "EmYeuBinhLam") {
                modal.style.display = 'flex';
            } else if (pass !== null) {
                alert("Sai gòi! Người lạ không được vào đâu nha!");
            }
        });
    }

    // 5. Đóng và Lưu nhật ký
    closeBtn.addEventListener('click', () => modal.style.display = 'none');
    
    saveBtn.addEventListener('click', () => {
        localStorage.setItem('qn_secret_diary', editor.innerHTML);
        localStorage.setItem('qn_secret_mood', moodSelect.value);
        alert('Đã giấu kín những dòng tâm sự này rồi nhé! ✨');
        modal.style.display = 'none';
    });

    // 6. Tính năng Bonus: Auto-save (Tự động lưu sau 2 giây ngừng gõ)
    let timeout = null;
    editor.addEventListener('input', () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            localStorage.setItem('qn_secret_diary', editor.innerHTML);
            localStorage.setItem('qn_secret_mood', moodSelect.value);
            console.log("Đã tự động lưu nhật ký!");
        }, 2000);
    });

    moodSelect.addEventListener('change', () => {
        localStorage.setItem('qn_secret_mood', moodSelect.value);
    });
});