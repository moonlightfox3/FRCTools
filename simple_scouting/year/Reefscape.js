matchNum.focus()
dataYear = 2025
dataElems = [
    matchNum, teamNum, robotCame, autoPastLine,
    autoCoralL1, autoCoralL1Miss, autoCoralL2, autoCoralL2Miss, autoCoralL3, autoCoralL3Miss, autoCoralL4, autoCoralL4Miss,
    autoAlgaeProc, autoAlgaeProcMiss, autoAlgaeNet, autoAlgaeNetMiss, autoAlgaeDesc, autoAlgaeDescMiss,
    opCoralL1, opCoralL1Miss, opCoralL2, opCoralL2Miss, opCoralL3, opCoralL3Miss, opCoralL4, opCoralL4Miss,
    opAlgaeProc, opAlgaeProcMiss, opAlgaeNet, opAlgaeNetMiss, opAlgaeDesc, opAlgaeDescMiss,
    [resistDefStrong, resistDefWeak, resistDefNone], [playDefActive, playDefPassive, playDefNone],
    [playDefStrenVWeak, playDefStrenWeak, playDefStrenAvg, playDefStrenStrong, playDefStrenVStrong, playDefStrenNone],
    [breakSec10, breakSec30, breakSec60, breakSecMore, breakSecNone],
    [endPosPark, endPosDeep, endPosShallow, endPosFail, endPosDeepFail, endPosShallowFail], notes,
]

const keys = {
    invertAction: ";",
    switchStageTeleop: " ",
    switchStageAuto: "b",
    toggleRobotCame: "t",
    toggleRobotAutoLeftStart: "y",
    focusNotesField: "p",
    coralL1Hit: "a",
    coralL2Hit: "s",
    coralL3Hit: "d",
    coralL4Hit: "f",
    coralL1Miss: "q",
    coralL2Miss: "w",
    coralL3Miss: "e",
    coralL4Miss: "r",
    algaeProcessorHit: "j",
    algaeNetHit: "k",
    algaeDescoreHit: "l",
    algaeProcessorMiss: "u",
    algaeNetMiss: "i",
    algaeDescoreMiss: "o",
    defenseResistance_None: "z",
    defenseResistance_Weak: "x",
    defenseResistance_Strong: "c",
    playingDefenseType_None: "v",
    playingDefenseType_Passive: "g",
    playingDefenseType_Active: "h",
    playingDefenseStrength_VeryWeak: "n",
    playingDefenseStrength_Weak: "m",
    playingDefenseStrength_Average: ",",
    playingDefenseStrength_Strong: ".",
    playingDefenseStrength_VeryStrong: "/",
    playingDefenseStrength_None: "'",
    secondsBroken_1To10: "3",
    secondsBroken_11To30: "4",
    secondsBroken_31To60: "8",
    secondsBroken_Over60: "9",
    secondsBroken_None: "0",
    endType_Park: "5",
    endType_Deep: "6",
    endType_Shallow: "7",
    saveData: "enter",
}
const gamepadKeys = {
    invertAction: "LBD",
    scoreMiss: "RBD",
    switchStageTeleop: "RBU",
    switchStageAuto: "LBU",
    toggleRobotCame: "ML",
    toggleRobotAutoLeftStart: "MR",
    focusNotesField: "LU",
    coralL1: "RU",
    coralL2: "RL",
    coralL3: "RD",
    coralL4: "RR",
    algaeProcessor: "LL",
    algaeNet: "LD",
    algaeDescore: "LR",
    saveData: "MM",
}
const keyNamesOverride = {
    switchStageTeleop: "Switch to teleop stage",
    switchStageAuto: "Switch to auto stage",
    toggleRobotCame: "Robot came (toggle)",
    toggleRobotAutoLeftStart: "Robot left starting line in auto (toggle)",
}
const keyNamesInvertedOverride = {
    coralL1Hit: "-1 Coral L1 hit",
    coralL2Hit: "-1 Coral L2 hit",
    coralL3Hit: "-1 Coral L3 hit",
    coralL4Hit: "-1 Coral L4 hit",
    coralL1Miss: "-1 Coral L1 miss",
    coralL2Miss: "-1 Coral L2 miss",
    coralL3Miss: "-1 Coral L3 miss",
    coralL4Miss: "-1 Coral L4 miss",
    algaeProcessorHit: "-1 Algae processor hit",
    algaeNetHit: "-1 Algae net hit",
    algaeDescoreHit: "-1 Algae descore hit",
    algaeProcessorMiss: "-1 Algae processor miss",
    algaeNetMiss: "-1 Algae net miss",
    algaeDescoreMiss: "-1 Algae descore miss",
    endType_Park: "End type - Park fail",
    endType_Deep: "End type - Deep fail",
    endType_Shallow: "End type - Shallow fail",
}
// Unused keys:
//  `, 1, 2, -, =, [, ], \
//  Backspace
let keyNames = {}
let keyNamesInverted = {}
for (let key of Object.keys(keys)) {
    let hasOverride = keyNamesOverride[key] != undefined, hasInvertedOverride = keyNamesInvertedOverride[key] != undefined
    let str = ""
    if (!hasOverride || !hasInvertedOverride) {
        for (let i = 0; i < key.length; i++) {
            let char = key[i]
            if (!isNaN(char) && char != " ") {
                if (i > 0 && key[i - 1].toLowerCase() == key[i - 1] && key[i - 1].toUpperCase() != key[i - 1]) str += " "
                str += char
            } else if (char.toUpperCase() == char && char.toLowerCase() != char) {
                if (i > 0 && key[i - 1] != "_") str += ` ${char.toLowerCase()}`
                else str += char
            } else if (char == "_") str += " - "
            else {
                if (i == 0) str += char.toUpperCase()
                else str += char
            }
        }
    }
    
    if (hasOverride) keyNames[key] = keyNamesOverride[key]
    else keyNames[key] = str
    if (hasInvertedOverride) keyNamesInverted[key] = keyNamesInvertedOverride[key]
    else keyNamesInverted[key] = str
}

