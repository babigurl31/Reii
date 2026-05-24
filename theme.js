document.addEventListener('DOMContentLoaded', () => {
    // 1. TỰ ĐỘNG NHÚNG GIAO DIỆN NÚT SETTING VÀO WEB (Đã thêm nút Font chữ)
    const themeHTML = `
        <div class="settings-wrapper">
            <div class="settings-menu" id="settingsMenu">
                <button class="set-btn" onclick="openBgModal()" title="Đổi hình nền">
                    <img src="setting-bg.png" alt="BG" onerror="this.src='https://cdn-icons-png.flaticon.com/512/1160/1160321.png'">
                </button>
                <button class="set-btn" onclick="openColorModal()" title="Đổi màu Theme">
                    <img src="setting-color.png" alt="Color" onerror="this.src='https://cdn-icons-png.flaticon.com/512/2919/2919736.png'">
                </button>
                <button class="set-btn" onclick="openFontModal()" title="Đổi Font chữ">
                    <img src="setting-font.png" alt="Font" onerror="this.src='https://cdn-icons-png.flaticon.com/512/2653/2653504.png'">
                </button>
                <button class="set-btn" onclick="toggleDarkMode()" title="Bật/Tắt Đèn">💡</button>
            </div>
            
            <button class="main-set-btn" onclick="toggleSettingsMenu()">
                <img src="setting-main.png" alt="Settings" onerror="this.src='https://cdn-icons-png.flaticon.com/512/3524/3524659.png'">
            </button>
        </div>

        <div id="bgThemeModal" class="theme-modal-overlay">
            <div class="theme-modal">
                <h3>Đổi Giao Diện Nền</h3>
                <div class="toggle-container">
                    <span>Màu Nhạt</span>
                    <label class="switch">
                        <input type="checkbox" id="bgToggle" onchange="toggleBgInput()">
                        <span class="slider"></span>
                    </label>
                    <span>Dùng Ảnh</span>
                </div>
                <input type="text" id="bgLinkInput" placeholder="Dán link ảnh (hoặc tên file) vào đây...">
                <div class="modal-btns">
                    <button onclick="saveBgSettings()">Áp Dụng</button>
                    <button class="cancel" onclick="closeThemeModals()">Hủy</button>
                </div>
            </div>
        </div>

        <div id="colorThemeModal" class="theme-modal-overlay">
            <div class="theme-modal">
                <h3>Đổi Màu Web</h3>
                <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 15px;">Bấm vào ô màu để chọn nhanh, hoặc nhập mã HEX nhé Babi!</div>
                <input type="color" id="colorPicker" style="width:100%; height: 50px; border:none; cursor:pointer; border-radius: 8px;">
                <input type="text" id="hexInput" placeholder="VD: #ec407a">
                <div class="modal-btns">
                    <button onclick="saveColorSettings()">Lưu Màu</button>
                    <button class="cancel" onclick="closeThemeModals()">Hủy</button>
                </div>
            </div>
        </div>

        <div id="fontThemeModal" class="theme-modal-overlay">
            <div class="theme-modal">
                <h3>Đổi Font Chữ Web</h3>
                <div style="font-size: 13px; color: var(--text-muted); margin-bottom: 15px;">Chọn mẫu có sẵn hoặc nhập một font bất kỳ trên Google Fonts nha!</div>
                <select id="fontSelect" onchange="toggleCustomFontInput()">
                    <option value="Syne">Syne (Mặc định của Nghi)</option>
                    <option value="Playfair Display">Playfair Display (Chữ cổ điển quý phái)</option>
                    <option value="Montserrat">Montserrat (Hiện đại, nét thanh thoát)</option>
                    <option value="Dancing Script">Dancing Script (Chữ nghệ thuật uốn lượn)</option>
                    <option value="Quicksand">Quicksand (Nét tròn siêu dễ thương)</option>
                    <option value="Pacifico">Pacifico (Chữ viết bảng phóng khoáng)</option>
                    <option value="Patrick Hand">Patrick Hand (Dạng chữ viết tay tự nhiên)</option>
                    <option value="custom_font">👉 Nhập tên Font khác từ Google Fonts...</option>
                </select>
                <input type="text" id="customFontInput" placeholder="Nhập chuẩn tên trên Google Fonts (VD: Roboto, Inter)...">
                <div class="modal-btns">
                    <button onclick="saveFontSettings()">Áp Dụng</button>
                    <button class="cancel" onclick="closeThemeModals()">Hủy</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', themeHTML);

    // Đồng bộ Color Picker và Ô nhập Hex
    const colorPicker = document.getElementById('colorPicker');
    const hexInput = document.getElementById('hexInput');
    if(colorPicker && hexInput) {
        colorPicker.addEventListener('input', (e) => hexInput.value = e.target.value);
        hexInput.addEventListener('input', (e) => {
            if(/^#[0-9A-F]{6}$/i.test(e.target.value)) colorPicker.value = e.target.value;
        });
    }

    applyTheme(); // Khởi chạy giao diện ngay lúc mở web
});

// 2. CÁC HÀM XỬ LÝ NÚT BẤM
window.toggleSettingsMenu = () => document.getElementById('settingsMenu').classList.toggle('open');
window.closeThemeModals = () => { 
    document.getElementById('bgThemeModal').style.display = 'none'; 
    document.getElementById('colorThemeModal').style.display = 'none'; 
    document.getElementById('fontThemeModal').style.display = 'none'; 
}

// Xử lý Form Hình Nền
window.openBgModal = () => {
    document.getElementById('bgThemeModal').style.display = 'flex';
    document.getElementById('bgToggle').checked = (localStorage.getItem('qn_bg_mode') || 'image') === 'image';
    toggleBgInput();
    document.getElementById('bgLinkInput').value = localStorage.getItem('qn_bg_link') || '';
    document.getElementById('settingsMenu').classList.remove('open');
}
window.toggleBgInput = () => document.getElementById('bgLinkInput').style.display = document.getElementById('bgToggle').checked ? 'block' : 'none';
window.saveBgSettings = () => {
    let isImage = document.getElementById('bgToggle').checked;
    localStorage.setItem('qn_bg_mode', isImage ? 'image' : 'color');
    if(isImage) localStorage.setItem('qn_bg_link', document.getElementById('bgLinkInput').value.trim());
    applyTheme(); closeThemeModals();
}

// Xử lý Form Đổi Màu
window.openColorModal = () => {
    document.getElementById('colorThemeModal').style.display = 'flex';
    let currentHex = localStorage.getItem('qn_theme_accent') || '#ec407a';
    document.getElementById('colorPicker').value = currentHex;
    document.getElementById('hexInput').value = currentHex;
    document.getElementById('settingsMenu').classList.remove('open');
}
window.saveColorSettings = () => {
    let hex = document.getElementById('hexInput').value.trim() || document.getElementById('colorPicker').value;
    if(hex) localStorage.setItem('qn_theme_accent', hex);
    applyTheme(); closeThemeModals();
}

// Xử lý Form Đổi Font chữ
window.openFontModal = () => {
    document.getElementById('fontThemeModal').style.display = 'flex';
    let currentFont = localStorage.getItem('qn_font') || 'Syne';
    let select = document.getElementById('fontSelect');
    let customInput = document.getElementById('customFontInput');
    
    let exists = false;
    for(let i=0; i<select.options.length; i++) {
        if(select.options[i].value === currentFont) {
            select.selectedIndex = i;
            exists = true;
            break;
        }
    }
    if(!exists && currentFont !== 'Syne') {
        select.value = 'custom_font';
        customInput.value = currentFont;
        customInput.style.display = 'block';
    } else {
        customInput.style.display = 'none';
        customInput.value = '';
    }
    document.getElementById('settingsMenu').classList.remove('open');
}
window.toggleCustomFontInput = () => {
    let select = document.getElementById('fontSelect');
    document.getElementById('customFontInput').style.display = (select.value === 'custom_font') ? 'block' : 'none';
}
window.saveFontSettings = () => {
    let select = document.getElementById('fontSelect');
    let fontValue = select.value;
    if(fontValue === 'custom_font') {
        fontValue = document.getElementById('customFontInput').value.trim();
    }
    if(!fontValue) fontValue = 'Syne';
    localStorage.setItem('qn_font', fontValue);
    applyTheme(); closeThemeModals();
}

// Xử lý Dark Mode
window.toggleDarkMode = () => {
    let isDark = localStorage.getItem('qn_dark_mode') === 'on';
    localStorage.setItem('qn_dark_mode', isDark ? 'off' : 'on');
    applyTheme(); document.getElementById('settingsMenu').classList.remove('open');
}

function hexToRgba(hex, alpha) {
    hex = hex.replace('#', '');
    if(hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    return `rgba(${parseInt(hex.substring(0,2), 16)}, ${parseInt(hex.substring(2,4), 16)}, ${parseInt(hex.substring(4,6), 16)}, ${alpha})`;
}

// 3. BỘ NÃO TRUNG TÂM - ÁP DỤNG MÀU, NỀN & FONT CHỮ
window.applyTheme = () => {
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

    // XỬ LÝ KẾT NỐI VÀ TẢI GOOGLE FONTS DỰA TRÊN LỰA CHỌN CỦA NGHI
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

    // Ép đè font chữ lên toàn bộ selector * của trang web
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