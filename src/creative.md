---
layout: layout.njk
title: Creative
---

<!-- Add Font Awesome for icons -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

<div contenteditable="true">
    <h1 class="creative-title">Creative</h1>
</div>
<p id="listening-status" class="listening-status"><i class="fa-solid fa-music"></i> I'm listening to:</p>

<!-- Spotify Card -->
<div id="spotify-status" class="spotify-status">
  <div class="spotify-card">
    <div class="album-art-container">
      <!-- Optional Spotify Canvas. Shown if available -->
      <img id="album-canvas" class="album-canvas" src="" alt="Spotify Canvas" style="display: none;">
      <!-- Album Cover -->
      <img id="album-cover" class="album-cover" src="" alt="Album Art">
    </div>
    <div class="track-info-container">
      <!-- The track name will be typed out -->
      <div class="track-name"></div>
      <!-- Additional details fade in -->
      <div class="track-additional hidden"></div>
      <!-- Time and progress bar -->
      <div id="spotify-time" class="spotify-time"></div>
      <div id="spotify-progress-container" class="spotify-progress-container">
        <div id="spotify-squares" class="spotify-squares">
          <!-- Cubes will be generated dynamically based on viewport width -->
        </div>
      </div>
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

async function fetchSpotifyPlayback() {
  try {
    const response = await fetch('/.netlify/functions/spotify');
    if (response.ok) {
      const data = await response.json();
      
      // When no track is found, update status text accordingly.
      if (!data.item) {
        console.error("No track currently playing.");
        document.getElementById('listening-status').innerHTML = `<i class="fa-solid fa-music"></i> I was listening to:`;
        return;
      }
      
      // Adjust playing status text
      if (!data.is_playing) {
        document.getElementById('listening-status').innerHTML = `<i class="fa-solid fa-music"></i> I was listening to:`;
        document.getElementById('spotify-status').classList.add('paused');
      } else {
        document.getElementById('listening-status').innerHTML = `<i class="fa-solid fa-music"></i> I'm listening to:`;
        document.getElementById('spotify-status').classList.remove('paused');
      }
      
      // If the track changes, animate album art and launch typewriter effect
      if (data.item.id !== lastTrackId) {
        lastTrackId = data.item.id;
        const albumCover = document.getElementById('album-cover');
        albumCover.classList.add('song-change');
        setTimeout(() => albumCover.classList.remove('song-change'), 1000);
        
        const trackNameEl = document.querySelector('.track-name');
        typeWriter(trackNameEl, data.item.name, 60, (finalText) => {
          trackNameEl.innerHTML = `<a href="${data.item.external_urls.spotify}" target="_blank">${finalText}</a>`;
        });
        
        const trackAdditionalEl = document.querySelector('.track-additional');
        const artistHtml = data.item.artists
              .map(artist => `<a href="${artist.external_urls.spotify}" target="_blank"><i class="fa-solid fa-user"></i> ${artist.name}</a>`)
              .join(', ');
        trackAdditionalEl.innerHTML = `<i class="fa-solid fa-compact-disc"></i> <em>${data.item.album.name}</em> &mdash; ${artistHtml}`;
        trackAdditionalEl.classList.remove('hidden');
        void trackAdditionalEl.offsetWidth; // Trigger reflow to restart animation.
        trackAdditionalEl.classList.add('fade-in');
      }
      
      currentProgress = data.progress_ms;
      trackDuration = data.item.duration_ms;
      lastFetchTime = Date.now();
      
      // Update album cover display.
      const albumCoverUrl = (data.item.album.images && data.item.album.images.length) 
                            ? data.item.album.images[0].url : '';
      const albumCoverEl = document.getElementById('album-cover');
      if (albumCoverUrl) {
        albumCoverEl.src = albumCoverUrl;
        albumCoverEl.style.display = 'block';
      } else {
        albumCoverEl.style.display = 'none';
      }
      
      // Update canvas if available (assuming canvas URL in data.item.canvas_url)
      const canvasUrl = data.item.canvas_url || '';
      const canvasEl = document.getElementById('album-canvas');
      if (canvasUrl) {
        canvasEl.src = canvasUrl;
        canvasEl.style.display = 'block';
      } else {
        canvasEl.style.display = 'none';
      }
      
    } else {
      console.error("Error fetching playback data.");
    }
  } catch (error) {
    console.error("Error fetching Spotify playback:", error);
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

// Initial fetch and periodic update
fetchSpotifyPlayback();
setInterval(fetchSpotifyPlayback, 3000);
setInterval(updateProgressBar, 1000);
</script>