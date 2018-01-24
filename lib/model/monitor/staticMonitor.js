// The static monitor is triggered when price of the quote reaches above or goes below certain value
class StaticMonitor {
    constructor(direction, value) {
        this.direction = direction
        this.value = value
        this.expired = false
    }

    static name() {
        // name() is used to check if the monitor type user wants to add is valid
        return "staic"
    }

    id() {
        // id() is used to dedup when a new alert is added
        return "staic" + this.direction + this.value
    }

    describe(context) {
        // describe() is the alert message
        return `${context.time} ${context.symbol} ${context.price} ${this.direction} ${this.value}`
    }

    expiry() {
        return this.expired
    }

    check(context) {
        if (this.direction === '>' && context.price() >= this.value || this.direction === '<' && context.price() <= this.value) {
            this.expired = true
            return true
        }
    }
}

module.exports = StaticMonitor