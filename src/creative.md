---
layout: layout.njk
title: Creative
---

<!-- Add Font Awesome for icons -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<div contenteditable="true">
    <h1 class="creative-title">Creative</h1>
</div>
<p id="listening-status" class="listening-status skeleton skeleton-text"><i class="fa-solid fa-music"></i>&nbsp;</p>

<!-- Spotify Card -->
<div id="spotify-status" class="spotify-status">
  <div class="spotify-card">
    <div class="album-art-container skeleton skeleton-image">
      <!-- Optional Spotify Canvas. Shown if available -->
      <img id="album-canvas" class="album-canvas" src="" alt="Spotify Canvas" style="display: none;">
      <!-- Album Cover -->
      <img id="album-cover" class="album-cover" src="" alt="Album Art" style="display:none;">
    </div>
    <div class="track-info-container">
      <!-- The track name will be typed out -->
      <div class="track-name skeleton skeleton-text">&nbsp;</div>
      <!-- Additional details fade in -->
      <div class="track-additional hidden skeleton skeleton-text">&nbsp;</div>
      <!-- Time and progress bar -->
      <div id="spotify-time" class="spotify-time skeleton skeleton-text">&nbsp;</div>
      <div id="spotify-progress-container" class="spotify-progress-container">
        <div id="spotify-squares" class="spotify-squares">
          <!-- Cubes will be generated dynamically based on viewport width -->
        </div>
      </div>
    </div>
  </div>
</div>

<!-- Activity Status Heading -->
<p id="activity-status-heading" class="listening-status skeleton skeleton-text" style="margin-top:2.5rem;">&nbsp;</p>

<!-- Activity Card (uses same card as spotify-status for theme compatibility) -->
<!-- Made visible by default, content will be skeleton initially -->
<div id="activity-status" class="spotify-status">
  <div class="spotify-card">
    <div class="album-art-container skeleton skeleton-image">
      <!-- Generic App Icon (for games etc.) -->
      <img id="activity-icon" class="album-cover" src="" alt="App/Game Icon" style="display:none;">
      <!-- VS Code Specific Assets -->
      <img id="activity-vscode-large-image" class="album-cover" src="" alt="VS Code Large Asset" style="display:none; position: relative; z-index: 1;">
      <img id="activity-vscode-small-image" src="" alt="VS Code Small Asset" style="display:none; position: absolute; bottom: -5px; right: -5px; width: 32px; height: 32px; border-radius: 50%; border: 2px solid var(--card-background-color, #181818); z-index: 2; background-color: var(--card-background-color, #181818);">
    </div>
    <div class="track-info-container">
      <div class="track-name skeleton skeleton-text" id="activity-name">&nbsp;</div>
      <div class="track-additional skeleton skeleton-text" id="activity-details" style="display:none;">&nbsp;</div>
      <div class="track-additional skeleton skeleton-text" id="activity-state" style="display:none;">&nbsp;</div>
      <div class="track-additional skeleton skeleton-text" id="activity-large-text" style="display:none;">&nbsp;</div>
      <div class="track-additional skeleton skeleton-text" id="activity-small-text" style="display:none;">&nbsp;</div>
      <div class="spotify-time skeleton skeleton-text" id="activity-time">&nbsp;</div>
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

/* Skeleton Loader Styles */
.skeleton {
  animation: skeleton-loading 1.5s infinite linear;
  background: linear-gradient(90deg, var(--skeleton-base-color, #2a2a2a) 25%, var(--skeleton-shine-color, #3a3a3a) 50%, var(--skeleton-base-color, #2a2a2a) 75%);
  background-size: 200% 100%;
  color: transparent !important; /* Hide text during skeleton loading */
  border-radius: 4px; /* Optional: for text skeletons */
}

.skeleton-text {
  height: 1em; /* Adjust based on typical text height */
  margin-bottom: 0.5em; /* Spacing */
}
.skeleton-text:empty::before {
  content: "\00a0"; /* Non-breaking space to ensure height */
}

.skeleton-image {
  /* Ensure the container itself has the skeleton background */
  /* width and height are already set by .album-art-container */
}

#listening-status.skeleton {
  width: 40%; /* Example width */
  height: 24px; /* Example height */
  margin-left: auto;
  margin-right: auto;
}

/* Spotify Skeleton Specifics */
#spotify-status .album-art-container.skeleton-image {
 /* Uses .album-art-container dimensions */
}
#spotify-status .track-name.skeleton {
  width: 60%;
  height: 20px;
}
#spotify-status .track-additional.skeleton {
  width: 80%;
  height: 18px;
}
#spotify-status #spotify-time.skeleton {
  width: 40%;
  height: 16px;
}

