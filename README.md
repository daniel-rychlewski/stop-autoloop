# stop-autoloop
Stops YouTube's autoplay feature from repeating the same videos

# Problem
YouTube's autoplay feature leads to situations where a video you have already watched is played next. Such loops of <b>watching the same two videos</b> over and over again (worst case) are not necessarily desirable. This is why this browser extension can redirect the autoplay video which is supposed to be played next. This is done if it detects that the video has been watched already. The add-on supports both foreground and background tabs.

# Solution
To be more precise, the add-on adds the URL of every YouTube video site called by the user to its <b>URL history</b>.
That way, it can tell if a video has already been seen.
Once a YouTube video site has been called, the site is analyzed to detect the list of <i>YouTube video recommendations</i>.
These are the <b>candidates</b> among which the next video to watch is chosen.
Without the add-on, the first entry of these candidates would always be chosen with the autoplay feature enabled.
A YouTube video site is also scanned to detect whether or not the <b>autoplay toggle</b> is enabled at all (if not, the add-on does nothing).
In addition, a video's end is also being detected by the add-on in case of <i>foreground tabs</i>.
Background tabs do not have such a <b>transition process</b> to the next autoplay video, so they are redirected after a YouTube video site has been called that has already been visited.

# Customization
The extension does feature customization options in its settings page, accessible through the icon ("Settings").
The user can decide if <b>playlists</b> that appear in the YouTube recommendations should be included as candidates for the next video,
if the URL history should be <b>cleared</b> when a redirect occurs due to a potential loop,
if the autoplay toggle shall <b>clear</b> the URL history and control the periodic <b>checking intervals</b> for site scanning. The settings can be reset to their default values.
The icon popup also allows the user to clear the URL history manually, which will be confirmed in the add-on's background page.

# Disclaimer
As this is only an early stage of developing the add-on, bugs are absolutely possible.
This is especially likely in settings with multiple YouTube video tabs, but also in background tabs,
where a video called "a" might be <b>repeated</b> in a situation where the first recommendation of "a" is "b" and of "b" is "a" (where the URL history is cleared at a loop).
It is also not yet possible to <b>change what happens</b> after detecting a possible loop (e.g., notifying the user, disabling autoplay, choosing the most popular video from the recommendations instead of the first unseen entry every time) as this is just a simple add-on right now.

# Support
I sincerely hope someone finds this add-on just as useful as I consider it for watching YouTube videos. If you would like to support my work, I would appreciate any donation amount on my Patreon: https://www.patreon.com/danielrychlewski