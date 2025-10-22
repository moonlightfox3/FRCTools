const isPWA = matchMedia("(display-mode: standalone)").matches
if (isPWA) {
    resizeTo(1090, 580)

    if (window.launchQueue != undefined) {
        launchQueue.setConsumer(async function (params) {
            let files = params.files
            let file = await files[0].getFile()
            let buf = await file.arrayBuffer()
            handleDataImport(buf)
        })
    }
}
function handleDataImport (buf) { // TODO
    console.debug("Data import:", buf)
}

let keys = {
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
    secondsBroken_1To10: "n",
    secondsBroken_11To30: "m",
    secondsBroken_31To60: ",",
    secondsBroken_Over60: ".",
    secondsBroken_None: "/",
    playingDefenseStrength_VeryWeak: "2",
    playingDefenseStrength_Weak: "3",
    playingDefenseStrength_Average: "4",
    playingDefenseStrength_Strong: "8",
    playingDefenseStrength_VeryStrong: "9",
    playingDefenseStrength_None: "0",
    endType_Park: "5",
    endType_Deep: "6",
    endType_Shallow: "7",
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
//  1, `, -, =, [, ], \, '
//  Shift, Ctrl, Alt, Backspace, Enter

//
// Keys don't trigger if either the match number input box, team number input box, or notes input box are focused
// Keys can be rebound (and will save to LocalStorage)
// 
// Enter match number (ex. Qual 1) and team number (ex. 1234) before the match
// Enter notes (large input box) after the match

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

let invertKeys = false
onkeydown = function (ev) {
    if (ev.repeat) return
    let key = ev.key.toLowerCase()

    if (key == keys.invertAction) invertKeys = true
}
onkeyup = function (ev) {
    let key = ev.key.toLowerCase()

    if (key == keys.invertAction) invertKeys = false
}
