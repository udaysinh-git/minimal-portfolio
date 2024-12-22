--- 
layout: layout.njk
title: GitHub Repos
---
# GitHub Repos

Here are some of my GitHub repositories:

<div class="repo-grid">
  {% for repo in githubRepos %}
    <div class="repo-card">
      <h3><a href="{{ repo.html_url }}" target="_blank">{{ repo.name }}</a></h3>
      <p>{{ repo.description }}</p>
      <p>⭐ {{ repo.stargazers_count }} | 🍴 {{ repo.forks_count }}</p>
    </div>
  {% endfor %}
</div>