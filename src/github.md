---
layout: layout.njk
title: GitHub Repos
---
# GitHub Repos

## GitHub Profile
<div class="profile-card">
  <img src="{{ githubProfile.profile.avatar_url }}" alt="{{ githubProfile.profile.name }}'s avatar" class="profile-picture"/>
  <div class="profile-info">
    <h2>
      {{ githubProfile.profile.name }}
      <!-- GitHub Profile Link -->
      <a href="https://github.com/{{ githubProfile.profile.login }}" target="_blank" class="github-link" aria-label="Visit GitHub Profile">
        <!-- GitHub Icon SVG -->
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="github-icon" viewBox="0 0 24 24">
          <path d="M12,0.296C5.373,0.296,0,5.668,0,12.3c0,5.303,3.438,9.8,8.205,11.387c0.6,0.111,0.82-0.261,0.82-0.577c0-0.285-0.01-1.04-0.016-2.04c-3.338,0.725-4.042-1.61-4.042-1.61C4.422,18.07,3.633,17.7,3.633,17.7c-1.087-0.744,0.083-0.729,0.083-0.729c1.205,0.084,1.84,1.234,1.84,1.234c1.07,1.836,2.809,1.305,3.495,0.997c0.108-0.775,0.418-1.305,0.76-1.605c-2.665-0.3-5.466-1.334-5.466-5.93c0-1.31,0.469-2.38,1.235-3.22c-0.124-0.303-0.535-1.523,0.117-3.176c0,0,1.008-0.322,3.3,1.23c0.96-0.267,1.98-0.4,3-0.405c1.02,0.005,2.04,0.138,3,0.405c2.28-1.552,3.285-1.23,3.285-1.23c0.653,1.653,0.242,2.873,0.118,3.176c0.77,0.84,1.233,1.91,1.233,3.22c0,4.61-2.807,5.625-5.479,5.92c0.43,0.372,0.823,1.102,0.823,2.222c0,1.606-0.014,2.896-0.014,3.286c0,0.315,0.216,0.694,0.826,0.576C20.565,21.1,24,16.596,24,12.3C24,5.668,18.627,0.296,12,0.296z"/>
        </svg>
      </a>
    </h2>
    <p>{{ githubProfile.profile.bio }}</p>
    <p>Followers: {{ githubProfile.profile.followers }}</p>
    <p>Following: {{ githubProfile.profile.following }}</p>
    <p>Total Commits: {{ githubProfile.totalCommits }}</p>
  </div>
</div>

<div class="graphs">
  <div class="graph-container">
    <h3>Contributions Over Last 5 Years</h3>
    <canvas id="contributionsChart"></canvas>
  </div>
  <div class="graph-container">
    <h3>Language Usage</h3>
    <canvas id="languagePieChart"></canvas>
  </div>
</div>

## Pinned Repositories
<div class="timeline pinned">
  {% for repo in pinnedRepos %}
  <div class="timeline-item">
    <span class="timeline-date">Created: {{ repo.created_at | date: "yyyy-MM-dd" }}</span>
    <h3><a href="{{ repo.html_url }}" target="_blank">{{ repo.name }}</a></h3>
    <p>{{ repo.description }}</p>
    <p class="star">{{ repo.stargazers_count }}</p>
    <p class="fork">{{ repo.forks_count }}</p>
    {% if repo.pushed_at %}
    <p class="active">Last Active: {{ repo.pushed_at | date: "yyyy-MM-dd" }}</p>
    {% endif %}
  </div>
  {% endfor %}
</div>

## Latest Repositories
<div class="timeline latest" id="latest-repos-container">
  <!-- Repositories will be loaded here -->
</div>

<!-- Repository Data -->
<script id="repo-data" type="application/json">
{{ latestRepos | jsonify }}
</script>

<!-- Add Loader -->
<div class="loader" id="loader">Loading more repositories...</div>

<!-- Lazy Load Script -->
<script>
  const repoContainer = document.getElementById('latest-repos-container');
  const repoData = JSON.parse(document.getElementById('repo-data').textContent);
  const reposPerLoad = 6;
  let currentIndex = 0;

  function loadRepos() {
    const reposToLoad = repoData.slice(currentIndex, currentIndex + reposPerLoad);
    reposToLoad.forEach((repo, index) => {
      setTimeout(() => {
        const repoItem = document.createElement('div');
        repoItem.classList.add('timeline-item', 'fade-in'); // Add 'fade-in' class for animation
        
        repoItem.innerHTML = `
          <span class="timeline-date">Created: ${new Date(repo.created_at).toISOString().split('T')[0]}</span>
          <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
          <p>${repo.description || 'No description available.'}</p>
          <p class="star">${repo.stargazers_count}</p>
          <p class="fork">${repo.forks_count}</p>
          ${repo.pushed_at ? `<p class="active">Last Active: ${new Date(repo.pushed_at).toISOString().split('T')[0]}</p>` : ''}
        `;
        
        repoContainer.appendChild(repoItem);
      }, index * 100); // Delay each item by 100ms
    });
    currentIndex += reposPerLoad;
    
    if (currentIndex >= repoData.length) {
      document.getElementById('loader').style.display = 'none';
      window.removeEventListener('scroll', handleScroll);
    }
  }

  function handleScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
      if (currentIndex < repoData.length) {
        loadRepos();
      }
    }
  }

  window.addEventListener('scroll', handleScroll);

  // Initial Load
  loadRepos();

  // Contributions Chart
  const contributionsData = {{ contributionsData | jsonify }};
  const ctxContributions = document.getElementById('contributionsChart').getContext('2d');
  const contributionsChart = new Chart(ctxContributions, {
    type: 'line', // Changed from 'bar' to 'line'
    data: {
      labels: contributionsData.labels,
      datasets: [{
        label: 'Commits',
        data: contributionsData.data,
        fill: false,
        borderColor: 'rgba(54, 162, 235, 1)',
        tension: 0.1
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { 
          display: true, 
          title: { display: true, text: 'Year' } 
        },
        y: { 
          display: true, 
          title: { display: true, text: 'Number of Commits' },
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
        tooltip: {
          enabled: true,
        }
      }
    }
  });

  // Language Pie Chart
  const languageData = {{ languageStats | jsonify }};
  const ctxLanguages = document.getElementById('languagePieChart').getContext('2d');
  const languagePieChart = new Chart(ctxLanguages, {
    type: 'pie',
    data: {
      labels: Object.keys(languageData),
      datasets: [{
        data: Object.values(languageData),
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
          '#9966FF', '#FF9F40', '#E7E9ED', '#76A346'
        ],
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'right',
        }
      }
    }
  });
</script>