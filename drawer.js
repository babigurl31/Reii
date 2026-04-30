window.toggleDrawer = (drawerId) => {
    const target = document.getElementById(drawerId);
    // Tìm ngăn kéo đối diện
    const otherId = drawerId === 'leftDrawer' ? 'rightDrawer' : 'leftDrawer';
    const other = document.getElementById(otherId);

    if (target.classList.contains('open')) {
        target.classList.remove('open');
    } else {
        target.classList.add('open');
        other.classList.remove('open'); // Ra lệnh đóng ngăn đối diện
    }
};