let invertKeysKeyboard = false
let matchStageIsTeleopKeyboard = false
onkeydown = function (ev) {
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
    else if (key == keys.switchStageTeleop) matchStageIsTeleopKeyboard = true
    else if (key == keys.switchStageAuto) matchStageIsTeleopKeyboard = false
    else if (key == keys.toggleRobotCame) robotCame.checked = !robotCame.checked
    else if (key == keys.toggleRobotAutoLeftStart) autoPastLine.checked = !autoPastLine.checked
    else if (key == keys.focusNotesField) invertKeysKeyboard ? matchNum.focus() : notes.focus()
    else if (key == keys.coralL1Hit) modifyInputValueKeyboard(opCoralL1, autoCoralL1)
    else if (key == keys.coralL2Hit) modifyInputValueKeyboard(opCoralL2, autoCoralL2)
    else if (key == keys.coralL3Hit) modifyInputValueKeyboard(opCoralL3, autoCoralL3)
    else if (key == keys.coralL4Hit) modifyInputValueKeyboard(opCoralL4, autoCoralL4)
    else if (key == keys.coralL1Miss) modifyInputValueKeyboard(opCoralL1Miss, autoCoralL1Miss)
    else if (key == keys.coralL2Miss) modifyInputValueKeyboard(opCoralL2Miss, autoCoralL2Miss)
    else if (key == keys.coralL3Miss) modifyInputValueKeyboard(opCoralL3Miss, autoCoralL3Miss)
    else if (key == keys.coralL4Miss) modifyInputValueKeyboard(opCoralL4Miss, autoCoralL4Miss)
    else if (key == keys.algaeProcessorHit) modifyInputValueKeyboard(opAlgaeProc, autoAlgaeProc)
    else if (key == keys.algaeNetHit) modifyInputValueKeyboard(opAlgaeNet, autoAlgaeNet)
    else if (key == keys.algaeDescoreHit) modifyInputValueKeyboard(opAlgaeDesc, autoAlgaeDesc)
    else if (key == keys.algaeProcessorMiss) modifyInputValueKeyboard(opAlgaeProcMiss, autoAlgaeProcMiss)
    else if (key == keys.algaeNetMiss) modifyInputValueKeyboard(opAlgaeNetMiss, autoAlgaeNetMiss)
    else if (key == keys.algaeDescoreMiss) modifyInputValueKeyboard(opAlgaeDescMiss, autoAlgaeDescMiss)
    else if (key == keys.defenseResistance_None) resistDefNone.checked = true
    else if (key == keys.defenseResistance_Weak) resistDefWeak.checked = true
    else if (key == keys.defenseResistance_Strong) resistDefStrong.checked = true
    else if (key == keys.playingDefenseType_None) playDefNone.checked = true
    else if (key == keys.playingDefenseType_Passive) playDefPassive.checked = true
    else if (key == keys.playingDefenseType_Active) playDefActive.checked = true
    else if (key == keys.playingDefenseStrength_VeryWeak) playDefStrenVWeak.checked = true
    else if (key == keys.playingDefenseStrength_Weak) playDefStrenWeak.checked = true
    else if (key == keys.playingDefenseStrength_Average) playDefStrenAvg.checked = true
    else if (key == keys.playingDefenseStrength_Strong) playDefStrenStrong.checked = true
    else if (key == keys.playingDefenseStrength_VeryStrong) playDefStrenVStrong.checked = true
    else if (key == keys.playingDefenseStrength_None) playDefStrenNone.checked = true
    else if (key == keys.secondsBroken_1To10) breakSec10.checked = true
    else if (key == keys.secondsBroken_11To30) breakSec30.checked = true
    else if (key == keys.secondsBroken_31To60) breakSec60.checked = true
    else if (key == keys.secondsBroken_Over60) breakSecMore.checked = true
    else if (key == keys.secondsBroken_None) breakSecNone.checked = true
    else if (key == keys.endType_Park) invertKeysKeyboard ? endPosFail.checked = true : endPosPark.checked = true
    else if (key == keys.endType_Deep) invertKeysKeyboard ? endPosDeepFail.checked = true : endPosDeep.checked = true
    else if (key == keys.endType_Shallow) invertKeysKeyboard ? endPosShallowFail.checked = true : endPosShallow.checked = true
    else if (key == keys.saveData) downloadData()

    else shouldCancel = false
    if (shouldCancel) ev.preventDefault()
}
onkeyup = function (ev) {
    let key = ev.key.toLowerCase()
    if (key == keys.invertAction) invertKeysKeyboard = false
}
function modifyInputValueKeyboard (inputTeleop, inputAuto) {
    let val = invertKeysKeyboard ? -1 : 1
    if (matchStageIsTeleopKeyboard) inputTeleop.value = parseInt(inputTeleop.value) + val
    else inputAuto.value = parseInt(inputAuto.value) + val
}

