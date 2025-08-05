import { langManager } from "../i18n/language-manager.js";
import { translations } from "../i18n/lang.js";

const titleTab = [
    'Choose your language',
    'Choisit ta langue',
    'Scegli la tua lingua',
    'Dilini seç',
    'Kies je taal'
];

window.addEventListener('DOMContentLoaded', async () => {
    addOnClickEventForCards();
    updateTitle();
});

function addOnClickEventForCards() {
    document.querySelectorAll('#section-language .card').forEach(card => {
        card.addEventListener('click', () => {
            const lang = card.dataset.lang;
            langManager.setLanguage(lang);
            window.location.href = 'main.html';
        });
    });
}

function updateTitle() {
    const translationKeys = Object.keys(translations);
    const welcome = document.getElementById('app-title-welcome');
    welcome.textContent = translations[translationKeys[0]]['welcome'];

    const title = document.getElementById('select-language-title');
    title.textContent = titleTab[0];
    
    let i = 1;
    setInterval(() => {
        welcome.textContent = translations[translationKeys[i]]['welcome'];
        title.textContent = titleTab[i];
        i = (i + 1) % titleTab.length;
    }, 3000);
}