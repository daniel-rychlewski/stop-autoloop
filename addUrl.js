chrome.storage.local.get('urlHistory', function (result) {
    result.urlHistory.push(location.href);
    chrome.storage.local.set({'urlHistory': result.urlHistory});
});