// Autofocus (using the 'autofocus' element attribute can be annoying for users on iPhones)
matchNum.focus()

// Externally set config
let keys = null // 'invertAction' and 'saveData' are required here
let gamepadKeys = null // 'invertAction', 'scoreMiss', and 'saveData' are required here
let handleKey = key => {}
let handleKeyGamepad = key => {}

// Keyboard
let invertKeysKeyboard = false
let matchStageIsTeleopKeyboard = false
onkeydown = function (ev) {
    // Should the key be processed?
    if (keys == null) return
    if (ev.repeat) return
    if (ev.ctrlKey || ev.altKey || ev.metaKey) return

    // Special keys
    let key = ev.key.toLowerCase()
    if (key == "escape") return document.activeElement.blur()
    else if (key == "tab") {
        ev.preventDefault()
        if (document.activeElement == notes) {
            let pos = notes.selectionStart
            notes.value = notes.value.substring(0, pos) + " ".repeat(4) + notes.value.substring(notes.selectionEnd)
            notes.selectionStart = notes.selectionEnd = pos + 4
        } else if (document.activeElement == matchNum) teamNum.focus()
        else matchNum.focus()
        return
    }
    // Don't check the key if an input element is focused
    if (document.activeElement == matchNum || document.activeElement == teamNum || document.activeElement == notes) return
    let shouldCancel = true

    // Check the key
    if (key == keys.invertAction) invertKeysKeyboard = true
    else if (key == keys.saveData) downloadData()
    else if (handleKey(key)) null

    // Cancel if needed
    else shouldCancel = false
    if (shouldCancel) ev.preventDefault()
}
onkeyup = function (ev) {
    // Should the key be processed?
    if (keys == null) return

    // Check the key
    let key = ev.key.toLowerCase()
    if (key == keys.invertAction) invertKeysKeyboard = false
}
// Helper function for increasing/decreasing number inputs
function modifyInputValueKeyboard (inputTeleop, inputAuto = inputTeleop) {
    let val = invertKeysKeyboard ? -1 : 1
    if (matchStageIsTeleopKeyboard) inputTeleop.value = parseInt(inputTeleop.value) + val
    else inputAuto.value = parseInt(inputAuto.value) + val
}

// Gamepad
let invertKeysGamepad = false
let scoreMissGamepad = false
let matchStageIsTeleopGamepad = false
function checkGamepad () {
    // Should the buttons be processed?
    if (gamepadKeys == null) return
    if (!gamepad.cursor.isClickReady) return

    // Check the buttons
    let buttons = gamepad.buttonsNamed
    invertKeysGamepad = buttons[gamepadKeys.invertAction] > 0
    scoreMissGamepad = buttons[gamepadKeys.scoreMiss] > 0
}
function onGamepadPress (key) {
    // Should the buttons be processed?
    if (gamepadKeys == null) return
    if (!gamepad.cursor.isClickReady) return
    
    // Check the buttons
    if (key == gamepadKeys.saveData) downloadData()
    else if (handleKeyGamepad(key)) null
}
// Helper function for increasing/decreasing number inputs
function modifyInputValueGamepad (inputTeleopHit, inputTeleopMiss, inputAutoHit = inputTeleopHit, inputAutoMiss = inputTeleopMiss) {
    let val = invertKeysGamepad ? -1 : 1
    if (matchStageIsTeleopGamepad) {
        if (scoreMissGamepad) inputTeleopMiss.value = parseInt(inputTeleopMiss.value) + val
        else inputTeleopHit.value = parseInt(inputTeleopHit.value) + val
    } else {
        if (scoreMissGamepad) inputAutoMiss.value = parseInt(inputAutoMiss.value) + val
        else inputAutoHit.value = parseInt(inputAutoHit.value) + val
    }
}
// Get the gamepad
gamepadLoopInit(checkGamepad)
gamepadPressListenerInit(onGamepadPress, key => {})

// Download file
saveData.onclick = () => downloadData()
// Prompt before leaving the page, if any form element was changed
onbeforeunload = function (ev) {
    if (getFormChanged()) ev.preventDefault()
}