/* Activity Skeleton Specifics */
#activity-status-heading.skeleton {
  width: 60%; /* Example width */
  height: 24px; /* Example height */
  margin-left: auto;
  margin-right: auto;
}

#activity-name.skeleton {
  width: 70%;
  height: 20px;
}
#activity-details.skeleton,
#activity-state.skeleton,
#activity-large-text.skeleton,
#activity-small-text.skeleton {
  width: 90%;
  height: 18px;
}
#activity-time.skeleton {
  width: 50%;
  height: 16px;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
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

// Helper to add skeletons for Spotify card
function addAllSpotifySkeletons() {
  const listeningStatusEl = document.getElementById('listening-status');
  const spotifyStatusCardEl = document.getElementById('spotify-status');
  const spotifyAlbumArtContainerEl = spotifyStatusCardEl.querySelector('.album-art-container');
  const spotifyTrackNameEl = spotifyStatusCardEl.querySelector('.track-name');
  const spotifyTrackAdditionalEl = spotifyStatusCardEl.querySelector('.track-additional');
  const spotifyTimeEl = document.getElementById('spotify-time');
  // Add skeleton classes
  listeningStatusEl.classList.add('skeleton', 'skeleton-text');
  spotifyAlbumArtContainerEl.classList.add('skeleton', 'skeleton-image');
  spotifyTrackNameEl.classList.add('skeleton', 'skeleton-text');
  spotifyTrackAdditionalEl.classList.add('skeleton', 'skeleton-text');
  spotifyTimeEl.classList.add('skeleton', 'skeleton-text');
  spotifyStatusCardEl.style.display = '';
}

