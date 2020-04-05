'use strict';

function loadSettings() {
    chrome.storage.local.get('includePlaylists',
        function(data) {
            document.getElementById('includePlaylistSwitch').checked = data.includePlaylists;
        }
    );
    chrome.storage.local.get('clearSitesAtLoop',
        function(data) {
            document.getElementById('clearSitesAtLoopSwitch').checked = data.clearSitesAtLoop;
        }
    );
    chrome.storage.local.get('toggleAutoplayClearsSites',
        function(data) {
            document.getElementById('toggleAutoplayClearsSitesSwitch').checked = data.toggleAutoplayClearsSites;
        }
    );
    setInputs();
}

function setInputs() {
    chrome.storage.local.get('toggleCheckInterval',
        function(data) {
            document.getElementById('toggleCheckInterval').placeholder = data.toggleCheckInterval;
        }
    );
    chrome.storage.local.get('videoRecommendationsInterval',
        function(data) {
            document.getElementById('videoRecommendationsInterval').placeholder = data.videoRecommendationsInterval;
        }
    );
    chrome.storage.local.get('videoEndInterval',
        function(data) {
            document.getElementById('videoEndInterval').placeholder = data.videoEndInterval;
        }
    );
}

window.addEventListener('load', function load(event) {
    var submitButton = document.getElementById('submitButton');
    submitButton.addEventListener('click', function() { submit(); });
});

window.addEventListener('load', function load(event) {
    var resetButton = document.getElementById('resetButton');
    resetButton.addEventListener('click', function() { reset(); });
});

function submit() {
    chrome.storage.local.set({'includePlaylists': document.getElementById('includePlaylistSwitch').checked});
    chrome.storage.local.set({'clearSitesAtLoop': document.getElementById('clearSitesAtLoopSwitch').checked});
    chrome.storage.local.set({'toggleAutoplayClearsSites': document.getElementById('toggleAutoplayClearsSitesSwitch').checked});

    if (document.getElementById('toggleCheckInterval').value && !isNaN(document.getElementById('toggleCheckInterval').value)) {
        chrome.storage.local.set({'toggleCheckInterval': document.getElementById('toggleCheckInterval').value});
    }
    if (document.getElementById('videoRecommendationsInterval').value && !isNaN(document.getElementById('videoRecommendationsInterval').value)) {
        chrome.storage.local.set({'videoRecommendationsInterval': document.getElementById('videoRecommendationsInterval').value});
    }
    if (document.getElementById('videoEndInterval').value && !isNaN(document.getElementById('videoEndInterval').value)) {
        chrome.storage.local.set({'videoEndInterval': document.getElementById('videoEndInterval').value});
    }
}

function reset() {
    chrome.extension.getBackgroundPage().setupVariables();
    setInputs();
}

loadSettings();