// Was this opened with an exported data file?
let openedWithFile = null
// Check for launching by opening an associated file type
if (isPWA && window.launchQueue != undefined) {
    launchQueue.setConsumer(async function (params) {
        // Was a file opened?
        openedWithFile = params.files.length > 0
        if (openedWithFile) {
            let file = await params.files[0].getFile()
            let text = await file.text()

            // Ignore empty files
            if (text != "") {
                console.debug(`Importing file '${file.name}'`)
                importData(text)
            }
        }
    })
}

// Elements to not include for saving
const dataFileExcludeElems = ["br", "label", "a", "button"]
// Current data file version
const dataFileCurrentVersion = 1

let dataYear = null
let dataElems = null // index 0 is the match number, index 1 is the team number (both are type=text inputs)

// Get the input elements that should be saved
let dataElemsDefaultVals = null
function initDataFile (year) {
    // Setup
    console.debug(`Initializing data file for year '${year}'`)
    dataYear = year
    dataElems = []
    dataElemsDefaultVals = []

    // Check version
    if (dataFileCurrentVersion == 1) {
        // Forms are split into parts, to use more horizontal space
        let divs = document.querySelector("form").querySelectorAll("div")
        let lastRadioName = null
        let lastRadioElems = []
        for (let div of divs) {
            for (let el of div.children) {
                // Don't include some elements
                if (dataFileExcludeElems.includes(el.tagName.toLowerCase())) continue

                // Radio inputs are complicated to handle
                if (el.tagName == "INPUT" && el.type == "radio" && el.name == lastRadioName) {
                    // Part of the same group
                    lastRadioElems.push(el)
                    continue
                } else if (lastRadioName != null) {
                    // Not a radio element that's part of the same group - after a group of radio elements
                    dataElems.push(lastRadioElems)
                    lastRadioName = null, lastRadioElems = []
                }

                // More logic for radio inputs
                if (el.tagName == "INPUT" && el.type == "radio") {
                    // Radio element, not part of the same group
                    lastRadioName = el.name
                    lastRadioElems.push(el)
                } else dataElems.push(el) // Other element
            }
            // Make sure to use radio group
            if (lastRadioName != null) {
                dataElems.push(lastRadioElems)
                lastRadioName = null, lastRadioElems = []
            }
        }

        // Set defaults
        setDataElemsDefaults()
    } else return
}
function setDataElemsDefaults () {
    dataElemsDefaultVals = []
    
    // Check version
    if (dataFileCurrentVersion == 1) {
        // Get element values
        for (let el of dataElems) {
            if (el.type == "text" || el.type == "textarea") dataElemsDefaultVals.push(el.value)
            else if (el.type == "number") dataElemsDefaultVals.push(+el.value)
            else if (el.type == "checkbox") dataElemsDefaultVals.push(el.checked)
            else if (el instanceof Array) dataElemsDefaultVals.push(el.findIndex(val => val.checked))
        }
    } else return
}

// Import file
function importData (text) {
    // Check that the elements to save were gotten
    if (dataYear == null) return
    let data = JSON.parse(`[${text}]`)
    
    // Check version
    let ver = data.splice(0, 1)[0]
    if (ver == 1) {
        // Get elements
        for (let i = 0; i < dataElems.length; i++) {
            let elem = dataElems[i], val = data[i]
            // Do different things for different types of elements
            if (elem.type == "text" || elem.type == "textarea") dataElems[i].value = val
            else if (elem.type == "number") dataElems[i].value = `${val}`
            else if (elem.type == "checkbox") dataElems[i].checked = val != 0
            else if (elem instanceof Array) dataElems[i][val].checked = true
        }
    } else return

    // Set defaults
    setDataElemsDefaults()
}
// Export file
function exportData () {
    // Check that the elements to save were gotten
    if (dataYear == null) return null
    let data = null

    // Check version
    if (dataFileCurrentVersion == 1) {
        // Save elements
        data = new Array(dataElems.length)
        for (let i = 0; i < dataElems.length; i++) {
            let elem = dataElems[i], val = elem.value
            // Do different things for different types of elements
            if (elem.type == "text" || elem.type == "textarea") data[i] = val
            else if (elem.type == "number") data[i] = parseInt(val)
            else if (elem.type == "checkbox") data[i] = +elem.checked
            else if (elem instanceof Array) data[i] = elem.findIndex(val => val.checked)
        }
    } else return null

    let text = JSON.stringify([dataFileCurrentVersion, ...data]).slice(1, -1)
    return text
}
// Download file
function downloadData () {
    // Check that the elements to save were gotten
    if (dataYear == null) return null
    let data = exportData()
    // File name
    let name = `${dataElems[0].value.replaceAll(" ", "")}-${dataElems[1].value.replaceAll(" ", "")}.smscdt${dataYear}`

    // Download file with an <a> element
    let a = document.createElement("a")
    a.download = name
    a.href = `data:text/plain;base64,${btoa(data)}`
    a.click()
}

// Check if any form element was changed
function getFormChanged () {
    // Check that the elements to save were gotten
    if (dataYear == null) return null

    for (let i = 0; i < dataElems.length; i++) {
        let defaultVal = dataElemsDefaultVals[i], el = dataElems[i], changed = null
        // Do different things for different types of elements
        if (el.type == "text" || el.type == "textarea") changed = el.value != defaultVal
        else if (el.type == "number") changed = +el.value != defaultVal
        else if (el.type == "checkbox") changed = el.checked != defaultVal
        else if (el instanceof Array) changed = el.findIndex(val => val.checked) != defaultVal

        // Was the element changed?
        if (changed) return true
    }

    // Nothing was changed
    return false
}
