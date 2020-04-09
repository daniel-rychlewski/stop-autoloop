function setupVariables() {
    chrome.storage.local.set({'urlHistory': []});
    chrome.storage.local.set({'includePlaylists': false});
    chrome.storage.local.set({'clearSitesAtLoop': true});
    chrome.storage.local.set({'toggleAutoplayClearsSites': true});
    chrome.storage.local.set({'backgroundRedirectEntry': 1});
    chrome.storage.local.set({'blacklist': ['https://www.youtube.com/watch?v=EXAMPLE1234']});
    chrome.storage.local.set({'toggleCheckInterval': 500});
    chrome.storage.local.set({'videoRecommendationsInterval': 100});
    chrome.storage.local.set({'videoEndInterval': 100});
}