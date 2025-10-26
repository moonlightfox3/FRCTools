let gamepad = null
Gamepads.addConnectListener(gp => gamepad = gp)
Gamepads.addDisconnectListener(gp => gamepad = null)

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
            gamepadSeen = true

            if (gamepad.cursor.isClick) gamepadElCursorClick(gamepadCursorEls[gamepadCursorPos])
        } catch (er) {
            gamepad = null
        }
    }
    
    requestAnimationFrame(gamepadUpdate)
}
