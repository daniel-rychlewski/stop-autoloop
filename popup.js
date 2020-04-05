'use strict';

let clearSites = document.getElementById('clearSites');
let settings = document.getElementById('settings');

clearSites.onclick = function(element) {
  chrome.storage.local.set({'urlHistory': [...new Set()]}, function() {
    var bkg = chrome.extension.getBackgroundPage();
    bkg.console.log("urlHistory set has been cleared");
  });
};

settings.onclick = function(element) {
  chrome.runtime.openOptionsPage();
};