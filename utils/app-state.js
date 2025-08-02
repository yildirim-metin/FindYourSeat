class AppState {
    constructor() {
        this._tableNumber = 0;
        this._listeners = new Set();
        this._otherGuests = [];
    }

    get tableNumber() {
        return this._tableNumber;
    }

    set tableNumber(value) {
        this._tableNumber = value;
        this._notifyListeners();
    }

    get otherGuests() {
        return this._otherGuests;
    }

    set otherGuests(value) {
        this._otherGuests = value;
    }

    subscribe(listener) {
        this._listeners.add(listener);
        return () => this._listeners.delete(listener);
    }

    _notifyListeners() {
        this._listeners.forEach(listener => listener(this._tableNumber));
    }
}

export const appState = new AppState();