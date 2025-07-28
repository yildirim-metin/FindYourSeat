export class Guest {
    constructor(surname, name, hasConfirm, table) {
        this.surname = surname;
        this.name = name;
        this.hasConfirmed = hasConfirm;
        this.table = table;
    }

    fullName() {
        return `${this.surname} ${this.name ? `et ${this.name}` : ''}`;
    }
}