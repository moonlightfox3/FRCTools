function indexCursorInit (isHorizontal, cursorEls, highlightCallback, unhighlightCallback, clickCallback) {
    gamepadCursorIsHorizontal = isHorizontal
    gamepadCursorEls = cursorEls
    indexCursorHighlight = highlightCallback
    indexCursorUnhighlight = unhighlightCallback
    indexCursorClick = clickCallback
    gamepadUpdate()
}
let indexCursorHighlight = el => {}
let indexCursorUnhighlight = el => {}
let indexCursorClick = el => {}

let gamepad = null
Gamepads.setConnectListener(gp => gamepad = gp)
Gamepads.setDisconnectListener(gp => gamepad = null)

let gamepadCursorIsHorizontal = null
let gamepadCursorEls = null
let gamepadCursorPos = 0
let gamepadSeen = false
function gamepadUpdate () {
    if (gamepad == null) {
        indexCursorUnhighlight(gamepadCursorEls[gamepadCursorPos])
        gamepadSeen = false
    } else {
        try { // 'try' is only needed here because some browsers don't reset the 'gamepad' variable for some reason
            gamepad.cursor.update()
            
            if (gamepadSeen) {
                let oldCursorPos = gamepadCursorPos
                if (gamepadCursorIsHorizontal) {
                    if (gamepad.cursor.shouldMoveLeft && gamepadCursorPos > 0) gamepadCursorPos--
                    if (gamepad.cursor.shouldMoveRight && gamepadCursorPos < gamepadCursorEls.length - 1) gamepadCursorPos++
                } else {
                    if (gamepad.cursor.shouldMoveUp && gamepadCursorPos > 0) gamepadCursorPos--
                    if (gamepad.cursor.shouldMoveDown && gamepadCursorPos < gamepadCursorEls.length - 1) gamepadCursorPos++
                }

                if (gamepadCursorPos != oldCursorPos) {
                    indexCursorUnhighlight(gamepadCursorEls[oldCursorPos])
                    indexCursorHighlight(gamepadCursorEls[gamepadCursorPos])
                }
            } else indexCursorHighlight(gamepadCursorEls[gamepadCursorPos])
            gamepadSeen = true

            if (gamepad.cursor.shouldClick) indexCursorClick(gamepadCursorEls[gamepadCursorPos])
        } catch (er) {
            gamepad = null
        }
    }
    
    requestAnimationFrame(gamepadUpdate)
}
