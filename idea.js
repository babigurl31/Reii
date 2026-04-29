let ideaData = JSON.parse(localStorage.getItem('qn_ideas')) || [];

function renderIdea() {
    const list = document.getElementById('ideaList'); list.innerHTML = '';
    ideaData.forEach((item, idx) => { list.innerHTML += `<li class="mini-item"><span>${item}</span><button class="mini-del-btn" onclick="delIdea(${idx})">✕</button></li>`; });
}
window.addIdea = () => {
    const val = document.getElementById('ideaInput').value.trim();
    if(val) { ideaData.push(val); localStorage.setItem('qn_ideas', JSON.stringify(ideaData)); document.getElementById('ideaInput').value = ''; renderIdea(); }
};
window.delIdea = (idx) => { ideaData.splice(idx, 1); localStorage.setItem('qn_ideas', JSON.stringify(ideaData)); renderIdea(); };

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('ideaInput').addEventListener('keypress', e => { if(e.key === 'Enter') addIdea(); });
    renderIdea();
});
