const isPWA = matchMedia("(display-mode: standalone)").matches

if (!isPWA) {
    let installButton = null
    addEventListener("appinstalled", function () {
        if (installButton != null) {
            installButton.remove()
            installButton = null
        }
    })
    addEventListener("beforeinstallprompt", function (ev) {
        ev.preventDefault()

        installButton = document.createElement("button")
        installButton.innerText = "Install"
        installButton.style.position = "sticky"
        installButton.style.left = "calc(100% - 50px)"
        installButton.style.top = "calc(100% - 30px)"
        installButton.style.backgroundColor = "lightgray"
        installButton.style.borderRadius = "5px"
        installButton.style.cursor = "pointer"
        installButton.onclick = () => ev.prompt()
        document.body.append(installButton)
    })
} else {
    resizeTo(1105, 585)

    if (window.launchQueue != undefined) {
        launchQueue.setConsumer(async function (params) {
            if (params.files.length > 0) {
                let file = await params.files[0].getFile()
                let buf = await file.arrayBuffer()
                handleDataImport(buf)
            }
        })
    }
}

function handleDataImport (buf) { // TODO
    console.debug("Data import:", buf)
}
