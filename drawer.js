function toggleDrawer(drawerId) {
    const target = document.getElementById(drawerId);
    if (!target) return;
    
    // Tìm ngăn kéo đối diện
    const otherId = drawerId === 'leftDrawer' ? 'rightDrawer' : 'leftDrawer';
    const other = document.getElementById(otherId);

    if (target.classList.contains('open')) {
        target.classList.remove('open');
    } else {
        target.classList.add('open');
        if (other) other.classList.remove('open'); // Ra lệnh đóng ngăn đối diện
    }
}

// BỘ NÃO BẢO MẬT: Tự động lắng nghe sự kiện click từ HTML
document.addEventListener('DOMContentLoaded', () => {
    const btnLeft = document.getElementById('btnToggleLeft');
    const btnRight = document.getElementById('btnToggleRight');
    
    if (btnLeft) {
        btnLeft.addEventListener('click', () => toggleDrawer('leftDrawer'));
    }
    
    if (btnRight) {
        btnRight.addEventListener('click', () => toggleDrawer('rightDrawer'));
    }
});