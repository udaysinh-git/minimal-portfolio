---
layout: layout.njk
title: Creative
---

<!-- Add Font Awesome for icons -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<div contenteditable="true">
    <h1 class="creative-title">Creative</h1>
</div>
<p id="listening-status" class="listening-status"><i class="fa-solid fa-music"></i>&nbsp;</p>

<!-- Spotify Card -->
<div id="spotify-status" class="spotify-status">
  <div class="spotify-card">
    <div class="album-art-container">
      <!-- Optional Spotify Canvas. Shown if available -->
      <img id="album-canvas" class="album-canvas" src="" alt="Spotify Canvas" style="display: none;">
      <!-- Album Cover -->
      <img id="album-cover" class="album-cover" src="" alt="Album Art" style="display:none;">
    </div>
    <div class="track-info-container">
      <!-- The track name will be typed out -->
      <div class="track-name">&nbsp;</div>
      <!-- Additional details fade in -->
      <div class="track-additional hidden">&nbsp;</div>
      <!-- Time and progress bar -->
      <div id="spotify-time" class="spotify-time">&nbsp;</div>
      <div id="spotify-progress-container" class="spotify-progress-container">
        <div id="spotify-squares" class="spotify-squares">
          <!-- Cubes will be generated dynamically based on viewport width -->
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Activity Status Heading -->
<p id="activity-status-heading" class="listening-status" style="margin-top:2.5rem;">&nbsp;</p>

<!-- Activity Card (uses same card as spotify-status for theme compatibility) -->
<div id="activity-status" class="spotify-status">
  <div class="spotify-card">
    <div class="album-art-container">
      <!-- Generic App Icon (for games etc.) -->
      <img id="activity-icon" class="album-cover" src="" alt="App/Game Icon" style="display:none;">
      <!-- VS Code Specific Assets -->
      <img id="activity-vscode-large-image" class="album-cover" src="" alt="VS Code Large Asset" style="display:none; position: relative; z-index: 1;">
      <img id="activity-vscode-small-image" src="" alt="VS Code Small Asset" style="display:none; position: absolute; bottom: -5px; right: -5px; width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--card-background-color, #181818); z-index: 2; background-color: var(--card-background-color, #181818);">
    </div>
    <div class="track-info-container">
      <div class="track-name" id="activity-name">&nbsp;</div>
      <div class="track-additional" id="activity-details" style="display:none;">&nbsp;</div>
      <div class="track-additional" id="activity-state" style="display:none;">&nbsp;</div>
      <div class="track-additional" id="activity-large-text" style="display:none;">&nbsp;</div>
      <div class="spotify-time" id="activity-time">&nbsp;</div>
    </div>
  </div>
</div>
<style>
/* Hide blinking cursor on link inside track-name */
.track-name a::after {
  content: none;
}

/* Remove default hyperlink outline */
.track-name a {
  text-decoration: none;
  color: inherit;
}

/* Remove old .activity-status/.activity-card styles as we now use spotify-status/spotify-card for both */
.activity-status, .activity-card, .activity-art-container, .activity-icon, .activity-info-container, .activity-heading, .activity-name, .activity-details, .activity-state, .activity-time {
  display: none !important;
}

/* Marquee animation for long text */
.marquee {
  overflow: hidden;
  white-space: nowrap;
  position: relative;
}
.marquee span {
  display: inline-block;
  padding-left: 0;
  animation: marquee 7s linear infinite;
}
@keyframes marquee {
  0% { transform: translateX(0); }
  100% { transform: translateX(-60%); }
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px);}
  to { opacity: 1; transform: translateY(0);}
}

/* --- Removed all skeleton loader styles --- */
</style>

<script>
// Global variables for progress and track and dynamic cube count
let currentProgress = 0, trackDuration = 0, lastFetchTime = Date.now();
let totalSquares = 20; // default; will be updated dynamically
let lastTrackId = null;

// Create cubes dynamically based on screen size.
function createCubes() {
  const squaresContainer = document.getElementById('spotify-squares');
  squaresContainer.innerHTML = "";
  // For mobile devices (width < 600px), use 10 cubes; otherwise 20.
  totalSquares = window.innerWidth < 600 ? 10 : 20;
  for (let i = 0; i < totalSquares; i++) {
    const span = document.createElement("span");
    span.classList.add("spotify-square");
    squaresContainer.appendChild(span);
  }
}

// Call createCubes on load and on window resize
createCubes();
window.addEventListener("resize", () => {
  createCubes();
});

