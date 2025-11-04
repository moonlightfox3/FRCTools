// Config
const gitUserName = "moonlightfox3", gitRepoName = "FRCTools"

// Use the GitHub API
async function getCommit () {
    let resp = await fetch(`https://api.github.com/repos/${gitUserName}/${gitRepoName}/commits?per_page=1`)
    let json = await resp.json()
    return json[0]
}
let commit = null
;(async function () {
    commit = await getCommit()

    commitId = getCommitId()
    commitDate = getCommitDate()
    showCommitUpdate()
})()

// Get data from the commit
let commitId = null
let commitDate = null
function getCommitId () {
    // Was the commit fetched?
    if (commit == null) return null

    return commit.sha.substring(0, 8)
}
function getCommitDate () {
    // Was the commit fetched?
    if (commit == null) return null
    
    let date = new Date(commit.commit.committer.date)
    let str = date.toLocaleDateString("en-US", {hour: "numeric", minute: "numeric"})
    return str
}

// Show the update status element
let updateDateEl = null
function showCommitUpdate () {
    hideCommitUpdate()
    
    updateDateEl = document.createElement("div")
    let addEl1 = document.createElement("span")
        addEl1.innerText = `Updated ${commitDate}`
    let addEl2 = document.createElement("span")
        addEl2.innerText = `(commit ${commitId})`
    addEl1.style.display = addEl2.style.display = "inline-block"
    updateDateEl.style.position = "sticky"
    updateDateEl.style.left = "5px"
    updateDateEl.style.top = "calc(100% - 30px)"
    updateDateEl.style.width = "calc(100% - 60px)"
    updateDateEl.append(addEl1, " ", addEl2)
    document.body.append(updateDateEl)
}
function hideCommitUpdate () {
    if (updateDateEl != null) {
        updateDateEl.remove()
        updateDateEl = null
    }
}
