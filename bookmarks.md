---
layout: page
title: Bookmarks
permalink: /bookmarks/
---
<ul>
{% for post in site.categories.bookmarks reversed %}
  <li><a href="{{ post.url }}">{{ post.title }}</a></li>
{% endfor %}
</ul>

 [Postman chaining requests](http://blog.getpostman.com/2014/01/27/extracting-data-from-responses-and-chaining-requests/)
