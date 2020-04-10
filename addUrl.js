chrome.storage.local.get('urlHistory', function (result) {
    if (result.urlHistory.length === 0) {
        // autoplay toggle might have been re-activated, need to add blacklist
        chrome.storage.local.get('blacklist', function (blacklist) {
            blacklist.blacklist.forEach(url => result.urlHistory.push(url));
        });
    }
    result.urlHistory.push(location.href);
    chrome.storage.local.set({'urlHistory': result.urlHistory});
});