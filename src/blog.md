---
layout: layout.njk
title: Blog
---
# Blog

Welcome to my blog! Here you will find my latest posts on various topics related to software development, AI, and more.

<div class="font-controls">
  <button id="increase-font">A+</button>
  <button id="decrease-font">A-</button>
</div>

<ul class="blog-list">
  {% for post in collections.blog %}
    <li class="blog-item">
      <a href="{{ post.url }}">{{ post.data.title }}</a> - {{ post.date | date: "yyyy-MM-dd" }}
    </li>
  {% endfor %}
</ul>