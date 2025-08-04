export class BaseTextBuilder {
    constructor(langManager) {
        this.langManager = langManager;
    }

    buildTableInfo(tableNumber, guests) {
        return this.buildSentence(
            this.buildTablePart(tableNumber),
            this.buildGuestPart(guests)
        );
    }

    buildTableNumber(tableNumber) {
        const tableWithCurrentLanguage = this.langManager.getText('table');
        const tableText = tableWithCurrentLanguage.charAt(0).toUpperCase() + tableWithCurrentLanguage.slice(1);
        return `${tableText} <strong>${tableNumber}</strong>`;
    }

    buildTablePart(tableNumber) {
        return `${this.langManager.getText('youAreAt')}
             <strong>${this.langManager.getText('table')} ${tableNumber}</strong>`;
    }

    buildGuestPart(guests) {
        const guestsText = guests.map(g => `<strong>${g.fullName()}</strong>`).join(', ');
        return `${this.langManager.getText('with')} ${guestsText}`;
    }

    buildSentence(tablePart, guestsPart) {
        return `${tablePart} ${guestsPart}`;
    }
}

export class TurkishTextBuilder extends BaseTextBuilder {
    buildTableNumber(tableNumber) {
        return `<strong>${tableNumber} numaralı</strong> ${this.langManager.getText('table')}`;
    }

    buildTablePart(tableNumber) {
        return this.buildTableNumber(tableNumber);
    }

    buildGuestPart(guests) {
        const guestsText = guests.map(g => `<strong>${g.fullName()}</strong>`).join(', ');
        return `${guestsText} ${this.langManager.getText('with')}`;
    }

    buildSentence(tablePart, guestsPart) {
        return `${guestsPart} ${tablePart}${this.langManager.getText('youAreAt')}`;
    }
}