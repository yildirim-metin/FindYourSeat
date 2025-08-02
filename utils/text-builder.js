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
    buildTablePart(tableNumber) {
        return `<strong>${tableNumber} numaralı</strong> ${this.langManager.getText('table')}`;
    }

    buildGuestPart(guests) {
        const guestsText = guests.map(g => `<strong>${g.fullName()}</strong>`).join(', ');
        return `${guestsText} ${this.langManager.getText('with')}`;
    }

    buildSentence(tablePart, guestsPart) {
        return `${guestsPart} ${tablePart}${this.langManager.getText('youAreAt')}`;
    }
}