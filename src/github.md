---
layout: layout.njk
title: GitHub | Udaysinh Sapate
styles:
  - /styles/github.css
---
# GitHub Repos

## GitHub Profile

<div class="profile-card">
  <div id="profile-container">
    <div class="loading-spinner">Loading profile...</div>
  </div>
</div>

<div class="graphs">
  <div class="graph-container">
    <h3>Contributions Over Last 5 Years</h3>
    <canvas id="contributionsChart"></canvas>
    <div class="loading-spinner">Loading contributions data...</div>
  </div>
  <div class="graph-container language-container">
    <h3>Language Usage</h3>
    <canvas id="languagePieChart"></canvas>
    <div class="loading-spinner">Loading language data...</div>
  </div>
</div>

## Pinned Repositories

<div class="timeline pinned" id="pinned-repos-container">
  <div class="loading-spinner">Loading pinned repositories...</div>
</div>

## Latest Repositories

<div class="timeline latest" id="latest-repos-container">
  <div class="loading-spinner">Loading repositories...</div>
</div>

<!-- Add Loader -->
<div class="loader" id="loader" style="display: none;">Loading more repositories...</div>

<script>
  let repoData = [];
  let currentIndex = 0;
  const reposPerLoad = 6;

  // Fetch GitHub Profile
  async function fetchGithubProfile() {
    try {
      const response = await fetch('/.netlify/functions/github-profile');
      if (!response.ok) throw new Error('Failed to fetch profile');
      
      const data = await response.json();
      renderProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      document.getElementById('profile-container').innerHTML = 
        '<div class="error-message">Failed to load GitHub profile. Please try again later.</div>';
    }
  }

  // Render GitHub Profile
  function renderProfile(data) {
    const profile = data.profile;
    const profileContainer = document.getElementById('profile-container');
    
    profileContainer.innerHTML = `
      <img src="${profile.avatar_url}" alt="${profile.name}'s avatar" class="profile-picture"/>
      <div class="profile-info">
        <h2>
          ${profile.name}
          <a href="https://github.com/${profile.login}" target="_blank" class="github-link" aria-label="Visit GitHub Profile">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="github-icon" viewBox="0 0 24 24">
              <path d="M12,0.296C5.373,0.296,0,5.668,0,12.3c0,5.303,3.438,9.8,8.205,11.387c0.6,0.111,0.82-0.261,0.82-0.577c0-0.285-0.01-1.04-0.016-2.04c-3.338,0.725-4.042-1.61-4.042-1.61C4.422,18.07,3.633,17.7,3.633,17.7c-1.087-0.744,0.083-0.729,0.083-0.729c1.205,0.084,1.84,1.234,1.84,1.234c1.07,1.836,2.809,1.305,3.495,0.997c0.108-0.775,0.418-1.305,0.76-1.605c-2.665-0.3-5.466-1.334-5.466-5.93c0-1.31,0.469-2.38,1.235-3.22c-0.124-0.303-0.535-1.523,0.117-3.176c0,0,1.008-0.322,3.3,1.23c0.96-0.267,1.98-0.4,3-0.405c1.02,0.005,2.04,0.138,3,0.405c2.28-1.552,3.285-1.23,3.285-1.23c0.653,1.653,0.242,2.873,0.118,3.176c0.77,0.84,1.233,1.91,1.233,3.22c0,4.61-2.807,5.625-5.479,5.92c0.43,0.372,0.823,1.102,0.823,2.222c0,1.606-0.014,2.896-0.014,3.286c0,0.315,0.216,0.694,0.826,0.576C20.565,21.1,24,16.596,24,12.3C24,5.668,18.627,0.296,12,0.296z"/>
            </svg>
          </a>
        </h2>
        <p>${profile.bio}</p>
        <p>Followers: ${profile.followers}</p>
        <p>Following: ${profile.following}</p>
        <p>Total Commits: ${data.totalCommits}</p>
      </div>
    `;
  }

  // Fetch Pinned Repos
  async function fetchPinnedRepos() {
    try {
      const response = await fetch('/.netlify/functions/github-pinned-repos');
      if (!response.ok) throw new Error('Failed to fetch pinned repos');
      
      const data = await response.json();
      renderPinnedRepos(data);
    } catch (error) {
      console.error('Error fetching pinned repos:', error);
      document.getElementById('pinned-repos-container').innerHTML = 
        '<div class="error-message">Failed to load pinned repositories. Please try again later.</div>';
    }
  }

  // Render Pinned Repos
  function renderPinnedRepos(repos) {
    const container = document.getElementById('pinned-repos-container');
    container.innerHTML = '';
    
    repos.forEach(repo => {
      const repoItem = document.createElement('div');
      repoItem.classList.add('timeline-item');
      
      repoItem.innerHTML = `
        <span class="timeline-date">Created: ${new Date(repo.created_at).toISOString().split('T')[0]}</span>
        <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
        <p>${repo.description || 'No description available.'}</p>
        <p class="star">${repo.stargazers_count}</p>
        <p class="fork">${repo.forks_count}</p>
        ${repo.pushed_at ? `<p class="active">Last Active: ${new Date(repo.pushed_at).toISOString().split('T')[0]}</p>` : ''}
      `;
      
      container.appendChild(repoItem);
    });
  }

  // Fetch Latest Repos
  async function fetchLatestRepos() {
    try {
      const response = await fetch('/.netlify/functions/github-latest-repos');
      if (!response.ok) throw new Error('Failed to fetch repos');
      
      repoData = await response.json();
      document.getElementById('latest-repos-container').innerHTML = '';
      loadRepos();
    } catch (error) {
      console.error('Error fetching latest repos:', error);
      document.getElementById('latest-repos-container').innerHTML = 
        '<div class="error-message">Failed to load repositories. Please try again later.</div>';
    }
  }

  // Load repos in batches
  function loadRepos() {
    const reposToLoad = repoData.slice(currentIndex, currentIndex + reposPerLoad);
    reposToLoad.forEach((repo, index) => {
      setTimeout(() => {
        const repoItem = document.createElement('div');
        repoItem.classList.add('timeline-item', 'fade-in'); 
    
        repoItem.innerHTML = `
          <span class="timeline-date">Created: ${new Date(repo.created_at).toISOString().split('T')[0]}</span>
          <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
          <p>${repo.description || 'No description available.'}</p>
          <p class="star">${repo.stargazers_count}</p>
          <p class="fork">${repo.forks_count}</p>
          ${repo.pushed_at ? `<p class="active">Last Active: ${new Date(repo.pushed_at).toISOString().split('T')[0]}</p>` : ''}
        `;
    
        document.getElementById('latest-repos-container').appendChild(repoItem);
      }, index * 100);
    });
    
    currentIndex += reposPerLoad;
  
    if (currentIndex >= repoData.length) {
      document.getElementById('loader').style.display = 'none';
      window.removeEventListener('scroll', handleScroll);
    } else {
      document.getElementById('loader').style.display = 'block';
    }
  }

  function handleScroll() {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
      if (currentIndex < repoData.length) {
        loadRepos();
      }
    }
  }

  // Fetch contributions data and render chart
  async function fetchContributionsData() {
    try {
      const response = await fetch('/.netlify/functions/github-contributions');
      if (!response.ok) throw new Error('Failed to fetch contributions');
      
      const contributionsData = await response.json();
      document.querySelector('.graph-container .loading-spinner').style.display = 'none';
      renderContributionsChart(contributionsData);
    } catch (error) {
      console.error('Error fetching contributions:', error);
      document.querySelector('.graph-container').innerHTML += 
        '<div class="error-message">Failed to load contributions data. Please try again later.</div>';
    }
  }

  // Render contributions chart
  function renderContributionsChart(contributionsData) {
    const ctxContributions = document.getElementById('contributionsChart').getContext('2d');
    const contributionsChart = new Chart(ctxContributions, {
      type: 'bar',
      data: {
        labels: contributionsData.labels,
        datasets: [{
          label: 'Commits',
          data: contributionsData.data,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        devicePixelRatio: 2,
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
            position: 'top'
          },
          tooltip: {
            enabled: true
          }
        }
      }
    });
  }

  // Fetch language stats and render chart
  async function fetchLanguageStats() {
    try {
      const response = await fetch('/.netlify/functions/github-language-stats');
      if (!response.ok) throw new Error('Failed to fetch language stats');
      
      const languageData = await response.json();
      document.querySelectorAll('.language-container .loading-spinner')[0].style.display = 'none';
      renderLanguagePieChart(languageData);
    } catch (error) {
      console.error('Error fetching language stats:', error);
      document.querySelector('.language-container').innerHTML += 
        '<div class="error-message">Failed to load language data. Please try again later.</div>';
    }
  }

  // Render language pie chart
  function renderLanguagePieChart(languageData) {
    // Calculate total bytes
    const totalBytes = Object.values(languageData).reduce((a, b) => a + b, 0);
    
    // Calculate percentage for each language
    const languagePercentages = Object.fromEntries(
      Object.entries(languageData).map(([lang, bytes]) => [lang, ((bytes / totalBytes) * 100).toFixed(2)])
    );

    function getThemeTextColor() {
      return getComputedStyle(document.body).getPropertyValue('--text-color');
    }

    const ctxLanguages = document.getElementById('languagePieChart').getContext('2d');
    const languagePieChart = new Chart(ctxLanguages, {
      type: 'pie',
      data: {
        labels: Object.keys(languagePercentages),
        datasets: [{
          data: Object.values(languagePercentages),
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0',
            '#9966FF', '#FF9F40', '#E7E9ED', '#76A346'
          ],
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 16,
              font: {
                size: 11
              },
              color: getThemeTextColor()
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                return `${label}: ${value}%`;
              }
            }
          }
        }
      }
    });
  }

  // Initialize
  document.addEventListener('DOMContentLoaded', () => {
    fetchGithubProfile();
    fetchPinnedRepos();
    fetchLatestRepos();
    fetchContributionsData();
    fetchLanguageStats();
    
    window.addEventListener('scroll', handleScroll);
  });
</script>
