---
layout: page
title: Notes
permalink: /notes/
---
<ul>
{% for post in site.categories.notes reversed %}
  <li><a href="{{ post.url }}">{{ post.title }}</a></li>
{% endfor %}
</ul>
