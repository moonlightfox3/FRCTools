const isPWA = matchMedia("(display-mode: standalone)").matches
const isIphone = navigator.platform == "iPhone"

let themeColorEl = null
function setThemeColor (color) {
    if (!isPWA) return
    if (themeColorEl == null) {
        themeColorEl = document.createElement("meta")
        themeColorEl.name = "theme-color"
        document.head.append(themeColorEl)
    }
    themeColorEl.content = color
}
function resetThemeColor () {
    if (!isPWA) return
    if (themeColorEl != null) {
        themeColorEl.remove()
        themeColorEl = null
    }
}

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
            showInstallButton(function () {
alert(`\
Manual installation is required on iPhone!
1. Press the browser share/export button.
2. Scroll down and click 'Add to Home Screen'.
3. Click 'Add'.\
`)
            })
        } else {
            addEventListener("beforeinstallprompt", function (ev) {
                ev.preventDefault()
                showInstallButton(() => ev.prompt())
            })
        }
    }
} else {
    resizeTo(1105, 585)
    if (isIphone) setThemeColor("black")
    else setThemeColor("darkviolet")
}
