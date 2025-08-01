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

    #updateInputPlaceholderContent() {
        const input = document.querySelector('[data-i18n-placeholder]');
        if (input) {
            const inputAttributeKey = input.getAttribute('data-i18n-placeholder');
            input.placeholder = this.getText(inputAttributeKey);
        }
    }
    
    updateContent() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.getText(key);
        });
        this.#updateInputPlaceholderContent();
    }

    updateTableContent(table, tableId, isTableHere) {
        if (isTableHere) {
            const key = table.getAttribute('data-i18n-table');
            table.textContent = this.getText(key);
        } else {
            table.textContent = tableId;
        }
    }
}

export const langManager = new LanguageManager();