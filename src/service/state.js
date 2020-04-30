class State {
    constructor() {
        this._startTime = "09:30";
    }
    get startTime() {
        return this._startTime;
    }

    // time is a string, for example '09:30'
    set startTime(time) {
        this._startTime = time.trim();
    }
}
const INSTANCE = new State();
export default INSTANCE;