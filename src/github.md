---
layout: layout.njk
title: GitHub Repos
---
# GitHub Repos

## Pinned Repositories
<div class="timeline pinned">
  {% for repo in pinnedRepos %}
  <div class="timeline-item">
    <span class="timeline-date">Created: {{ repo.created_at | date: "yyyy-MM-dd" }}</span>
    <h3><a href="{{ repo.html_url }}" target="_blank">{{ repo.name }}</a></h3>
    <p>{{ repo.description }}</p>
    <p class="star">⭐ {{ repo.stargazers_count }}</p>
    <p class="fork">🍴 {{ repo.forks_count }}</p>
    {% if repo.pushed_at %}
    <p class="active">🕒 Last Active: {{ repo.pushed_at | date: "yyyy-MM-dd" }}</p>
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
          <p class="star">⭐ ${repo.stargazers_count}</p>
          <p class="fork">🍴 ${repo.forks_count}</p>
          ${repo.pushed_at ? `<p class="active">🕒 Last Active: ${new Date(repo.pushed_at).toISOString().split('T')[0]}</p>` : ''}
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
</script>