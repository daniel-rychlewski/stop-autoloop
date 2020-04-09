(function () {
    MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

    var autoplayEnabledObserver = new MutationObserver(function(mutations) {

        var isAutoplayEnabled = isAutoplayActive(mutations[0].target.outerHTML);

        if (isAutoplayEnabled) {
            chrome.storage.local.get('urlHistory', function (result) {
                var urlHistory = new Set(result.urlHistory);

                // wait until video recommendations become fully available to use the ones for the current video, not for the previous page
                let recommendationsObserver = new MutationObserver(function (mutations) {
                    let nextAutoplayLink = mutations[0].target.href;

                    if (urlHistory.has(nextAutoplayLink)) {

                        var composeObserver = new MutationObserver(async function (mutations) {
                            var linkElements = document.getElementsByClassName("yt-simple-endpoint style-scope ytd-compact-video-renderer"); // hope that other videos are loaded when first video link update is seen by mutation observer
                            await saveNextVideoCandidate(urlHistory, linkElements);

                            chrome.storage.local.get('clearSitesAtLoop', function (clearSites) {
                                chrome.storage.local.get('candidate', function (result) {
                                    let candidate = result.candidate;
                                    if (clearSites.clearSitesAtLoop) {
                                        chrome.storage.local.set({'urlHistory': []}, function() {
                                            if (location.href === nextAutoplayLink) {
                                                location.href = candidate;
                                            }
                                        });
                                    } else {
                                        if (location.href === nextAutoplayLink) {
                                            location.href = candidate;
                                        }
                                    }
                                });
                            });
                        });

                        function addObserverAtVideoEnd() {
                            chrome.storage.local.get('videoEndInterval', function (result) {
                                let composeBox = document.querySelector("#movie_player > div.html5-endscreen.ytp-player-content.videowall-endscreen.ytp-show-tiles");

                                if (!composeBox) {
                                    window.setTimeout(addObserverAtVideoEnd, result.videoEndInterval);
                                    return;
                                }
                                let config = {attributes: true};
                                composeObserver.observe(composeBox, config);
                            });
                        }

                        addObserverAtVideoEnd();
                    }

                    // for background tabs, we do not check in advance, but when the suggested autoplay page is already loaded. Easier to compare that way because video suggestions might not be loaded
                    if (document.visibilityState === "hidden") {
                        if (urlHistory.has(location.href)) {
                            let linkElements = document.getElementsByClassName("yt-simple-endpoint style-scope ytd-compact-video-renderer");
                            (async function() {
                                await saveNextVideoCandidate(urlHistory, linkElements);
                            })();
                            chrome.storage.local.get('candidate', function (result) {
                                if (result.candidate !== "https://www.youtube.com") {
                                    location.href = result.candidate;
                                } else {
                                    chrome.storage.local.get('backgroundRedirectEntry',
                                        function(data) {
                                            location.href = linkElements[data.backgroundRedirectEntry].href; // worst case: updates back and forth many times, but eventually, a different link will be chosen
                                        }
                                    );
                                }
                            });
                        }
                    }
                });

                function waitForVideoRecommendations() {
                    chrome.storage.local.get('videoRecommendationsInterval', function (result) {
                        var linkElements = document.getElementsByClassName("yt-simple-endpoint style-scope ytd-compact-video-renderer");
                        if (!linkElements) {
                            //The node we need does not exist yet.
                            window.setTimeout(waitForVideoRecommendations, result.videoRecommendationsInterval);
                            return;
                        }
                        var config = {attributes: true, childList: true};
                        recommendationsObserver.observe(linkElements[0], config);
                    });
                }

                waitForVideoRecommendations();
            });
        } else {
            chrome.storage.local.get('toggleAutoplayClearsSites', function (result) {
                if (result.toggleAutoplayClearsSites) {
                    // reset url history if user has turned autoplay off
                    chrome.storage.local.set({'urlHistory': []});
                }
            });
        }
    });

    function detectIfAutoplayEnabled() {
        chrome.storage.local.get('toggleCheckInterval', function (result) {
            var composeBox = document.querySelector("#toggle");
            if (!composeBox) {
                window.setTimeout(detectIfAutoplayEnabled, result.toggleCheckInterval);
                return;
            }
            var config = {attributes: true};
            autoplayEnabledObserver.observe(composeBox,config);
        });
    }
    detectIfAutoplayEnabled();

})();

function isAutoplayActive(toggle) {
    return toggle.includes('aria-pressed="true"');
}

function isPlaylistLink(linkToAnalyze) {
    return linkToAnalyze.includes("&list=") || linkToAnalyze.includes("&start_radio=")
}

function saveNextVideoCandidate(urlHistory, linkElementsToChooseFrom) {
    chrome.storage.local.get('includePlaylists', function (result) {
        for (let i = 1; i < linkElementsToChooseFrom.length; i++) {
            let linkToAnalyze = linkElementsToChooseFrom[i].href;
            if (!urlHistory.has(linkToAnalyze) && (result.includePlaylists || !isPlaylistLink(linkToAnalyze))) {
                chrome.storage.local.set({'candidate': linkToAnalyze});
                return;
            }
        }
        chrome.storage.local.set({'candidate': "https://www.youtube.com"}); // highly unlikely scenario that nothing suitable is found
    });
}