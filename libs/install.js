// Platform
const isPWA = matchMedia("(display-mode: standalone)").matches
const isIphone = navigator.platform == "iPhone"

// Theme color (titlebar color on computers, second background color on iPhones)
let themeColorEl = null
function setThemeColor (color) {
    // Make sure this is a PWA
    if (!isPWA) return
    if (themeColorEl == null) {
        // Use a <meta> element
        themeColorEl = document.createElement("meta")
        themeColorEl.name = "theme-color"
        document.head.append(themeColorEl)
    }
    themeColorEl.content = color
}
function resetThemeColor () {
    // Make sure this is a PWA
    if (!isPWA) return
    if (themeColorEl != null) {
        themeColorEl.remove()
        themeColorEl = null
    }
}

// Install button
let displayInstallButton = () => {}
if (!isPWA) {
    let installButton = null
    function showInstallButton (clickCallback) {
        hideInstallButton()

        installButton = document.createElement("button")
        installButton.innerText = "Install"
        installButton.style.position = "sticky"
        installButton.style.left = "calc(100% - 50px)"
        installButton.style.top = "calc(100% - 30px)"
        installButton.style.backgroundColor = "lightgray"
        installButton.style.color = "black"
        installButton.style.borderRadius = "5px"
        installButton.style.cursor = "pointer"
        installButton.onclick = () => clickCallback()
        document.body.append(installButton)
    }
    function hideInstallButton () {
        if (installButton != null) {
            installButton.remove()
            installButton = null
        }
    }
    addEventListener("appinstalled", () => hideInstallButton())

    displayInstallButton = function () {
        if (isIphone) {
            // Automatic installation isn't supported on iPhones
            showInstallButton(function () {
alert(`\
Manual installation is required on iPhones!
1. Press the browser share/export button.
2. Scroll down and click 'Add to Home Screen'.
3. Click 'Add'.\
`)
            })
        } else {
            // Catch automatic installation event
            addEventListener("beforeinstallprompt", function (ev) {
                ev.preventDefault()
                showInstallButton(() => ev.prompt())
            })
        }
    }
} else {
    // Window setup
    resizeTo(1105, 585)
    if (isIphone) setThemeColor("black")
    else setThemeColor("darkviolet")
}
