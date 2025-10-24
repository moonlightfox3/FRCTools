class Gamepads {
    static setConnectListener (callback = () => {}) {
        addEventListener("gamepadconnected", ev => callback(new SimpleGamepad(ev.gamepad.index)))
    }
    static setDisconnectListener (callback = () => {}) {
        addEventListener("gamepaddisconnected", ev => callback(new SimpleGamepad(ev.gamepad.index)))
    }
    static getGamepads () {
        return navigator.getGamepads().filter(val => val?.connected).map(val => new SimpleGamepad(val.index))
    }
}
class SimpleGamepad {
    #index
    #cursor
    constructor (index) {
        this.#index = index
        this.#cursor = new SimpleGamepadCursor(this)
    }
    get #get () {
        return navigator.getGamepads()[this.#index]
    }

    get id () {
        return this.#index
    }
    get info () {
        return this.#get.id
    }
    get timestamp () {
        return this.#get.timestamp
    }

    get joysticks () {
        let joysticks = []
        let axes = this.#get.axes
        for (let i = 0; i < axes.length; i += 2) joysticks.push([this.axes[i], this.axes[i + 1]])
        return joysticks
    }
    get buttons () {
        return this.#index.buttons.map(val => val.value == 0 ? +val.pressed : val.value)
    }

    async vibrate (strength, duration) {
        let vibration = this.#get.vibrationActuator
        if (vibration == undefined) return false
        await vibration.playEffect("dual-rumble", {
            duration,
            strongMagnitude: strength,
            weakMagnitude: strength,
        })
        return true
    }
    async stopVibrate () {
        let vibration = this.#get.vibrationActuator
        if (vibration == undefined) return false
        await vibration.reset()
        return true
    }

    get cursor () {
        return this.#cursor
    }
}
class SimpleGamepadCursor {
    static repeatDelay = 500
    static deadzone = 0.6

    #gamepad
    constructor (gamepad) {
        this.#gamepad = gamepad
    }

    update () {
        let joystick = this.#gamepad.joysticks[0]
        let timestamp = this.#gamepad.timestamp
        if (this.#leftInit == false) this.#leftInit = joystick[0] >= -SimpleGamepadCursor.deadzone
        else if (this.#leftTimestamp == -1) this.#leftTimestamp = joystick[0] < -SimpleGamepadCursor.deadzone ? timestamp : -1
        else if (joystick[0] >= -SimpleGamepadCursor.deadzone) this.#leftTimestamp = -1, this.#hasStartedLeft = false
        if (this.#rightInit == false) this.#rightInit = joystick[0] <= SimpleGamepadCursor.deadzone
        else if (this.#rightTimestamp == -1) this.#rightTimestamp = joystick[0] > SimpleGamepadCursor.deadzone ? timestamp : -1
        else if (joystick[0] <= SimpleGamepadCursor.deadzone) this.#rightTimestamp = -1, this.#hasStartedRight = false
        if (this.#upInit == false) this.#upInit = joystick[1] >= -SimpleGamepadCursor.deadzone
        else if (this.#upTimestamp == -1) this.#upTimestamp = joystick[1] < -SimpleGamepadCursor.deadzone ? timestamp : -1
        else if (joystick[1] >= -SimpleGamepadCursor.deadzone) this.#upTimestamp = -1, this.#hasStartedUp = false
        if (this.#downInit == false) this.#downInit = joystick[1] <= SimpleGamepadCursor.deadzone
        else if (this.#downTimestamp == -1) this.#downTimestamp = joystick[1] > SimpleGamepadCursor.deadzone ? timestamp : -1
        else if (joystick[1] <= SimpleGamepadCursor.deadzone) this.#downTimestamp = -1, this.#hasStartedDown = false

        let isClicking = this.#gamepad.buttons.findIndex(val => val > 0) > -1
        if (this.#clickInit == false) this.#clickInit = !isClicking
        else if (this.#clickTimestamp == -1) this.#clickTimestamp = isClicking ? timestamp : -1
        else if (!isClicking) this.#clickTimestamp = -1, this.#hasStartedClick = false
    }

    #leftTimestamp = -1
    #rightTimestamp = -1
    #upTimestamp = -1
    #downTimestamp = -1
    #clickTimestamp = -1
    #hasStartedLeft = false
    #hasStartedRight = false
    #hasStartedUp = false
    #hasStartedDown = false
    #hasStartedClick = false
    #leftInit = false
    #rightInit = false
    #upInit = false
    #downInit = false
    #clickInit = false
    get shouldMoveLeft () {
        if (!this.#leftInit) return false
        else if (this.#hasStartedLeft) return this.#gamepad.timestamp - this.#leftTimestamp >= SimpleGamepadCursor.repeatDelay
        else if (this.#leftTimestamp > -1) return this.#hasStartedLeft = true
        else return false
    }
    get shouldMoveRight () {
        if (!this.#rightInit) return false
        else if (this.#hasStartedRight) return this.#gamepad.timestamp - this.#rightTimestamp >= SimpleGamepadCursor.repeatDelay
        else if (this.#rightTimestamp > -1) return this.#hasStartedRight = true
        else return false
    }
    get shouldMoveUp () {
        if (!this.#upInit) return false
        else if (this.#hasStartedUp) return this.#gamepad.timestamp - this.#upTimestamp >= SimpleGamepadCursor.repeatDelay
        else if (this.#upTimestamp > -1) return this.#hasStartedUp = true
        else return false
    }
    get shouldMoveDown () {
        if (!this.#downInit) return false
        else if (this.#hasStartedDown) return this.#gamepad.timestamp - this.#downTimestamp >= SimpleGamepadCursor.repeatDelay
        else if (this.#downTimestamp > -1) return this.#hasStartedDown = true
        else return false
    }
    get shouldClick () {
        if (!this.#clickInit) return false
        else if (this.#hasStartedClick) return this.#gamepad.timestamp - this.#clickTimestamp >= SimpleGamepadCursor.repeatDelay
        else if (this.#clickTimestamp > -1) return this.#hasStartedClick = true
        else return false
    }
}
