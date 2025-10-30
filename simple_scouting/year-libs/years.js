matchNum.focus()

let keys = null // 'invertAction' and 'saveData' are required here
let gamepadKeys = null // 'invertAction', 'scoreMiss', and 'saveData' are required here
let handleKey = key => {}
let handleKeyGamepad = key => {}

let invertKeysKeyboard = false
let matchStageIsTeleopKeyboard = false
onkeydown = function (ev) {
    if (keys == null) return
    if (ev.repeat) return
    if (ev.ctrlKey || ev.altKey || ev.metaKey) return

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
    if (document.activeElement == matchNum || document.activeElement == teamNum || document.activeElement == notes) return
    let shouldCancel = true

    if (key == keys.invertAction) invertKeysKeyboard = true
    else if (key == keys.saveData) downloadData()
    else if (handleKey(key)) null

    else shouldCancel = false
    if (shouldCancel) ev.preventDefault()
}
onkeyup = function (ev) {
    if (keys == null) return

    let key = ev.key.toLowerCase()
    if (key == keys.invertAction) invertKeysKeyboard = false
}
function modifyInputValueKeyboard (inputTeleop, inputAuto = inputTeleop) {
    let val = invertKeysKeyboard ? -1 : 1
    if (matchStageIsTeleopKeyboard) inputTeleop.value = parseInt(inputTeleop.value) + val
    else inputAuto.value = parseInt(inputAuto.value) + val
}

let invertKeysGamepad = false
let scoreMissGamepad = false
let matchStageIsTeleopGamepad = false
function checkGamepad () {
    if (gamepadKeys == null) return
    if (!gamepad.cursor.isClickReady) return

    let buttons = gamepad.buttonsNamed
    invertKeysGamepad = buttons[gamepadKeys.invertAction] > 0
    scoreMissGamepad = buttons[gamepadKeys.scoreMiss] > 0
}
function onGamepadPress (key) {
    if (gamepadKeys == null) return
    if (!gamepad.cursor.isClickReady) return
    
    if (key == gamepadKeys.saveData) downloadData()
    else if (handleKeyGamepad(key)) null
}
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
gamepadLoopInit(checkGamepad)
gamepadPressListenerInit(onGamepadPress, key => {})

saveData.onclick = () => downloadData()
onbeforeunload = function (ev) {
    if (getFormChanged()) ev.preventDefault()
}
