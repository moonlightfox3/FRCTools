let gamepad = null
Gamepads.addConnectListener(gp => gamepad = gp)
Gamepads.addDisconnectListener(gp => gamepad = null)

function gamepadElCursorInit (isHorizontal, cursorEls, highlightCallback, unhighlightCallback, clickCallback) {
    gamepadCursorIsHorizontal = isHorizontal
    gamepadCursorEls = cursorEls
    gamepadElCursorHighlight = highlightCallback
    gamepadElCursorUnhighlight = unhighlightCallback
    gamepadElCursorClick = clickCallback
}
let gamepadElCursorHighlight = el => {}
let gamepadElCursorUnhighlight = el => {}
let gamepadElCursorClick = el => {}

function gamepadLoopInit (loopCallback) {
    gamepadLoop = loopCallback
}
let gamepadLoop = () => {}

function gamepadPressListenerInit (pressCallback, unpressCallback) {
    gamepadPressCallback = pressCallback
    gamepadUnpressCallback = unpressCallback
}
let gamepadPressCallback = key => {}
let gamepadUnpressCallback = key => {}

let gamepadSeen = false
let gamepadCursorIsHorizontal = true
let gamepadCursorEls = []
let gamepadCursorPos = 0
let prevGamepadButtons = null
function gamepadUpdate () {
    requestAnimationFrame(gamepadUpdate)

    if (gamepad == null) {
        if (gamepadSeen) {
            gamepadElCursorUnhighlight(gamepadCursorEls[gamepadCursorPos])
            prevGamepadButtons = null
        }
        gamepadSeen = false
    } else {
        try { // 'try' is only needed here because some browsers don't reset the 'gamepad' variable after a page reload
            gamepad.cursor.update()
        } catch (er) {
            gamepad = null
            return
        }

        if (gamepadCursorEls.length > 0) {
            if (gamepadSeen) {
                let oldCursorPos = gamepadCursorPos
                if (gamepadCursorIsHorizontal) {
                    if (gamepad.cursor.isLeft && gamepadCursorPos > 0) gamepadCursorPos--
                    if (gamepad.cursor.isRight && gamepadCursorPos < gamepadCursorEls.length - 1) gamepadCursorPos++
                } else {
                    if (gamepad.cursor.isUp && gamepadCursorPos > 0) gamepadCursorPos--
                    if (gamepad.cursor.isDown && gamepadCursorPos < gamepadCursorEls.length - 1) gamepadCursorPos++
                }

                if (gamepadCursorPos != oldCursorPos) {
                    gamepadElCursorUnhighlight(gamepadCursorEls[oldCursorPos])
                    gamepadElCursorHighlight(gamepadCursorEls[gamepadCursorPos])
                }
            } else gamepadElCursorHighlight(gamepadCursorEls[gamepadCursorPos])

            if (gamepad.cursor.isClick) gamepadElCursorClick(gamepadCursorEls[gamepadCursorPos])
        }

        let buttons = gamepad.buttonsNamed
        for (let name of Object.keys(buttons)) {
            let val = buttons[name]
            if (val > 0 && (prevGamepadButtons == null || prevGamepadButtons[name] == 0)) gamepadPressCallback(name)
            else if (val == 0 && (prevGamepadButtons == null || prevGamepadButtons[name] > 0)) gamepadUnpressCallback(name)
        }
        prevGamepadButtons = buttons
    
        gamepadLoop()
        gamepadSeen = true
    }
}
gamepadUpdate()