// Typewriter effect that types out text then calls a callback once done.
function typeWriter(element, text, speed, callback) {
  element.textContent = "";
  let i = 0;
  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    } else if (callback) {
      callback(text);
    }
  }
  type();
}

// Helper to format milliseconds to mm:ss
function formatTime(ms) {
  const totalSec = Math.floor(ms / 1000);
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
}

let lastTrackData = null;

async function fetchSpotifyPlayback() {
  const listeningStatusEl = document.getElementById('listening-status');
  const spotifyStatusCardEl = document.getElementById('spotify-status');
  const spotifyAlbumArtContainerEl = spotifyStatusCardEl.querySelector('.album-art-container');
  const spotifyAlbumCoverEl = document.getElementById('album-cover');
  const spotifyTrackNameEl = spotifyStatusCardEl.querySelector('.track-name');
  const spotifyTrackAdditionalEl = spotifyStatusCardEl.querySelector('.track-additional');
  const spotifyTimeEl = document.getElementById('spotify-time');
  const spotifyCanvasEl = document.getElementById('album-canvas');

  try {
    const response = await fetch('/.netlify/functions/spotify');
    let data = null;

    if (response.status === 204 || !response.ok) {
      console.error("No current track or error. Using last track data if available.");
      data = { is_playing: false, progress_ms: lastTrackData ? lastTrackData.progress_ms : 0, item: null };
    } else {
      data = await response.json();
    }

    if (!data.item && lastTrackData) {
      data.item = lastTrackData.item;
      data.progress_ms = lastTrackData.progress_ms;
      data.is_playing = false; // If restoring last track, assume it's not currently playing live
    } else if (data.item) {
      lastTrackData = { item: data.item, progress_ms: data.progress_ms };
    }

    if (!data.item) {
      listeningStatusEl.innerHTML = `<i class="fa-solid fa-music"></i> Not currently listening`;
      spotifyStatusCardEl.style.display = 'none'; // Hide the card if no track info
      return;
    }

    spotifyStatusCardEl.style.display = ''; // Ensure card is visible

    if (!data.is_playing) {
      listeningStatusEl.innerHTML = `<i class="fa-solid fa-music"></i> I was listening to:`;
      spotifyStatusCardEl.classList.add('paused');
    } else {
      listeningStatusEl.innerHTML = `<i class="fa-solid fa-music"></i> I'm listening to:`;
      spotifyStatusCardEl.classList.remove('paused');
    }

    if (data.item.id !== lastTrackId) {
      lastTrackId = data.item.id;
      spotifyAlbumCoverEl.classList.add('song-change');
      setTimeout(() => spotifyAlbumCoverEl.classList.remove('song-change'), 1000);

      typeWriter(spotifyTrackNameEl, data.item.name, 60, (finalText) => {
        spotifyTrackNameEl.innerHTML = `<a href="${data.item.external_urls.spotify}" target="_blank">${finalText}</a>`;
      });

      const artistHtml = data.item.artists
            .map(artist => `<a href="${artist.external_urls.spotify}" target="_blank"><i class="fa-solid fa-user"></i> ${artist.name}</a>`)
            .join(', ');
      spotifyTrackAdditionalEl.innerHTML = `<i class="fa-solid fa-compact-disc"></i> <em>${data.item.album.name}</em> &mdash; ${artistHtml}`;
      spotifyTrackAdditionalEl.classList.remove('hidden');
      void spotifyTrackAdditionalEl.offsetWidth; 
      spotifyTrackAdditionalEl.classList.add('fade-in');
    }

    currentProgress = data.progress_ms;
    trackDuration = data.item.duration_ms;
    lastFetchTime = Date.now();

    const albumCoverUrl = (data.item.album.images && data.item.album.images.length) 
                          ? data.item.album.images[0].url : '';
    if (albumCoverUrl) {
      spotifyAlbumCoverEl.src = albumCoverUrl;
      spotifyAlbumCoverEl.style.display = 'block';
    } else {
      spotifyAlbumCoverEl.style.display = 'none';
    }

    const canvasUrl = data.item.canvas_url || '';
    if (canvasUrl) {
      spotifyCanvasEl.src = canvasUrl;
      spotifyCanvasEl.style.display = 'block';
    } else {
      spotifyCanvasEl.style.display = 'none';
    }

  } catch (error) {
    console.error("Error fetching Spotify playback:", error);
    listeningStatusEl.textContent = "Error loading Spotify status.";
    spotifyStatusCardEl.style.display = 'none';
  }
}

