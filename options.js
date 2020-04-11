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
    ['backgroundRedirectEntry', 'maximumVideoLength', 'toggleCheckInterval', 'videoRecommendationsInterval', 'videoEndInterval'].forEach(key => {
        chrome.storage.local.get([key],
            function(data) {
                document.getElementById(key).value = data[key];
            }
        );
    });
    setFilterlistEntries();
}

function setFilterlistEntries() {
    let filterlistKeys = ['blacklist', 'whitelist'];
    filterlistKeys.forEach(key => {
        chrome.storage.local.get([key],
            function(data) {
                document.getElementById(key).value = data[key].join("\n");
            }
        );
    });
}

function evaluateSliders() {
    sliderKeys.forEach(key => {
        chrome.storage.local.set({[key]: document.getElementById(key).checked});
    });
}

function evaluateInputs() {
    ['backgroundRedirectEntry', 'maximumVideoLength', 'toggleCheckInterval', 'videoRecommendationsInterval', 'videoEndInterval'].forEach(key => {
        if (document.getElementById(key).value && !isNaN(document.getElementById(key).value)) {
            chrome.storage.local.set({[key]: document.getElementById(key).value});
        }
    });
    evaluateFilterlistEntries();
}

function evaluateFilterlistEntries() {
    let filterlistKeys = ['blacklist', 'whitelist'];
    filterlistKeys.forEach(filterlistKey => {
        let filterlistValue = document.getElementById(filterlistKey).value;
        if (filterlistValue) {
            var filterlistLines = filterlistValue.split('\n');
            let isValid = true;
            filterlistLines.forEach(line => {
                if (!line.startsWith("https://www.youtube.com/watch?")) {
                    isValid = false;
                }
            });
            if (isValid) {
                chrome.storage.local.set({[filterlistKey]: filterlistLines});

                if (filterlistKey === 'blacklist') {
                    chrome.storage.local.get('urlHistory', function (result) {
                        filterlistLines.forEach(url => result.urlHistory.push(url));
                        chrome.storage.local.set({'urlHistory': result.urlHistory});
                    });
                }
            }
        }
    });
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