---
layout: page
title: Hobby
permalink: /hobby/
---
<ul>
{% for post in site.categories.hobby reversed %}
  <li><a href="{{ post.url }}">{{ post.title }}</a></li>
{% endfor %}
</ul>
