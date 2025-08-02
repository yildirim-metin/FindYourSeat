import { appState } from "../utils/app-state.js";
import { BaseTextBuilder, TurkishTextBuilder } from "../utils/text-builder.js";
import { translations } from "./lang.js";

class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('language') || 'fr';
        this.textBuilder = this.createTextBuilder();
    }

    createTextBuilder() {
        return this.currentLang === 'tr'
            ? new TurkishTextBuilder(this)
            : new BaseTextBuilder(this);
    }

    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('language', lang);
        this.textBuilder = this.createTextBuilder();
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

    #updateCurrentTableContent() {
        const table = document.getElementById('table-' + appState.tableNumber);
        this.updateTableContent(table, 0, true);
    }

    updateTableContent(table, tableId, isTableHere) {
        if (table) {
            if (isTableHere) {
                const key = table.getAttribute('data-i18n-table');
                table.textContent = this.getText(key);
            } else {
                table.textContent = tableId;
            }
        }
    }

    buildTableInfoText(tableNumber, otherGuests) {
        return this.textBuilder.buildTableInfo(tableNumber, otherGuests);
    }

    #buildCurrentTableInfoText() {
        const tableInfo = document.getElementById("table-info");
        if (tableInfo) {
            tableInfo.innerHTML = this.buildTableInfoText(appState.tableNumber, appState.otherGuests);
        }
    }

    updateContent() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.getText(key);
        });
        this.#updateInputPlaceholderContent();
        this.#updateCurrentTableContent();
        this.#buildCurrentTableInfoText();
    }
}

export const langManager = new LanguageManager();