let invertKeysGamepad = false
let scoreMissGamepad = false
let matchStageIsTeleopGamepad = false
function checkGamepad () {
    if (!gamepad.cursor.isClickReady) return

    let buttons = gamepad.buttonsNamed
    invertKeysGamepad = buttons[gamepadKeys.invertAction] > 0
    scoreMissGamepad = buttons[gamepadKeys.scoreMiss] > 0
}
function onGamepadPress (key) {
    if (!gamepad.cursor.isClickReady) return
    
    if (key == gamepadKeys.switchStageTeleop) matchStageIsTeleopGamepad = true
    else if (key == gamepadKeys.switchStageAuto) matchStageIsTeleopGamepad = false
    else if (key == gamepadKeys.toggleRobotCame) robotCame.checked = !robotCame.checked
    else if (key == gamepadKeys.toggleRobotAutoLeftStart) autoPastLine.checked = !autoPastLine.checked
    else if (key == gamepadKeys.focusNotesField) {
        if (invertKeysGamepad) {
            if (document.activeElement == matchNum) teamNum.focus()
            else matchNum.focus()
        } else {
            if (document.activeElement == notes) notes.blur()
            else notes.focus()
        }
    } else if (key == gamepadKeys.coralL1) modifyInputValueGamepad(opCoralL1, opCoralL1Miss, autoCoralL1, autoCoralL1Miss)
    else if (key == gamepadKeys.coralL2) modifyInputValueGamepad(opCoralL2, opCoralL2Miss, autoCoralL2, autoCoralL2Miss)
    else if (key == gamepadKeys.coralL3) modifyInputValueGamepad(opCoralL3, opCoralL3Miss, autoCoralL3, autoCoralL3Miss)
    else if (key == gamepadKeys.coralL4) modifyInputValueGamepad(opCoralL4, opCoralL4Miss, autoCoralL4, autoCoralL4Miss)
    else if (key == gamepadKeys.algaeProcessor) modifyInputValueGamepad(opAlgaeProc, opAlgaeProcMiss, autoAlgaeProc, autoAlgaeProcMiss)
    else if (key == gamepadKeys.algaeNet) modifyInputValueGamepad(opAlgaeNet, opAlgaeNetMiss, autoAlgaeNet, autoAlgaeNetMiss)
    else if (key == gamepadKeys.algaeDescore) modifyInputValueGamepad(opAlgaeDesc, opAlgaeDescMiss, autoAlgaeDesc, autoAlgaeDescMiss)
    else if (key == gamepadKeys.saveData) downloadData()
}
gamepadLoopInit(checkGamepad)
gamepadPressListenerInit(onGamepadPress, key => {})
function modifyInputValueGamepad (inputTeleopHit, inputTeleopMiss, inputAutoHit, inputAutoMiss) {
    let val = invertKeysGamepad ? -1 : 1
    if (matchStageIsTeleopGamepad) {
        if (scoreMissGamepad) inputTeleopMiss.value = parseInt(inputTeleopMiss.value) + val
        else inputTeleopHit.value = parseInt(inputTeleopHit.value) + val
    } else {
        if (scoreMissGamepad) inputAutoMiss.value = parseInt(inputAutoMiss.value) + val
        else inputAutoHit.value = parseInt(inputAutoHit.value) + val
    }
}

