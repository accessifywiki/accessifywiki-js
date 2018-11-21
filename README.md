
[![Build status — Travis-CI][travis-icon]][travis]
[![Developing with accessibility in mind — Google search][a11y-icon]][a11y-search]

# Accessify Wiki JS

_Fixing the Web for all, one site at a time._

We are the open, transparent accessibility middleware.

 * [accessifywiki.github.io][w]

## Links

 * http://accessify.wikia.com/wiki/Accessify_Wiki

## The repos

 * [@accessifywiki/accessifywiki-api][] — new
 * [@accessifywiki/accessifywiki.github.io][] — new
 * [@yatil/accessifyhtml5.js][]
 * [@nfreear/accessify-wiki][] — legacy
 * [@nfreear/wp-accessify][] — WordPress
 * [@nfreear/accessify-client-php][]


## Bookmarklet

```js
javascript:(
  function (D, s, el, rnd, AC5U) {
    s = D.createElement(el); /* var%20s=.. */
    s.src = 'https://accessifywiki.appspot.com/browser/js/accessifyhtml5-marklet.js?x=' + rnd;
    s.onerror = function (e) { console.error('JS onload error. Probably CSP?', e.target.src, e) };
    D.body.appendChild(s)
  }
)(document, 0, 'script', Math.random(), {})
```

---
Copyright © Nick Freear, 28 March 2013.


[w]: https://accessifywiki.github.io/

[gpl]: https://gnu.org/licenses/gpl-3.0.en.html "License: GNU General Public License [GPL-3.0+]"
[travis]: https://travis-ci.org/accessifywiki/accessifywiki-js
[travis-icon]: https://travis-ci.org/accessifywiki/accessifywiki-js.svg
[a11y-icon]:   https://img.shields.io/badge/accessibility-in_mind-orange.svg
    "'Designing & developing with accessibility in mind' — search..."
[webaim]: http://webaim.org/
[w3c]:  https://w3.org/wiki/Accessibility_basics
[a11y-search]: https://google.com/search?q=Web+accessibility+primer,+in+mind

[@accessifywiki/accessifywiki-api]: https://github.com/accessifywiki/accessifywiki-api
    "New PHP/Slim-based service — Google App Engine"
[@accessifywiki/accessifywiki.github.io]: https://github.com/accessifywiki/accessifywiki.github.io
    "Accessibility fix repo. — Jekyll/GitHub Pages"
[@yatil/accessifyhtml5.js]: https://github.com/yatil/accessifyhtml5.js
[@nfreear/accessify-wiki]: https://github.com/nfreear/accessify-wiki
    "Legacy Python/webapp2-based service — Google App Engine"
[@nfreear/wp-accessify]: https://github.com/nfreear/wp-accessify "WordPress plugin"
[@nfreear/accessify-client-php]: https://github.com/nfreear/accessify-client-php "PHP client library"
