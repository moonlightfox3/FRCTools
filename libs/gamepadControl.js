// Get the gamepad
let gamepad = null
Gamepads.addConnectListener(gp => gamepad = gp)
Gamepads.addDisconnectListener(gp => gamepad = null)

// Gamepad cursor - callbacks
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

// Gamepad loop - callbacks
function gamepadLoopInit (loopCallback) {
    gamepadLoop = loopCallback
}
let gamepadLoop = () => {}

// Gamepad buttons - callbacks
function gamepadPressListenerInit (pressCallback, unpressCallback) {
    gamepadPressCallback = pressCallback
    gamepadUnpressCallback = unpressCallback
}
let gamepadPressCallback = key => {}
let gamepadUnpressCallback = key => {}

// Gamepad update loop
let gamepadSeen = false
let gamepadCursorIsHorizontal = true
let gamepadCursorEls = []
let gamepadCursorPos = 0
let prevGamepadButtons = null
function gamepadUpdate () {
    // Loop (at the top of the function to allow return statements)
    requestAnimationFrame(gamepadUpdate)

    // Is a gamepad connected?
    if (gamepad == null) {
        // Reset if necessary
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

        // Cursor
        if (gamepadCursorEls.length > 0) {
            // Init if needed
            if (gamepadSeen) {
                let oldCursorPos = gamepadCursorPos
                // Moving direction
                if (gamepadCursorIsHorizontal) {
                    if (gamepad.cursor.isLeft && gamepadCursorPos > 0) gamepadCursorPos--
                    if (gamepad.cursor.isRight && gamepadCursorPos < gamepadCursorEls.length - 1) gamepadCursorPos++
                } else {
                    if (gamepad.cursor.isUp && gamepadCursorPos > 0) gamepadCursorPos--
                    if (gamepad.cursor.isDown && gamepadCursorPos < gamepadCursorEls.length - 1) gamepadCursorPos++
                }

                // Did the cursor move?
                if (gamepadCursorPos != oldCursorPos) {
                    gamepadElCursorUnhighlight(gamepadCursorEls[oldCursorPos])
                    gamepadElCursorHighlight(gamepadCursorEls[gamepadCursorPos])
                }
            } else gamepadElCursorHighlight(gamepadCursorEls[gamepadCursorPos])

            // Click element
            if (gamepad.cursor.isClick) gamepadElCursorClick(gamepadCursorEls[gamepadCursorPos])
        }

        // Buttons
        let buttons = gamepad.buttonsNamed
        for (let name of Object.keys(buttons)) {
            let val = buttons[name]
            // Was a button just pressed or unpressed?
            if (val > 0 && (prevGamepadButtons == null || prevGamepadButtons[name] == 0)) gamepadPressCallback(name)
            else if (val == 0 && (prevGamepadButtons == null || prevGamepadButtons[name] > 0)) gamepadUnpressCallback(name)
        }
        prevGamepadButtons = buttons
    
        // Other loop
        gamepadLoop()
        gamepadSeen = true
    }
}
// Start loop
gamepadUpdate()
