async function createGroupFile () {
    // Check for the year
    if (dataYear == null) return null

    let el = document.createElement("input")
    el.type = "file", el.accept = `.smscdt${dataYear}`, el.multiple = true
    let files = new Promise(function (resolve) {
        el.onchange = async function () {
            let files = []
            for (let file of el.files) files.push(await file.text())
            resolve(files)
        }
        el.oncancel = () => resolve(null)
        el.click()
    })

    if (files == null) return null
    let str = JSON.stringify([dataYear, ...files]).slice(1, -1)
    return str
}
async function createAllFile () {
    let el = document.createElement("input")
    el.type = "file", el.accept = `.smscgrp****`, el.multiple = true
    let files = new Promise(function (resolve) {
        el.onchange = async function () {
            let files = []
            for (let file of el.files) files.push(await file.text())
            resolve(files)
        }
        el.oncancel = () => resolve(null)
        el.click()
    })

    if (files == null) return null
    let str = JSON.stringify(files).slice(1, -1)
    return str
}
