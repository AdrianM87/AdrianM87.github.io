(function (window) {
    "use strict";

    var globals = {};
    onDomReady(initAPP);

    function initAPP() {
        _fc.initHelpers();
        enableGlobals();
        activateSearchFunction();
    };

    var _fc = (function _fc() { 

        var _fc = {
            initHelpers: function initHelpers() {
                _fc._polyfills();
            },

            event: function event(data) {
                _fc._addEvent(data.onElement, data.event, data.callback);
            },

            get: function get(url) {
                return _fc._xhr({
                    "method": "GET",
                    "url": url
                });
            },

            search: function search(data) {
                return _fc.get(data.url).then(function (posts) {
                    var results = _fc.filter({
                        "posts": posts,
                        "keyword": data.keyword
                    });

                    if (results.length) {
                        var resultList = '';

                        results.forEach(function (item) {
                            resultList += "<li><a href='" + item.url + "'>" + item.title + "</a></li>";
                        });

                        _fc.setHtml({
                            "selector": globals.searchList,
                            "html": resultList
                        });

                        return;
                    }

                    _fc.setHtml({
                        "selector": globals.searchList,
                        "html": "<li class='not-found'>No results found</li>"
                    });
                });
            },

            filter: function filter(data) {
                var results = undefined,
                    keyword = data.keyword.toLowerCase(),
                    posts = JSON.parse(data.posts),
                    // isAmongTags = [],
                    isInTitle = false,
                    isInSummary = false,
                    isInAuthorName = false;

                return posts.items.filter(function (item) {
                    // item.tags = item.tags.map(function (tag) {
                    //     return tag.toLowerCase();
                    // });

                    // var isAmongTags = item.tags.filter(function (tag) {
                    //     return ~tag.indexOf(keyword) ? true : null;
                    // });

                    // isAmongTags = isAmongTags.length ? true : false;
                    isInTitle = ~item.title.toLowerCase().indexOf(keyword) ? true : false;
                    isInSummary = ~item.summary.toLowerCase().indexOf(keyword) ? true : false;
                    isInAuthorName = ~item.author.name.toLowerCase().indexOf(keyword) ? true : false;

                    return (isInTitle || isInSummary || isInAuthorName) ? item : null;
                });
            },

            setHtml: function setHtml(data) {
                document.querySelector(data.selector).innerHTML = data.html;
            },

            debounce: function debounce(func, wait, immediate) {
                var timeout;
                return function () {
                    var context = this,
                        args = arguments;
                    var later = function () {
                        timeout = null;
                        if (!immediate) func.apply(context, args);
                    };
                    var callNow = immediate && !timeout;
                    clearTimeout(timeout);
                    timeout = setTimeout(later, wait);
                    if (callNow) func.apply(context, args);
                };
            },

            _addEvent: function _addEvent(element, event, callback) {
                if (element.attachEvent)
                    return element.attachEvent('on' + event, callback);
                else
                    return element.addEventListener(event, callback, false);
            },

            _xhr: function _xhr(data) {
                return new Promise(function (resolve, reject) {
                    var xhr = new XMLHttpRequest();
                    xhr.open(data.method, data.url);
                    xhr.onload = function () {
                        resolve(xhr.responseText);
                    };
                    xhr.onerror = function () {
                        reject(xhr.statusText);
                    };
                    xhr.send();
                });
            },

            _polyfills: function _polyfills() {
                _fc._filterObjectPolyfill();
            },

            _filterObjectPolyfill: function _filterObjectPolyfill() {
                Object.filter = function (obj, predicate) {
                    var result = {},
                        key;

                    for (key in obj) {
                        if (obj.hasOwnProperty(key) && !predicate(obj[key])) {
                            result[key] = obj[key];
                        }
                    }

                    return result;
                };
            }
        };

        var Helpers = {
            initHelpers: _fc.initHelpers,
            event: _fc.event,
            get: _fc.get,
            search: _fc.search,
            filter: _fc.filter,
            setHtml: _fc.setHtml,
            debounce: _fc.debounce,
        };

        return Helpers;
    })();

    function onDomReady(fn) {
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener('DOMContentLoaded', fn);
        }
    };

    function activateSearchFunction() {
        if (globals.searchInput) {

            globals.searchTrigger.addEventListener('click', function(e){
                globals.searchForm.classList.toggle('d-none');
                return false;
            });
            
            globals.searchSubmit.addEventListener('click', function(e){
                e.preventDefault();
                e.stopPropagation();
                _fc.debounce(searchForPosts, 1000);
            }); 

            var searchForPosts = function () {
                if (globals.searchInput.value.length) {
                    _fc.search({
                        "url": BASE_URL + 'feed.json',
                        "keyword": globals.searchInput.value
                    });

                    return;
                }

                _fc.setHtml({
                    "selector": globals.searchList,
                    "html": ""
                });
            };

            _fc.event({
                "onElement": globals.searchInput,
                "event": "keyup",
                "callback": _fc.debounce(searchForPosts, 1000)
            });
        }
    };



    function enableGlobals() {
        globals.htmlElem = document.getElementsByTagName('html')[0];
        globals.bodyElem = document.getElementsByTagName('body')[0];
        globals.searchTriggerMobile = globals.bodyElem.querySelector('#searchTriggerMobile');
        globals.searchTrigger = globals.bodyElem.querySelector('#searchTrigger');
        globals.searchForm = globals.bodyElem.querySelector('#searchForm');
        globals.searchInput = globals.bodyElem.querySelector('#searchInput');
        globals.searchSubmit = globals.bodyElem.querySelector('#searchSubmit');
        globals.searchList = ".search-results";
    };
})(window);