onbeforeunload = function (ev) {
    let formChanged =
        matchNum.value != "" || teamNum.value != "" || !robotCame.checked || !autoPastLine.checked ||
        autoCoralL1.value != "0" || autoCoralL2.value != "0" || autoCoralL3.value != "0" || autoCoralL4.value != "0" ||
        autoCoralL1Miss.value != "0" || autoCoralL2Miss.value != "0" || autoCoralL3Miss.value != "0" || autoCoralL4Miss.value != "0" ||
        autoAlgaeProc.value != "0" || autoAlgaeNet.value != "0" || autoAlgaeDesc.value != "0" ||
        autoAlgaeProcMiss.value != "0" || autoAlgaeNetMiss.value != "0" || autoAlgaeDescMiss.value != "0" ||
        opCoralL1.value != "0" || opCoralL2.value != "0" || opCoralL3.value != "0" || opCoralL4.value != "0" ||
        opCoralL1Miss.value != "0" || opCoralL2Miss.value != "0" || opCoralL3Miss.value != "0" || opCoralL4Miss.value != "0" ||
        opAlgaeProc.value != "0" || opAlgaeNet.value != "0" || opAlgaeDesc.value != "0" ||
        opAlgaeProcMiss.value != "0" || opAlgaeNetMiss.value != "0" || opAlgaeDescMiss.value != "0" ||
        !resistDefNone.checked || !playDefNone.checked || !playDefStrenNone.checked || !breakSecNone.checked || !endPosFail.checked ||
        notes.value != ""
    if (formChanged) ev.preventDefault()
}
