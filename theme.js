document.addEventListener('DOMContentLoaded', () => {
    const themeHTML = `
        <div class="settings-wrapper">
            <div class="settings-menu" id="settingsMenu">
                <button class="set-btn" id="btnThemeBg" title="Đổi hình nền"><img src="setting-bg.png" alt="Nền"></button>
                <button class="set-btn" id="btnThemeColor" title="Đổi màu Theme"><img src="setting-color.png" alt="Màu"></button>
                <button class="set-btn" id="btnThemeFont" title="Đổi Font chữ"><img src="setting-font.png" alt="Font"></button>
                <button class="set-btn" id="btnThemeDark" title="Bật/Tắt Đèn">💡</button>
            </div>
            <button class="main-set-btn" id="btnThemeMain"><img src="setting-main.png" alt="Cài đặt"></button>
        </div>
        <div id="bgThemeModal" class="theme-modal-overlay">
            <div class="theme-modal">
                <h3>Đổi Giao Diện Nền</h3>
                <div class="toggle-container">
                    <span>Màu Nhạt</span>
                    <label class="switch">
                        <input type="checkbox" id="bgToggle">
                        <span class="slider"></span>
                    </label>
                    <span>Dùng Ảnh</span>
                </div>
                <input type="text" id="bgLinkInput" placeholder="Dán link ảnh...">
                <div class="modal-btns">
                    <button id="btnSaveBg">Áp Dụng</button>
                    <button class="cancel btnCloseThemeModals">Hủy</button>
                </div>
            </div>
        </div>
        <div id="colorThemeModal" class="theme-modal-overlay">
            <div class="theme-modal">
                <h3>Đổi Màu Web</h3>
                <input type="color" id="colorPicker" style="width:100%; height: 50px; border:none; cursor:pointer; border-radius: 8px;">
                <input type="text" id="hexInput" placeholder="VD: #ec407a">
                <div class="modal-btns">
                    <button id="btnSaveColor">Lưu Màu</button>
                    <button class="cancel btnCloseThemeModals">Hủy</button>
                </div>
            </div>
        </div>
        <div id="fontThemeModal" class="theme-modal-overlay">
            <div class="theme-modal">
                <h3>Đổi Font Chữ</h3>
                <select id="fontSelect">
                    <option value="Syne">Syne (Mặc định)</option>
                    <option value="Playfair Display">Playfair Display</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Dancing Script">Dancing Script</option>
                    <option value="Quicksand">Quicksand</option>
                    <option value="Pacifico">Pacifico</option>
                    <option value="Patrick Hand">Patrick Hand</option>
                    <option value="custom_font">👉 Nhập tên Font khác...</option>
                </select>
                <input type="text" id="customFontInput" placeholder="Nhập tên Font..." style="display:none;">
                <div class="modal-btns">
                    <button id="btnSaveFont">Áp Dụng</button>
                    <button class="cancel btnCloseThemeModals">Hủy</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', themeHTML);

// Cơ chế: Mở nút Setting thì tự động đóng các nút khác (List, Trái, Phải...)
    window.toggleExclusiveMenu = (menuIdToOpen) => {
        const allMenus = ['settingsMenu', 'listMenu']; // Cứ thêm ID menu mới vào mảng này sau này
        allMenus.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                if (id === menuIdToOpen) el.classList.toggle('open');
                else el.classList.remove('open');
            }
        });
    };

    document.getElementById('btnThemeMain').addEventListener('click', () => {
        window.toggleExclusiveMenu('settingsMenu');
    });
    
    document.querySelectorAll('.btnCloseThemeModals').forEach(btn => btn.addEventListener('click', () => { 
        document.getElementById('bgThemeModal').style.display='none'; 
        document.getElementById('colorThemeModal').style.display='none'; 
        document.getElementById('fontThemeModal').style.display='none'; 
    }));

    document.getElementById('btnThemeBg').addEventListener('click', () => {
        document.getElementById('bgThemeModal').style.display='flex'; 
        document.getElementById('bgToggle').checked = (localStorage.getItem('qn_bg_mode') || 'image') === 'image';
        document.getElementById('bgLinkInput').style.display = document.getElementById('bgToggle').checked ? 'block' : 'none';
        document.getElementById('bgLinkInput').value = localStorage.getItem('qn_bg_link') || ''; 
        document.getElementById('settingsMenu').classList.remove('open');
    });
    document.getElementById('bgToggle').addEventListener('change', e => document.getElementById('bgLinkInput').style.display = e.target.checked ? 'block' : 'none');
    document.getElementById('btnSaveBg').addEventListener('click', () => {
        let isImg = document.getElementById('bgToggle').checked; 
        localStorage.setItem('qn_bg_mode', isImg ? 'image' : 'color');
        if(isImg) localStorage.setItem('qn_bg_link', document.getElementById('bgLinkInput').value.trim());
        applyTheme(); document.getElementById('bgThemeModal').style.display='none';
    });

    document.getElementById('btnThemeColor').addEventListener('click', () => {
        document.getElementById('colorThemeModal').style.display='flex'; 
        let hex = localStorage.getItem('qn_theme_accent') || '#ec407a';
        document.getElementById('colorPicker').value = hex; 
        document.getElementById('hexInput').value = hex; 
        document.getElementById('settingsMenu').classList.remove('open');
    });
    document.getElementById('colorPicker').addEventListener('input', e => document.getElementById('hexInput').value = e.target.value);
    document.getElementById('hexInput').addEventListener('input', e => { if(/^#[0-9A-F]{6}$/i.test(e.target.value)) document.getElementById('colorPicker').value = e.target.value; });
    document.getElementById('btnSaveColor').addEventListener('click', () => {
        let h = document.getElementById('hexInput').value.trim(); if(h) localStorage.setItem('qn_theme_accent', h);
        applyTheme(); document.getElementById('colorThemeModal').style.display='none';
    });

    document.getElementById('btnThemeFont').addEventListener('click', () => {
        document.getElementById('fontThemeModal').style.display='flex'; 
        let cur = localStorage.getItem('qn_font') || 'Syne';
        let sel = document.getElementById('fontSelect'); 
        let found = Array.from(sel.options).some(o => o.value === cur);
        if(found) sel.value = cur; 
        else { sel.value = 'custom_font'; document.getElementById('customFontInput').value = cur; document.getElementById('customFontInput').style.display = 'block'; }
        document.getElementById('settingsMenu').classList.remove('open');
    });
    document.getElementById('fontSelect').addEventListener('change', e => document.getElementById('customFontInput').style.display = e.target.value === 'custom_font' ? 'block' : 'none');
    document.getElementById('btnSaveFont').addEventListener('click', () => {
        let sel = document.getElementById('fontSelect').value; 
        if(sel === 'custom_font') sel = document.getElementById('customFontInput').value.trim();
        localStorage.setItem('qn_font', sel || 'Syne'); 
        applyTheme(); document.getElementById('fontThemeModal').style.display='none';
    });

    document.getElementById('btnThemeDark').addEventListener('click', () => { 
        localStorage.setItem('qn_dark_mode', localStorage.getItem('qn_dark_mode') === 'on' ? 'off' : 'on'); 
        applyTheme(); 
    });

    applyTheme();
});

function hexToRgba(hex, alpha) {
    hex = hex.replace('#', ''); 
    if(hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    return `rgba(${parseInt(hex.substring(0,2), 16)}, ${parseInt(hex.substring(2,4), 16)}, ${parseInt(hex.substring(4,6), 16)}, ${alpha})`;
}

// BÊ Y NGUYÊN HÀM GỐC CỦA NGHI VÀO ĐÂY (Lớp màng phủ 0.3)
function applyTheme() {
    let accent = localStorage.getItem('qn_theme_accent') || '#ec407a';
    let bgMode = localStorage.getItem('qn_bg_mode') || 'image';
    let bgLink = localStorage.getItem('qn_bg_link') || 'nen-dong.gif';
    let isDark = localStorage.getItem('qn_dark_mode') === 'on';
    let savedFont = localStorage.getItem('qn_font') || 'Syne';

    document.documentElement.style.setProperty('--accent', accent);

    if(isDark) document.body.classList.add('dark-mode'); 
    else document.body.classList.remove('dark-mode');

    if(bgMode === 'image') {
        let overlay = isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.3)';
        document.body.style.backgroundImage = `linear-gradient(${overlay}, ${overlay}), url('${bgLink}')`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center center';
        document.body.style.backgroundAttachment = 'fixed';
    } else {
        document.body.style.backgroundImage = 'none';
        if (!isDark) {
            document.documentElement.style.setProperty('--bg-main', hexToRgba(accent, 0.15));
        }
        document.body.style.backgroundColor = 'var(--bg-main)';
    }

    let fontLink = document.getElementById('qnGoogleFontLink');
    if (savedFont !== 'Syne') {
        if (!fontLink) {
            fontLink = document.createElement('link');
            fontLink.id = 'qnGoogleFontLink';
            fontLink.rel = 'stylesheet';
            document.head.appendChild(fontLink);
        }
        fontLink.href = `https://fonts.googleapis.com/css2?family=${savedFont.replace(/ /g, '+')}:wght@400;600;700&display=swap`;
    }

    let fontStyle = document.getElementById('qnCustomFontStyle');
    if (!fontStyle) {
        fontStyle = document.createElement('style');
        fontStyle.id = 'qnCustomFontStyle';
        document.head.appendChild(fontStyle);
    }
    if (savedFont !== 'Syne') {
        fontStyle.innerHTML = `* { font-family: '${savedFont}', sans-serif !important; }`;
    } else {
        fontStyle.innerHTML = ''; 
    }
}
