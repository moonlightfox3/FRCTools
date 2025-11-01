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
    // Button names
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
        // Convert a list of numbers to a list of number pairs
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
        if (vibration == undefined) return false // Unsupported

        await vibration.playEffect("dual-rumble", {
            duration,
            strongMagnitude: strength,
            weakMagnitude: strength,
        })
        return true
    }
    async stopVibrate () {
        let vibration = this.#get.vibrationActuator
        if (vibration == undefined) return false // Unsupported

        await vibration.reset()
        return true
    }

    get cursor () {
        return this.#cursor
    }
}
class SimpleGamepadCursor {
    // Config
    static repeatDelay = 500
    static reRepeatDelay = 50
    static deadzone = 0.6

    #gamepad
    constructor (gamepad) {
        this.#gamepad = gamepad
    }

    update () {
        let timestamp = this.#gamepad.timestamp
        
        // Update joysticks
        let joystick = this.#gamepad.joysticksNamed.left
        // Left
        if (this.#leftInit == false) this.#leftInit = joystick.x >= -SimpleGamepadCursor.deadzone
        else if (this.#leftTimestamp == -1) this.#leftTimestamp = joystick.x < -SimpleGamepadCursor.deadzone ? timestamp : -1
        else if (joystick.x >= -SimpleGamepadCursor.deadzone) this.#leftTimestamp = -1, this.#leftRepeatTimestamp = -1, this.#hasStartedLeft = false

        // Right
        if (this.#rightInit == false) this.#rightInit = joystick.x <= SimpleGamepadCursor.deadzone
        else if (this.#rightTimestamp == -1) this.#rightTimestamp = joystick.x > SimpleGamepadCursor.deadzone ? timestamp : -1
        else if (joystick.x <= SimpleGamepadCursor.deadzone) this.#rightTimestamp = -1, this.#rightRepeatTimestamp = -1, this.#hasStartedRight = false

        // Up
        if (this.#upInit == false) this.#upInit = joystick.y >= -SimpleGamepadCursor.deadzone
        else if (this.#upTimestamp == -1) this.#upTimestamp = joystick.y < -SimpleGamepadCursor.deadzone ? timestamp : -1
        else if (joystick.y >= -SimpleGamepadCursor.deadzone) this.#upTimestamp = -1, this.#upRepeatTimestamp = -1, this.#hasStartedUp = false

        // Down
        if (this.#downInit == false) this.#downInit = joystick.y <= SimpleGamepadCursor.deadzone
        else if (this.#downTimestamp == -1) this.#downTimestamp = joystick.y > SimpleGamepadCursor.deadzone ? timestamp : -1
        else if (joystick.y <= SimpleGamepadCursor.deadzone) this.#downTimestamp = -1, this.#downRepeatTimestamp = -1, this.#hasStartedDown = false

        // Update buttons
        let isClicking = this.#gamepad.buttons.findIndex(val => val > 0) > -1
        // Clicking
        if (this.#clickInit == false) this.#clickInit = !isClicking
        else if (this.#clickTimestamp == -1) this.#clickTimestamp = isClicking ? timestamp : -1
        else if (!isClicking) this.#clickTimestamp = -1, this.#clickRepeatTimestamp = -1, this.#hasStartedClick = false

        // Update public variables
        this.isLeftReady = this.#leftInit, this.isRightReady = this.#rightInit, this.isUpReady = this.#upInit, this.isDownReady = this.#downInit, this.isClickReady = this.#clickInit
        this.isLeftRepeat = this.#hasStartedLeft, this.isRightRepeat = this.#hasStartedRight, this.isUpRepeat = this.#hasStartedUp, this.isDownRepeat = this.#hasStartedDown, this.isClickRepeat = this.#hasStartedClick
        this.isLeft = this.#shouldMoveLeft, this.isRight = this.#shouldMoveRight, this.isUp = this.#shouldMoveUp, this.isDown = this.#shouldMoveDown, this.isClick = this.#shouldClick
    }
    
    // Public variables
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

    // Private variables - timestamps, etc.
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

    // Check gamepad
    get #shouldMoveLeft () {
        let timestamp = this.#gamepad.timestamp
        if (!this.#leftInit) return false
        else if (this.#hasStartedLeft) {
            let shouldRepeat = null
            if (this.#leftRepeatTimestamp == -1) shouldRepeat = timestamp - this.#leftTimestamp >= SimpleGamepadCursor.repeatDelay
            else shouldRepeat = timestamp - this.#leftRepeatTimestamp >= SimpleGamepadCursor.reRepeatDelay
            
            if (shouldRepeat) this.#leftRepeatTimestamp = timestamp
            return shouldRepeat
        } else if (this.#leftTimestamp > -1) return this.#hasStartedLeft = true
        else return false
    }
    get #shouldMoveRight () {
        let timestamp = this.#gamepad.timestamp
        if (!this.#rightInit) return false
        else if (this.#hasStartedRight) {
            let shouldRepeat = null
            if (this.#rightRepeatTimestamp == -1) shouldRepeat = timestamp - this.#rightTimestamp >= SimpleGamepadCursor.repeatDelay
            else shouldRepeat = timestamp - this.#rightRepeatTimestamp >= SimpleGamepadCursor.reRepeatDelay
            
            if (shouldRepeat) this.#rightRepeatTimestamp = timestamp
            return shouldRepeat
        } else if (this.#rightTimestamp > -1) return this.#hasStartedRight = true
        else return false
    }
    get #shouldMoveUp () {
        let timestamp = this.#gamepad.timestamp
        if (!this.#upInit) return false
        else if (this.#hasStartedUp) {
            let shouldRepeat = null
            if (this.#upRepeatTimestamp == -1) shouldRepeat = timestamp - this.#upTimestamp >= SimpleGamepadCursor.repeatDelay
            else shouldRepeat = timestamp - this.#upRepeatTimestamp >= SimpleGamepadCursor.reRepeatDelay
            
            if (shouldRepeat) this.#upRepeatTimestamp = timestamp
            return shouldRepeat
        } else if (this.#upTimestamp > -1) return this.#hasStartedUp = true
        else return false
    }
    get #shouldMoveDown () {
        let timestamp = this.#gamepad.timestamp
        if (!this.#downInit) return false
        else if (this.#hasStartedDown) {
            let shouldRepeat = null
            if (this.#downRepeatTimestamp == -1) shouldRepeat = timestamp - this.#downTimestamp >= SimpleGamepadCursor.repeatDelay
            else shouldRepeat = timestamp - this.#downRepeatTimestamp >= SimpleGamepadCursor.reRepeatDelay
            
            if (shouldRepeat) this.#downRepeatTimestamp = timestamp
            return shouldRepeat
        } else if (this.#downTimestamp > -1) return this.#hasStartedDown = true
        else return false
    }
    get #shouldClick () {
        let timestamp = this.#gamepad.timestamp
        if (!this.#clickInit) return false
        else if (this.#hasStartedClick) {
            let shouldRepeat = null
            if (this.#clickRepeatTimestamp == -1) shouldRepeat = timestamp - this.#clickTimestamp >= SimpleGamepadCursor.repeatDelay
            else shouldRepeat = timestamp - this.#clickRepeatTimestamp >= SimpleGamepadCursor.reRepeatDelay
            
            if (shouldRepeat) this.#clickRepeatTimestamp = timestamp
            return shouldRepeat
        } else if (this.#clickTimestamp > -1) return this.#hasStartedClick = true
        else return false
    }
}
