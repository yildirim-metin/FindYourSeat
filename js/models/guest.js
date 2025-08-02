import { langManager } from "../../i18n/language-manager.js";

export class Guest {
    constructor(surname, name, hasConfirm, table) {
        this.surname = surname;
        this.name = name;
        this.hasConfirmed = hasConfirm;
        this.table = table;
    }

    fullName() {
        const and = langManager.getText('and');
        return `${this.surname}${this.name ? ` ${and} ${this.name}` : ''}`;
    }
}