'use strict';

var sliderKeys = ['includePlaylists', 'clearSitesAtLoop', 'toggleAutoplayClearsSites'];

function loadSettings() {
    setSliders();
    setInputs();
}

function setSliders() {
    sliderKeys.forEach(key => {
        chrome.storage.local.get([key],
            function(data) {
                document.getElementById(key).checked = data[key];
            }
        );
    });
}

function setInputs() {
    ['backgroundRedirectEntry', 'toggleCheckInterval', 'videoRecommendationsInterval', 'videoEndInterval'].forEach(key => {
        chrome.storage.local.get([key],
            function(data) {
                document.getElementById(key).value = data[key];
            }
        );
    });
    setBlacklistEntries();
}

function setBlacklistEntries() {
    let blacklistKey = 'blacklist';
    chrome.storage.local.get([blacklistKey],
        function(data) {
            document.getElementById(blacklistKey).value = data[blacklistKey].join("\n");
        }
    );
}

function evaluateSliders() {
    sliderKeys.forEach(key => {
        chrome.storage.local.set({[key]: document.getElementById(key).checked});
    });
}

function evaluateInputs() {
    ['backgroundRedirectEntry', 'toggleCheckInterval', 'videoRecommendationsInterval', 'videoEndInterval'].forEach(key => {
        if (document.getElementById(key).value && !isNaN(document.getElementById(key).value)) {
            chrome.storage.local.set({[key]: document.getElementById(key).value});
        }
    });
    evaluateBlacklistEntries();
}

function evaluateBlacklistEntries() {
    let blacklistKey = 'blacklist';
    let blacklistValue = document.getElementById(blacklistKey).value;
    if (blacklistValue) {
        let blacklistLines = blacklistValue.split('\n');
        let isValid = true;
        let youtubePrefix = "www.youtube.com/watch?";
        blacklistLines.forEach(line => {
            if (!line.startsWith("https://"+youtubePrefix) && !line.startsWith("http://"+youtubePrefix)) {
                isValid = false;
            }
        });
        if (isValid) {
            chrome.storage.local.set({[blacklistKey]: blacklistLines});
        }
    }
}

function submit() {
    evaluateSliders();
    evaluateInputs();
}

function reset() {
    chrome.extension.getBackgroundPage().setupVariables();
    setInputs();
}

window.addEventListener('load', function load(event) {
    var submitButton = document.getElementById('submitButton');
    submitButton.addEventListener('click', function() { submit(); });
});

window.addEventListener('load', function load(event) {
    var resetButton = document.getElementById('resetButton');
    resetButton.addEventListener('click', function() { reset(); });
});

loadSettings();