// Update the progress bar based on song progress.
function updateProgressBar() {
  if (trackDuration > 0) {
    const spotifyStatusEl = document.getElementById('spotify-status');
    const isPaused = spotifyStatusEl.classList.contains('paused');
    let updatedProgress = currentProgress;
    if (!isPaused) {
      const elapsed = Date.now() - lastFetchTime;
      updatedProgress = Math.min(currentProgress + elapsed, trackDuration);
    }
    const percent = (updatedProgress / trackDuration) * 100;
    const squaresToFill = Math.floor((percent / 100) * totalSquares);
    const squares = document.querySelectorAll('.spotify-square');

    squares.forEach((sq, idx) => {
      if (idx < squaresToFill) {
        sq.classList.add('filled');
      } else {
        sq.classList.remove('filled');
      }
    });
    document.getElementById('spotify-time').textContent =
      `${formatTime(updatedProgress)} / ${formatTime(trackDuration)}`;
  }
}

// --- Activity Card Logic ---

let lastActivityName = null; // Track last activity name

async function fetchActivityStatus() {
  const headingEl = document.getElementById('activity-status-heading');
  const card = document.getElementById('activity-status');
  const albumArtContainer = card.querySelector('.album-art-container');

  // Image elements
  const iconEl = document.getElementById('activity-icon');
  const vscodeLargeImgEl = document.getElementById('activity-vscode-large-image');
  const vscodeSmallImgEl = document.getElementById('activity-vscode-small-image');

  const nameEl = document.getElementById('activity-name');
  const detailsEl = document.getElementById('activity-details');
  const stateEl = document.getElementById('activity-state');
  const largeTextEl = document.getElementById('activity-large-text');
  const timeEl = document.getElementById('activity-time');

  // Helper to set text and visibility for an element
  function setTextContentAndVisibility(element, text, useTypewriter = false, forceTypewriter = false) {
    if (!element) return;
    if (text) {
      if (useTypewriter) {
        // Only typewriter effect, no fade-in for activity-name
        if (element.id === "activity-name") {
          // Only run typewriter if name changed or forced
          if (forceTypewriter || element.textContent !== text) {
            typeWriter(element, text, 60);
          } else {
            element.textContent = text;
          }
          element.classList.remove('hidden');
          element.style.display = "";
        } else {
          typeWriter(element, text, 60, () => {
            element.classList.remove('hidden');
            void element.offsetWidth;
            element.classList.add('fade-in');
          });
        }
      } else {
        element.innerHTML = text;
        element.classList.remove('hidden');
        void element.offsetWidth;
        element.classList.add('fade-in');
      }
      element.style.display = "";
    } else {
      element.innerHTML = "";
      element.style.display = "none";
      element.classList.remove('fade-in');
      element.classList.add('hidden');
    }
  }

  try {
    const res = await fetch('/.netlify/functions/activities');

    if (!res.ok) {
      headingEl.style.display = "none";
      card.style.display = "none";
      return;
    }
    const data = await res.json(); 
    if (!data || !data.activity) {
      headingEl.style.display = "none";
      card.style.display = "none";
      return;
    }

    card.style.display = ""; // Ensure card is visible if it was hidden

    const act = data.activity;
    const fromCache = data.from_cache; 

    // Only typewriter if activity name changed
    const activityNameChanged = lastActivityName !== act.name;
    setTextContentAndVisibility(nameEl, act.name || "", true, activityNameChanged);
    lastActivityName = act.name;

    const currentPrefix = fromCache ? "was" : "am currently";

    // Hide all image elements initially, they will be shown based on logic
    iconEl.style.display = "none";
    vscodeLargeImgEl.style.display = "none";
    vscodeSmallImgEl.style.display = "none";
    albumArtContainer.classList.remove('skeleton-image'); // No effect, but harmless

    if (act.name === "Visual Studio Code") {
      setTextContentAndVisibility(headingEl, `🧑‍💻 I ${currentPrefix} working on:`);
      setTextContentAndVisibility(detailsEl, act.details ? `<i class="fa-solid fa-file-lines"></i> ${act.details}` : "");
      setTextContentAndVisibility(stateEl, act.state ? `<i class="fa-solid fa-folder"></i> ${act.state}` : "");
      setTextContentAndVisibility(largeTextEl, act.large_text ? `<i class="fa-solid fa-file-code"></i> ${act.large_text}` : "");

      if (act.application_id && act.large_text_asset_key && act.small_text_asset_key) { 
        vscodeLargeImgEl.src = `https://cdn.discordapp.com/app-assets/${act.application_id}/${act.large_text_asset_key}.png?size=128`;
        vscodeLargeImgEl.style.display = "";
        vscodeSmallImgEl.src = `https://cdn.discordapp.com/app-assets/${act.application_id}/${act.small_text_asset_key}.png?size=64`;
        vscodeSmallImgEl.style.display = "";
      } else if (act.application_id) { 
        iconEl.src = `https://dcdn.dstn.to/app-icons/${act.application_id}.png?size=128`;
        iconEl.style.display = "";
      } else { 
         iconEl.src = "https://cdn.discordapp.com/app-icons/383226320970055681/1359299016025964687.png?size=128"; 
         iconEl.style.display = "";
      }

    } else if (act.name === "Obsidian") {
      setTextContentAndVisibility(headingEl, `📝 I ${currentPrefix} working in:`);
      setTextContentAndVisibility(detailsEl, act.details ? `<i class="fa-solid fa-file-alt"></i> ${act.details}` : ""); // Using fa-file-alt for generic file
      setTextContentAndVisibility(stateEl, null); // Obsidian might not have a 'state' in the same way
      setTextContentAndVisibility(largeTextEl, act.large_text ? `<i class="fa-solid fa-book-open"></i> ${act.large_text}` : ""); // Using book-open for large_text if it's like "Obsidian"

      // Hide VS Code specific images
      vscodeLargeImgEl.style.display = "none";
      vscodeSmallImgEl.style.display = "none";

      if (act.application_id && act.assets && act.assets.large_image) {
        iconEl.src = `https://cdn.discordapp.com/app-assets/${act.application_id}/${act.assets.large_image}.png?size=128`;
      } else if (act.application_id) {
        iconEl.src = `https://dcdn.dstn.to/app-icons/${act.application_id}.png?size=128`;
      } else {
        // Fallback icon for Obsidian if specific assets are not found
        iconEl.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Obsidian_icon.svg/120px-Obsidian_icon.svg.png"; // Example generic Obsidian icon
      }
      iconEl.style.display = "";
      iconEl.onerror = function() {
        // Fallback if the primary icon fails
        iconEl.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Obsidian_icon.svg/120px-Obsidian_icon.svg.png";
        this.onerror=null;
      };

    } else { // Game or other activity
      setTextContentAndVisibility(headingEl, `🎮 I ${currentPrefix} playing:`);
      setTextContentAndVisibility(detailsEl, null); 
      setTextContentAndVisibility(stateEl, null);
      setTextContentAndVisibility(largeTextEl, null);

      if (act.application_id) {
        iconEl.src = `https://dcdn.dstn.to/app-icons/${act.application_id}.png?size=128`;
      } else {
        iconEl.src = "https://cdn.discordapp.com/app-icons/1364888648839073802/16d6294a8486c2fcdede9703ee0e737a.webp?size=128"; 
      }
      iconEl.style.display = "";
      iconEl.onerror = function() {
        iconEl.src = "https://cdn.discordapp.com/app-icons/1364888648839073802/16d6294a8486c2fcdede9703ee0e737a.webp?size=128"; 
        this.onerror=null; // prevent infinite loop if fallback also fails
      };
    }

    headingEl.style.display = "";

    if (act.start) {
      const startTime = typeof act.start === 'string' ? parseInt(act.start, 10) : act.start;
      if (!isNaN(startTime) && startTime > 0) { 
        setTextContentAndVisibility(timeEl, (fromCache ? "Last active: " : "Started ") + timeAgo(new Date(startTime)));
      } else {
        setTextContentAndVisibility(timeEl, null);
      }
    } else {
      setTextContentAndVisibility(timeEl, null);
    }
     // Ensure the main card is visible
  } catch (err) {
    console.error("Error fetching activity status:", err);
    headingEl.style.display = "none";
    card.style.display = "none";
  }
}

// Helper: Marquee if text is long
function setMarquee(el, text) {
  if (!text) {
    el.innerHTML = "";
    el.style.display = "none";
    return;
  }
  el.style.display = "";
  if (text.length > 24) {
    el.innerHTML = `<span>${text}</span>`;
    el.classList.add("marquee");
  } else {
    el.textContent = text;
    el.classList.remove("marquee");
  }
}

// Helper: Time ago formatting
function timeAgo(date) {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return `${diff} seconds ago`;
  if (diff < 3600) return `${Math.floor(diff/60)} minutes ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)} hours ago`;
  return date.toLocaleString();
}

// Initial fetch and periodic update
fetchActivityStatus();
setInterval(fetchActivityStatus, 10000);

fetchSpotifyPlayback();
setInterval(fetchSpotifyPlayback, 3000);
setInterval(updateProgressBar, 1000);
</script>