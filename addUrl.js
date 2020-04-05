chrome.storage.local.get('urlHistory', function (result) {
    var urlHistory = new Set(result.urlHistory);
    urlHistory.add(location.href);
    chrome.storage.local.set({'urlHistory': [...urlHistory]});
});