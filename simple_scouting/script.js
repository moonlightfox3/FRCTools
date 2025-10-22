const isPWA = matchMedia("(display-mode: standalone)").matches
if (isPWA) {
    resizeTo(1090, 580)

    if (window.launchQueue != undefined) {
        launchQueue.setConsumer(function (params) {
            console.debug(params)
        })
    }
}

// Keys don't trigger if either the match number input box, team number input box, or notes input box are focused
// Keys can be rebound - there's always list of keys on the right side of the screen, which can be scrolled through if needed, and that can be changed anytime (and will save to localstorage)
// Tab key used for element navigation
// 
// Enter match number (ex. Qual 1) and team number (ex. 1234) first
// Also enter if the robot showed up (toggle, default true) and if the robot left the starting line in auto (toggle, default true)
// Default keys:
//  ; - Invert action where applicable (hold + press other key, ex. Coral L1 hit -> -1 Coral L1 hit)
//  Space - Switch stage (teleop, invert: auto)
//  P - Focus notes field
//  A - Coral L1 hit
//  S - Coral L2 hit
//  D - Coral L3 hit
//  F - Coral L4 hit
//  Q - Coral L1 miss
//  W - Coral L2 miss
//  E - Coral L3 miss
//  R - Coral L4 miss
//  J - Algae processor hit
//  K - Algae net hit
//  L - Algae descore hit
//  U - Algae processor miss
//  I - Algae net miss
//  O - Algae descore miss
//  Z - Resisting from defense (none)
//  X - Resisting from defense (weak)
//  C - Resisting from defense (strong)
//  V - Playing defense type (none)
//  G - Playing defense type (passive)
//  H - Playing defense type (active)
//  N - Seconds broken down (1-10)
//  M - Seconds broken down (11-30)
//  , - Seconds broken down (31-60)
//  . - Seconds broken down (61+)
//  / - Seconds broken down (none)
//  2 - Playing defense strength (very weak)
//  3 - Playing defense strength (weak)
//  4 - Playing defense strength (average)
//  8 - Playing defense strength (strong)
//  9 - Playing defense strength (very strong)
//  0 - Playing defense strength (none)
// Unused keys:
//  T, Y, B
//  1, 5, 6, 7
//  `, -, =, [, ], \, '
//  Shift, Ctrl, Alt, Backspace, Enter
// Enter the ending type after (park, deep, deep fail, shallow, shallow fail, fail)
// Also enter notes (large input box)
