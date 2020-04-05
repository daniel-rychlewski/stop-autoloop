'use strict';

setupVariables();

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === "complete") {
        if (tab.url.includes("https://www.youtube.com/watch?")) {
            chrome.tabs.executeScript(tabId,{
                file: 'addUrl.js'
            });
            chrome.tabs.executeScript(tabId,{
                file: 'autoplay.js'
            });
        }
    }
});