var CookieStash = (function () {

    var $stash = {}; // make a private data stash
    var stashID = 0; // ID to reference the private stash instance

    function CookieStash() {
        this.sID = stashID++;
        $stash[this.sID] = {}; // make an object to manage each instance

        // use a private stash, instead of 'this'
        $stash[this.sID].maxDuration = 365,
            $stash[this.sID].date = new Date();
    }

    CookieStash.prototype.getMaxDuration = function () {
        return $stash[this.sID].maxDuration;
    }

    CookieStash.prototype.getDate = function () {
        return $stash[this.sID].date;
    }

    CookieStash.prototype.returnCookieFormat = function (type, name) {
        var allCookies = document.cookie.split(';'); // make an array with all the available cookies

        for (var ii = 0; ii < allCookies.length; ii++) //search through all cookies
        {
            var needed = allCookies[ii], // get the current iteration
                needed = needed.split('='), // create an array of key with value
                key = needed[0].trim(), // get the key
                value = needed[1]; // get the value

            if (key == name) {
                if (type == 'get')
                    return value; // return the cookie value

                else if (type == 'isset') {
                    return true;
                }

            }
        }

        return false;
    }

    CookieStash.prototype.get = function (name) // get cookie
    {
        return this.returnCookieFormat('get', name);
    }

    CookieStash.prototype.isset = function (name) // is cookie set?
    {
        return this.returnCookieFormat('isset', name);
    }

    CookieStash.prototype.set = function (name, value) // set cookie
    {
        var date = this.getDate(),
            duration = this.getMaxDuration();

        date.setTime(date.getTime() + (duration * 24 * 60 * 60 * 1000));
        var expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + "; " + expires;
    }

    CookieStash.prototype.setWithExpiry = function (name, value, days) // set cookie with a defined number of days
    {
        var date = this.getDate();


        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "expires=" + date.toUTCString();
        document.cookie = name + "=" + value + "; " + expires;
    }

    CookieStash.prototype.erase = function (name) // delete cookie
    {
        document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    }

    return CookieStash;
}());

var cookieStash = new CookieStash();
//cookieStash.set('isFirstVisit', 1) // set cookie with just the value (will self-destruct in the defaulted no. of days - see getMaxDuration method)
// console.log(cookieStash.get('isFirstVisit')) // it it's not set, it'll return false; otherwise, returns the value
// cookieStash.get('isFirstVisit') // it it's not set, it'll return false; otherwise, returns the value
// cookieStash.isset('isFirstVisit') // returns true / false
// cookieStash.setWithExpiry('isFirstVisit', 1, 30) // set cookie with value and expiry date
// cookieStash.set('isFirstVisit', 1) // set cookie with just the value (will self-destruct in the defaulted no. of days - see getMaxDuration method)
// cookieStash.erase('isFirstVisit') // delete cookie