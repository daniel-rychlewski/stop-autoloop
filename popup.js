'use strict';

let displaySites = document.getElementById('displaySites');
let clearSites = document.getElementById('clearSites');
let settings = document.getElementById('settings');

displaySites.onclick = function(element) {
  chrome.storage.local.get('urlHistory', function (result) {
    var bkg = chrome.extension.getBackgroundPage();
    bkg.console.log(new Set(result.urlHistory));
  });
};

clearSites.onclick = function(element) {
  chrome.storage.local.set({'urlHistory': []}, function() {
    var bkg = chrome.extension.getBackgroundPage();
    bkg.console.log("urlHistory has been cleared");
  });
};

settings.onclick = function(element) {
  chrome.runtime.openOptionsPage();
};