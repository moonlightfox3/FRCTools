addEventListener("beforeinstallprompt", function (ev) {
    ev.preventDefault()

    let button = document.createElement("button")
    button.innerText = "Install"
    button.style.position = "sticky"
    button.style.left = "calc(100% - 50px)"
    button.style.top = "calc(100% - 30px)"
    button.style.backgroundColor = "lightgray"
    button.style.borderRadius = "5px"
    button.style.cursor = "pointer"
    button.onclick = async function () {
        let result = await ev.prompt()
        if (result.outcome == "accepted") button.remove()
    }
    document.body.append(button)
})
