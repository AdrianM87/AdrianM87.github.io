---
layout: page
title: Bookmarks
permalink: /bookmarks/
---
<ul>
{% for post in site.categories.bookmarks reversed %}
  <li><a href="{{ post.url }}">{{ post.title }}</a></li>
{% endfor %}
  [an example](http://www.example.com/)
</ul>
