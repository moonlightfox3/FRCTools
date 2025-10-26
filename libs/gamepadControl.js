let gamepad = null
Gamepads.setConnectListener(gp => gamepad = gp)
Gamepads.setDisconnectListener(gp => gamepad = null)

function gamepadElCursorInit (isHorizontal, cursorEls, highlightCallback, unhighlightCallback, clickCallback) {
    gamepadCursorIsHorizontal = isHorizontal
    gamepadCursorEls = cursorEls
    gamepadElCursorHighlight = highlightCallback
    gamepadElCursorUnhighlight = unhighlightCallback
    gamepadElCursorClick = clickCallback
    gamepadUpdate()
}
let gamepadElCursorHighlight = el => {}
let gamepadElCursorUnhighlight = el => {}
let gamepadElCursorClick = el => {}

let gamepadCursorIsHorizontal = null
let gamepadCursorEls = null
let gamepadCursorPos = 0
let gamepadSeen = false
function gamepadUpdate () {
    if (gamepad == null) {
        gamepadElCursorUnhighlight(gamepadCursorEls[gamepadCursorPos])
        gamepadSeen = false
    } else {
        try { // 'try' is only needed here because some browsers don't reset the 'gamepad' variable after a page reload for some reason
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
                    gamepadElCursorUnhighlight(gamepadCursorEls[oldCursorPos])
                    gamepadElCursorHighlight(gamepadCursorEls[gamepadCursorPos])
                }
            } else gamepadElCursorHighlight(gamepadCursorEls[gamepadCursorPos])
            gamepadSeen = true

            if (gamepad.cursor.shouldClick) gamepadElCursorClick(gamepadCursorEls[gamepadCursorPos])
        } catch (er) {
            gamepad = null
        }
    }
    
    requestAnimationFrame(gamepadUpdate)
}
