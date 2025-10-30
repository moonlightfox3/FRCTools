if (isPWA && window.launchQueue != undefined) {
    launchQueue.setConsumer(async function (params) {
        if (params.files.length > 0) {
            let file = await params.files[0].getFile()
            let text = await file.text()

            if (text != "") importData(text)
        }
    })
}

const dataFileExcludeElems = ["br", "label", "a", "button"]
function initDataFile (year) {
    dataYear = year
    dataElems = []

    let divs = document.querySelector("form").querySelectorAll("div")
    let lastRadioName = null
    let lastRadioElems = []
    for (let div of divs) {
        for (let el of div.children) {
            if (dataFileExcludeElems.includes(el.tagName.toLowerCase())) continue

            if (el.tagName == "INPUT" && el.type == "radio" && el.name == lastRadioName) {
                lastRadioElems.push(el)
                continue
            } else if (lastRadioName != null) {
                dataElems.push(lastRadioElems)
                lastRadioName = null, lastRadioElems = []
            }

            if (el.tagName == "INPUT" && el.type == "radio") {
                lastRadioName = el.name
                lastRadioElems.push(el)
            } else dataElems.push(el)
        }
        if (lastRadioName != null) {
            dataElems.push(lastRadioElems)
            lastRadioName = null, lastRadioElems = []
        }
    }
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
    if (dataYear == null) return null
    let data = exportData()
    let name = `${dataElems[0].value.replaceAll(" ", "")}-${dataElems[1].value.replaceAll(" ", "")}.smscdt${dataYear}`

    let a = document.createElement("a")
    a.download = name
    a.href = `data:text/plain;base64,${btoa(data)}`
    a.click()
}

function getFormChanged () {
    if (dataYear == null) return null

    for (let el of dataElems) {
        let changed = null
        if (el.type == "text" || el.type == "textarea") changed = el.value != ""
        else if (el.type == "number") changed = el.value != "0"
        else if (el.type == "checkbox") changed = !el.checked
        else if (el instanceof Array) changed = el.find(val => val.checked).className != "defaultChecked"

        if (changed) return true
    }
    return false
}
