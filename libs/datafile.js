if (isPWA && window.launchQueue != undefined) {
    launchQueue.setConsumer(async function (params) {
        if (params.files.length > 0) {
            let file = await params.files[0].getFile()
            let text = await file.text()
            importData(text)
        }
    })
}

let dataYear = null
let dataElems = null // index 0 is the match number, index 1 is the team number (both are type=text inputs)
function importData (text) {
    if (dataYear == null) return
    let data = JSON.parse(`[${text}]`)

    for (let i = 0; i < dataElems.length; i++) {
        let elem = dataElems[i], val = data[i]
        if (elem.type == "text" || elem.type == "textarea") dataElems[i].value = val
        else if (elem.type == "number") dataElems[i].value = `${val}`
        else if (elem.type == "checkbox") dataElems[i].checked = val != 0
        else if (elem instanceof Array) dataElems[i][val].checked = true
    }
}
function exportData () {
    if (dataYear == null) return null
    let data = new Array(dataElems.length)

    for (let i = 0; i < dataElems.length; i++) {
        let elem = dataElems[i], val = elem.value
        if (elem.type == "text" || elem.type == "textarea") data[i] = val
        else if (elem.type == "number") data[i] = parseInt(val)
        else if (elem.type == "checkbox") data[i] = +elem.checked
        else if (elem instanceof Array) data[i] = elem.findIndex(val => val.checked)
    }

    let text = JSON.stringify(data).slice(1, -1)
    return text
}

function downloadData () {
    let data = exportData()
    let name = `${dataElems[0].value.replaceAll(" ", "")}-${dataElems[1].value.replaceAll(" ", "")}.smscdt${dataYear}`

    let a = document.createElement("a")
    a.download = name
    a.href = `data:text/plain;base64,${btoa(data)}`
    a.click()
}
