let shopData = JSON.parse(localStorage.getItem('qn_shop')) || [];

function renderShop() {
    const list = document.getElementById('shopList'); list.innerHTML = '';
    shopData.forEach((item, idx) => { list.innerHTML += `<li class="mini-item ${item.done ? 'done' : ''}"><div style="display:flex; gap:8px; align-items:flex-start;"><input type="checkbox" class="chk-shop" data-idx="${idx}" style="margin-top:2px; accent-color:var(--accent);" ${item.done ? 'checked' : ''}><span>${item.text}</span></div><button class="mini-del-btn btn-del-shop" data-idx="${idx}">✕</button></li>`; });
}
function addShop() {
    const val = document.getElementById('shopInput').value.trim();
    if(val) { shopData.push({text: val, done: false}); localStorage.setItem('qn_shop', JSON.stringify(shopData)); document.getElementById('shopInput').value = ''; renderShop(); }
}
function checkShop(idx) { shopData[idx].done = !shopData[idx].done; localStorage.setItem('qn_shop', JSON.stringify(shopData)); renderShop(); }
function delShop(idx) { shopData.splice(idx, 1); localStorage.setItem('qn_shop', JSON.stringify(shopData)); renderShop(); }

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('shopInput').addEventListener('keypress', e => { if(e.key === 'Enter') addShop(); });
    document.getElementById('btnAddShopBtn').addEventListener('click', addShop);
    document.getElementById('shopList').addEventListener('change', e => {
        if(e.target.classList.contains('chk-shop')) checkShop(parseInt(e.target.dataset.idx));
    });
    document.getElementById('shopList').addEventListener('click', e => {
        if(e.target.classList.contains('btn-del-shop')) delShop(parseInt(e.target.dataset.idx));
    });
    renderShop();
});