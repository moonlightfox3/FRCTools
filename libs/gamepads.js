class Gamepads {
    static addConnectListener (callback = () => {}) {
        addEventListener("gamepadconnected", ev => callback(new SimpleGamepad(ev.gamepad.index)))
    }
    static addDisconnectListener (callback = () => {}) {
        addEventListener("gamepaddisconnected", ev => callback(new SimpleGamepad(ev.gamepad.index)))
    }
    static getGamepads () {
        return navigator.getGamepads().filter(val => val?.connected).map(val => new SimpleGamepad(val.index))
    }
}
class SimpleGamepad {
    #buttonMapping = ["RD", "RR", "RL", "RU", "LBU", "RBU", "LBD", "RBD", "ML", "MR", "JL", "JR", "LU", "LD", "LL", "LR", "MM"]

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
        for (let i = 0; i < axes.length; i += 2) joysticks.push([axes[i], axes[i + 1]])
        return joysticks
    }
    get joysticksNamed () {
        let joysticks = this.joysticks
        return {
            "left": {
                "x": joysticks[0][0],
                "y": joysticks[0][1],
            },
            "right": {
                "x": joysticks[1][0],
                "y": joysticks[1][1],
            },
        }
    }
    get buttons () {
        return this.#get.buttons.map(val => val.value == 0 ? +val.pressed : val.value)
    }
    get buttonsNamed () {
        let obj = {}, buttons = this.buttons
        for (let i = 0; i < buttons.length; i++) obj[this.#buttonMapping[i] ?? `unknown${i - 17}`] = buttons[i]
        return obj
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
    static reRepeatDelay = 50
    static deadzone = 0.6

    #gamepad
    constructor (gamepad) {
        this.#gamepad = gamepad
    }

    update () {
        let timestamp = this.#gamepad.timestamp
        
        let joystick = this.#gamepad.joysticksNamed.left
        if (this.#leftInit == false) this.#leftInit = joystick.x >= -SimpleGamepadCursor.deadzone
        else if (this.#leftTimestamp == -1) this.#leftTimestamp = joystick.x < -SimpleGamepadCursor.deadzone ? timestamp : -1
        else if (joystick.x >= -SimpleGamepadCursor.deadzone) this.#leftTimestamp = -1, this.#leftRepeatTimestamp = -1, this.#hasStartedLeft = false
        if (this.#rightInit == false) this.#rightInit = joystick.x <= SimpleGamepadCursor.deadzone
        else if (this.#rightTimestamp == -1) this.#rightTimestamp = joystick.x > SimpleGamepadCursor.deadzone ? timestamp : -1
        else if (joystick.x <= SimpleGamepadCursor.deadzone) this.#rightTimestamp = -1, this.#rightRepeatTimestamp = -1, this.#hasStartedRight = false
        if (this.#upInit == false) this.#upInit = joystick.y >= -SimpleGamepadCursor.deadzone
        else if (this.#upTimestamp == -1) this.#upTimestamp = joystick.y < -SimpleGamepadCursor.deadzone ? timestamp : -1
        else if (joystick.y >= -SimpleGamepadCursor.deadzone) this.#upTimestamp = -1, this.#upRepeatTimestamp = -1, this.#hasStartedUp = false
        if (this.#downInit == false) this.#downInit = joystick.y <= SimpleGamepadCursor.deadzone
        else if (this.#downTimestamp == -1) this.#downTimestamp = joystick.y > SimpleGamepadCursor.deadzone ? timestamp : -1
        else if (joystick.y <= SimpleGamepadCursor.deadzone) this.#downTimestamp = -1, this.#downRepeatTimestamp = -1, this.#hasStartedDown = false
        let isClicking = this.#gamepad.buttons.findIndex(val => val > 0) > -1
        if (this.#clickInit == false) this.#clickInit = !isClicking
        else if (this.#clickTimestamp == -1) this.#clickTimestamp = isClicking ? timestamp : -1
        else if (!isClicking) this.#clickTimestamp = -1, this.#clickRepeatTimestamp = -1, this.#hasStartedClick = false

        this.isLeftReady = this.#leftInit, this.isRightReady = this.#rightInit, this.isUpReady = this.#upInit, this.isDownReady = this.#downInit, this.isClickReady = this.#clickInit
        this.isLeftRepeat = this.#hasStartedLeft, this.isRightRepeat = this.#hasStartedRight, this.isUpRepeat = this.#hasStartedUp, this.isDownRepeat = this.#hasStartedDown, this.isClickRepeat = this.#hasStartedClick
        let left = this.#shouldMoveLeft, right = this.#shouldMoveRight, up = this.#shouldMoveUp, down = this.#shouldMoveDown, click = this.#shouldClick
        this.isLeft = left, this.isRight = right, this.isUp = up, this.isDown = down, this.isClick = click
    }
    
    isLeft = false
    isRight = false
    isUp = false
    isDown = false
    isClick = false
    isLeftRepeat = false
    isRightRepeat = false
    isUpRepeat = false
    isDownRepeat = false
    isClickRepeat = false
    isLeftReady = false
    isRightReady = false
    isUpReady = false
    isDownReady = false
    isClickReady = false

    #leftTimestamp = -1
    #rightTimestamp = -1
    #upTimestamp = -1
    #downTimestamp = -1
    #clickTimestamp = -1
    #leftRepeatTimestamp = -1
    #rightRepeatTimestamp = -1
    #upRepeatTimestamp = -1
    #downRepeatTimestamp = -1
    #clickRepeatTimestamp = -1
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
    get #shouldMoveLeft () {
        let timestamp = this.#gamepad.timestamp
        if (!this.#leftInit) return false
        else if (this.#hasStartedLeft) {
            if (this.#leftRepeatTimestamp == -1) {
                let val = timestamp - this.#leftTimestamp >= SimpleGamepadCursor.repeatDelay
                if (val) this.#leftRepeatTimestamp = timestamp
                return val
            } else {
                let val = timestamp - this.#leftRepeatTimestamp >= SimpleGamepadCursor.reRepeatDelay
                if (val) this.#leftRepeatTimestamp = timestamp
                return val
            }
        } else if (this.#leftTimestamp > -1) return this.#hasStartedLeft = true
        else return false
    }
    get #shouldMoveRight () {
        let timestamp = this.#gamepad.timestamp
        if (!this.#rightInit) return false
        else if (this.#hasStartedRight) {
            if (this.#rightRepeatTimestamp == -1) {
                let val = timestamp - this.#rightTimestamp >= SimpleGamepadCursor.repeatDelay
                if (val) this.#rightRepeatTimestamp = timestamp
                return val
            } else {
                let val = timestamp - this.#rightRepeatTimestamp >= SimpleGamepadCursor.reRepeatDelay
                if (val) this.#rightRepeatTimestamp = timestamp
                return val
            }
        } else if (this.#rightTimestamp > -1) return this.#hasStartedRight = true
        else return false
    }
    get #shouldMoveUp () {
        let timestamp = this.#gamepad.timestamp
        if (!this.#upInit) return false
        else if (this.#hasStartedUp) {
            if (this.#upRepeatTimestamp == -1) {
                let val = timestamp - this.#upTimestamp >= SimpleGamepadCursor.repeatDelay
                if (val) this.#upRepeatTimestamp = timestamp
                return val
            } else {
                let val = timestamp - this.#upRepeatTimestamp >= SimpleGamepadCursor.reRepeatDelay
                if (val) this.#upRepeatTimestamp = timestamp
                return val
            }
        } else if (this.#upTimestamp > -1) return this.#hasStartedUp = true
        else return false
    }
    get #shouldMoveDown () {
        let timestamp = this.#gamepad.timestamp
        if (!this.#downInit) return false
        else if (this.#hasStartedDown) {
            if (this.#downRepeatTimestamp == -1) {
                let val = timestamp - this.#downTimestamp >= SimpleGamepadCursor.repeatDelay
                if (val) this.#downRepeatTimestamp = timestamp
                return val
            } else {
                let val = timestamp - this.#downRepeatTimestamp >= SimpleGamepadCursor.reRepeatDelay
                if (val) this.#downRepeatTimestamp = timestamp
                return val
            }
        } else if (this.#downTimestamp > -1) return this.#hasStartedDown = true
        else return false
    }
    get #shouldClick () {
        let timestamp = this.#gamepad.timestamp
        if (!this.#clickInit) return false
        else if (this.#hasStartedClick) {
            if (this.#clickRepeatTimestamp == -1) {
                let val = timestamp - this.#clickTimestamp >= SimpleGamepadCursor.repeatDelay
                if (val) this.#clickRepeatTimestamp = timestamp
                return val
            } else {
                let val = timestamp - this.#clickRepeatTimestamp >= SimpleGamepadCursor.reRepeatDelay
                if (val) this.#clickRepeatTimestamp = timestamp
                return val
            }
        } else if (this.#clickTimestamp > -1) return this.#hasStartedClick = true
        else return false
    }
}
