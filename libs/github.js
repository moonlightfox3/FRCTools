const gitUserName = "moonlightfox3", gitRepoName = "FRCTools"

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

let updateDateEl = null
function showCommitUpdate () {
    hideCommitUpdate()
    
    updateDateEl = document.createElement("div")
    updateDateEl.innerText = `Updated ${commitDate} (commit ${commitId})`
    updateDateEl.style.position = "sticky"
    updateDateEl.style.left = "5px"
    updateDateEl.style.top = "calc(100% - 30px)"
    document.body.append(updateDateEl)
}
function hideCommitUpdate () {
    if (updateDateEl != null) {
        updateDateEl.remove()
        updateDateEl = null
    }
}