async function fetchSpotifyPlayback() {
  const listeningStatusEl = document.getElementById('listening-status');
  const spotifyStatusCardEl = document.getElementById('spotify-status');
  const spotifyAlbumArtContainerEl = spotifyStatusCardEl.querySelector('.album-art-container');
  const spotifyAlbumCoverEl = document.getElementById('album-cover');
  const spotifyTrackNameEl = spotifyStatusCardEl.querySelector('.track-name');
  const spotifyTrackAdditionalEl = spotifyStatusCardEl.querySelector('.track-additional');
  const spotifyTimeEl = document.getElementById('spotify-time');
  const spotifyCanvasEl = document.getElementById('album-canvas');

  const spotifySkeletonElements = [
    listeningStatusEl, 
    spotifyAlbumArtContainerEl, 
    spotifyTrackNameEl, 
    spotifyTrackAdditionalEl, 
    spotifyTimeEl
  ];

  function removeAllSpotifySkeletons() {
    spotifySkeletonElements.forEach(el => el.classList.remove('skeleton', 'skeleton-text', 'skeleton-image'));
    // Ensure specific image skeletons are also cleared if they have specific classes
    spotifyAlbumArtContainerEl.classList.remove('skeleton-image');
    spotifyAlbumCoverEl.style.display = 'none'; // Hide actual image until src is set
    spotifyCanvasEl.style.display = 'none';
  }

  addAllSpotifySkeletons(); // Show skeletons before fetch
  try {
    const response = await fetch('/.netlify/functions/spotify');
    let data = null;

    if (response.status === 204 || !response.ok) {
      console.error("No current track or error. Using last track data if available.");
      data = { is_playing: false, progress_ms: lastTrackData ? lastTrackData.progress_ms : 0, item: null };
    } else {
      data = await response.json();
    }
    
    removeAllSpotifySkeletons(); // Remove skeletons as we are about to process data

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
    removeAllSpotifySkeletons();
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

// Helper to add skeletons for Activity card
function addAllActivitySkeletons() {
  const headingEl = document.getElementById('activity-status-heading');
  const card = document.getElementById('activity-status');
  const albumArtContainer = card.querySelector('.album-art-container');
  const nameEl = document.getElementById('activity-name');
  const detailsEl = document.getElementById('activity-details');
  const stateEl = document.getElementById('activity-state');
  const largeTextEl = document.getElementById('activity-large-text');
  const smallTextEl = document.getElementById('activity-small-text');
  const timeEl = document.getElementById('activity-time');
  headingEl.classList.add('skeleton', 'skeleton-text');
  albumArtContainer.classList.add('skeleton', 'skeleton-image');
  nameEl.classList.add('skeleton', 'skeleton-text');
  detailsEl.classList.add('skeleton', 'skeleton-text');
  stateEl.classList.add('skeleton', 'skeleton-text');
  largeTextEl.classList.add('skeleton', 'skeleton-text');
  smallTextEl.classList.add('skeleton', 'skeleton-text');
  timeEl.classList.add('skeleton', 'skeleton-text');
  card.style.display = '';
}

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
  const smallTextEl = document.getElementById('activity-small-text');
  const timeEl = document.getElementById('activity-time');

  const skeletonElements = [headingEl, nameEl, detailsEl, stateEl, largeTextEl, smallTextEl, timeEl, albumArtContainer];

  // Helper to set text and visibility for an element
  function setTextContentAndVisibility(element, text, isSkeletonTarget = true) {
    if (text) {
      element.innerHTML = text; 
      element.style.display = "";
      if (isSkeletonTarget) element.classList.remove('skeleton', 'skeleton-text');
      element.classList.remove('hidden');
      void element.offsetWidth; 
      element.classList.add('fade-in');
    } else {
      element.innerHTML = "";
      element.style.display = "none";
      if (isSkeletonTarget) element.classList.remove('skeleton', 'skeleton-text');
      element.classList.remove('fade-in');
      element.classList.add('hidden');
    }
  }
  
  function removeAllSkeletons() {
      skeletonElements.forEach(el => el.classList.remove('skeleton', 'skeleton-text', 'skeleton-image'));
      // Ensure specific image skeletons are also cleared if they have specific classes
      albumArtContainer.classList.remove('skeleton-image');
  }

  addAllActivitySkeletons(); // Show skeletons before fetch
  try {
    const res = await fetch('/.netlify/functions/activities');
    
    if (!res.ok) {
      removeAllSkeletons();
      headingEl.style.display = "none";
      card.style.display = "none";
      return;
    }
    const data = await res.json(); 
    if (!data || !data.activity) {
      removeAllSkeletons();
      headingEl.style.display = "none";
      card.style.display = "none";
      return;
    }

    removeAllSkeletons(); // Remove skeletons once data is ready to be processed
    card.style.display = ""; // Ensure card is visible if it was hidden

    const act = data.activity;
    const fromCache = data.from_cache; 

    setTextContentAndVisibility(nameEl, act.name || ""); 

    const currentPrefix = fromCache ? "was" : "am currently";

    // Hide all image elements initially, they will be shown based on logic
    iconEl.style.display = "none";
    vscodeLargeImgEl.style.display = "none";
    vscodeSmallImgEl.style.display = "none";
    albumArtContainer.classList.remove('skeleton-image'); // Clear skeleton from image container

    if (act.name === "Visual Studio Code") {
      setTextContentAndVisibility(headingEl, `🧑‍💻 I ${currentPrefix} working on:`);
      setTextContentAndVisibility(detailsEl, act.details ? `<i class="fa-solid fa-file-lines"></i> ${act.details}` : "");
      setTextContentAndVisibility(stateEl, act.state ? `<i class="fa-solid fa-folder"></i> ${act.state}` : "");
      setTextContentAndVisibility(largeTextEl, act.large_text ? `<i class="fa-solid fa-file-code"></i> ${act.large_text}` : "");
      setTextContentAndVisibility(smallTextEl, act.small_text ? `<i class="fa-brands fa-vscode"></i> ${act.small_text}` : "");

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

    } else { // Game or other activity
      setTextContentAndVisibility(headingEl, `🎮 I ${currentPrefix} playing:`);
      setTextContentAndVisibility(detailsEl, null); 
      setTextContentAndVisibility(stateEl, null);
      setTextContentAndVisibility(largeTextEl, null);
      setTextContentAndVisibility(smallTextEl, null);

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
    removeAllSkeletons();
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
addAllActivitySkeletons();
fetchActivityStatus();
setInterval(fetchActivityStatus, 10000);

addAllSpotifySkeletons();
fetchSpotifyPlayback();
setInterval(fetchSpotifyPlayback, 3000);
setInterval(updateProgressBar, 1000);
</script>