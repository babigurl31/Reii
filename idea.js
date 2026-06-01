let ideaData = JSON.parse(localStorage.getItem('qn_ideas')) || [];

function renderIdea() {
    const list = document.getElementById('ideaList'); list.innerHTML = '';
    ideaData.forEach((item, idx) => { list.innerHTML += `<li class="mini-item"><span>${item}</span><button class="mini-del-btn btn-del-idea" data-idx="${idx}">✕</button></li>`; });
}
function addIdea() {
    const val = document.getElementById('ideaInput').value.trim();
    if(val) { ideaData.push(val); localStorage.setItem('qn_ideas', JSON.stringify(ideaData)); document.getElementById('ideaInput').value = ''; renderIdea(); }
}
function delIdea(idx) { ideaData.splice(idx, 1); localStorage.setItem('qn_ideas', JSON.stringify(ideaData)); renderIdea(); }

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('ideaInput').addEventListener('keypress', e => { if(e.key === 'Enter') addIdea(); });
    document.getElementById('btnAddIdeaBtn').addEventListener('click', addIdea);
    document.getElementById('ideaList').addEventListener('click', e => {
        if(e.target.classList.contains('btn-del-idea')) delIdea(parseInt(e.target.dataset.idx));
    });
    renderIdea();
});