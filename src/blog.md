--- 
layout: layout.njk
title: Blog
---
# Blog

Welcome to my blog! Here you will find my latest posts on various topics related to software development, AI, and more.

<ul>
  {% for post in collections.blog %}
    <li>
      <a href="{{ post.url }}">{{ post.data.title }}</a> - {{ post.date | date: "yyyy-MM-dd" }}
    </li>
  {% endfor %}
</ul>