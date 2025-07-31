import { translations } from "./lang.js";

class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'fr';
    }

    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        this.updateContent();
    }

    getText(key) {
        return translations[this.currentLang][key];
    }

    updateContent() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.getText(key);
        });
    }
}

export const langManager = new LanguageManager();