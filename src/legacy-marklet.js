/*!
 Bookmarklet to apply AccessifyHTML5.js (WAI-ARIA fixes) to various web sites.

 Copyright Nick Freear, 28 March 2013.

 https://github.com/nfreear/accessify-wiki
*/

/* -- jslint browser:true, devel:true, indent:2 */

window.AC5U = window.AC5U || {};

(function (W, D, L, UA, G, AccessifyHTML5) {
  'use strict';

  var script = 'https://accessifywiki--1.appspot.com/browser/js/accessifyhtml5.js';
  var style = 'https://accessifywiki--1.appspot.com/browser/pix/marklet.css';
  var callback = '__callback';

  var fixesUrl = 'https://accessifywiki--1.appspot.com/fix?min=1&callback=window.AC5U.';

  const HOME_URL = 'https://accessify.wikia.com';
  const HOME = HOME_URL.replace(/https?:\/\//, '');

  const LANG = i18nSetup();

  const QUERY_TIMEOUT = 15 * 1000; // Milli-seconds
  const STORE_MAX_AGE = 15 * 60; // Seconds
  const STORE_TYPE = 'sessionStorage'; // Or 'local'
  const STORE_PREFIX = 'acfy.' + LANG + '.';

  const B_EXIT = browserFeatures();

  var th;
  var logi;
  var logp;

  if (B_EXIT) {
    log(B_EXIT + '. ' + t('Exiting'));
    return;
  }

  // ======================================================

  logInit();

  attachCallback();

  // AC5U global. HACK - Inject test fixes.
  const S_FIXES = G.test_fixes ? G.test_fixes : getStorage();

  if (S_FIXES) {
    log(t('Getting cached fixes.'));

    addScript(script, function () {
      G[ callback ](S_FIXES);
    });
  } else {
    fixesUrl += callback + '&url=' + encodeURIComponent(L.href) + '&lang=' + LANG;

    log(t('Querying for fixes..'), L.host, fixesUrl);

    th = W.setTimeout(function () {
      log(t('Unknown problem/ too slow/ fixes not allowed (security)'));
      setIcon('unknown');
    }, QUERY_TIMEOUT);

    addScript(script);
    addScript(fixesUrl);
  }

  // ======================================================

  function attachCallback () {
    // Callback is global. (window["callback"])
    G[ callback ] = function (rsp) {
      var fixes = rsp;
      var config = rsp[ '_CONFIG_' ] || null;

      W.clearTimeout(th);

      if (typeof rsp.stat !== 'undefined' && rsp.stat === 'fail') {
        log(rsp.message, rsp.code);
        setIcon('fail');

        if (parseInt(rsp.code) !== 404) {
          return;
        }

        setIcon('not_found');
        // log("Sorry, no domain matched.\n", host);
        log(t('To add some fixes please visit our site') + '   \n\n  ›› ' + HOME + '\n');
      } else {
        if (config && Object.size(fixes) <= 1) {
          setIcon('need_fixes');
          log(t("There are no fixes yet - probably a 'Stub'."));
          log(t('To add some fixes please visit our site') + '   \n\n  ›› ' + HOME + '\n');
          return;
        }

        log(t('Fixes found.'), fixes);

        var res = AccessifyHTML5(false, fixes);

        addFixStyles(fixes);

        if (res.fail.length > 0) {
          setIcon('fail');
        } else {
          setIcon('ok');
        }

        log(t('OK.') + ' ' +
        t('%nFixes fixes applied, %nErrors errors.', {
          '%nFixes': res.ok.length, '%nErrors': res.fail.length }) + ' \n', res);
        log(t('To add some fixes please visit our site') + '   \n\n  ›› ' + HOME + '\n');
      }

      if (!S_FIXES) {
        setStorage(rsp); // Fixes or 404 Not Found response.
      }
    };
  }

  // https://stackoverflow.com/questions/4845762/onload-handler-for-script-tag-in-IE
  function addScript (src, onload) {
    var s = D.createElement('script');
    s.src = src;
    s.type = 'text/javascript';
    s.charset = 'utf-8';
    // s.setAttribute("async", "");
    if (onload) {
      // for nonIE browsers.
      s.onload = onload;

      // for IE browsers.
      ieLoadBugFix(s, onload);
    }
    D.body.appendChild(s);
    // D.getElementsByTagName("body")[0].appendChild(s);
  }

  function addStyle () {
    var s = D.createElement('link');
    s.href = style;
    s.rel = 'stylesheet';
    D.body.appendChild(s);
  }

  function addFixStyles (obj) {
    if (!obj._STYLE_) {
      log(t('No _STYLE_ found.'), obj);
      return;
    }
    if (typeof obj._STYLE_ !== 'string') {
      log('Error, expecing string for _STYLE_.', typeof obj._STYLE_);
      return;
    }
    log(t('OK. Style found.'), obj._STYLE_);

    var style = D.createElement('style');
    // style.setAttribute("type", "text/css");
    style.id = 'acfy-fixes-style';
    style.textContent = obj._STYLE_;

    D.head.appendChild(style);
  }

  function ieLoadBugFix (scriptEl, callback) {
    if (!UA.match(/MSIE [78].0/)) return;

    if (scriptEl.readyState === 'loaded' || scriptEl.readyState === 'completed') {
      callback();
    } else {
      setTimeout(function () {
        ieLoadBugFix(scriptEl, callback);
      }, 100);
    }
  }

  function log (str) {
    if (logp && !str.match(/Storage|Style/i)) {
      // Maybe we use a multi-line title attribute ?!
      // Was: logp.innerHTML += "&bull; " + s + "<br>\n"; //&rsaquo; //\203A
      logp.title += '  › %s \n'.replace(/%s/, str);
      logi.innerText += '› %s\n'.replace(/%s/, str);
    }

    if (typeof console === 'object') {
      // console.log(arguments.length > 1 ? arguments : s);
      if (UA.match(/MSIE/)) {
        console.log(str);
      } else {
        console.log('AccessifyHTML5', arguments);
      }
    }
  }

  function logInit () {
    if (!logp) {
      bodyClasses();
      addStyle();

      logp = D.createElement('div');
      logp.id = 'AC5-log';
      logp.title = '\n ' + t('Accessify HTML5 log:') + ' \n\n';
      logp.setAttribute('aria-live', 'polite');
      logp.setAttribute('role', 'log');
      logp.innerHTML +=
        '<a href="' + HOME_URL + '">' + t('Accessify Wiki') + '</a> .. ' +
        '<span class="ico">*</span> <pre></pre>';

      D.body.appendChild(logp);

      logi = logp.querySelector('pre');
    }
    setIcon('loading');
  }

  function setIcon (key) {
    const TEXTS = {
      loading: t('Loading'),
      not_found: t('Not found'),
      need_fixes: t('Need fixes'), // Category: Stub.
      unknown: t('Unknown error'),
      fail: t('Error woops'),
      ok: t('Success')
    };

    var el = D.querySelector('#AC5-log .ico');

    el.innerHTML = TEXTS[ key ];
    logp.className = key;
  }

  /* Gettext i18n/translation/localization placeholder.
   http://stackoverflow.com/questions/377961/efficient-javascript-string-replacement
  */
  function t (msgid, args) {
    var str = (G.texts && G.texts[msgid]) ? G.texts[msgid] : msgid;

    return args ? str.replace(/(%\w+)/g, function (m, key) {
      return args.hasOwnProperty(key) ? args[key] : key;
    }) : str;
  }

  function i18nSetup () {
    var lang = G.lang || navigator.language;
    log(t('Setup translation: ') + lang, G);
    return lang;
  }

  // ======================================================

  function browserFeatures () {
    var bExit = false;

    if (W.parent !== W && W.top !== W.self) { // MSIE 8 needs the "top" test.
      bExit = t('We do not support frames at present');
    } else if (!L.protocol.match(/^https?:/)) {
      bExit = 'We only support HTTP/S urls';
    } else if (L.href.match(/(run\/accessify-|accessify\.wikia\.com|\/X-localhost)/)) {
      // (/(run\/accessify-|accessify.wikia.com|accessifyw[^\.]+.appspot.com|\/localhost)/)
      bExit = 'Not fixing Accessify Wiki or localhost';

      // Feature detection.
    } else if (typeof D.querySelector === 'undefined') { // http://w3.org/TR/selectors-api2
      bExit = 'Not supported by browser, w3c:selectors-api2';
    } else if (!W[ 'sessionStorage' ]) {
      bExit = 'Not supported by browser, w3c:webstorage'; // http://w3.org/TR/webstorage
    } else if (typeof JSON !== 'object' || typeof JSON.parse !== 'function') {
      // https://github.com/phiggins42/has.js | http://es5.github.io/#x15.12
      bExit = 'Not supported by browser: JSON.parse';
    } else if (isPlainText()) {
      bExit = 'Ignoring plain-text file';
    } else if (isPluginFile()) {
      bExit = 'Ignoring PDF or multimedia file';
    }

    return bExit;
  }

  function isPlainText () {
    // Chrome plain-text test (inc. Javascript/ CSS file views)
    // ajax.get( self ) - stackoverflow?
    // https://github.com/rsdoiel/mimetype-js
    var ch = D.querySelectorAll('body > *');

    var pre = D.querySelectorAll('body > pre[ style ]');

    return ch.length < 4 && pre.length === 1;
  }

  /*
   OU pod: feeds/Alan-Turing/turing01.mp3 | http://podcast.open.ac.uk/pod/Alan-Turing
   OU pod: feeds/2284_60secondadventuresinastronomy/22898_1__the_big_bang.m4v
   OU pod: feeds/2284_60secondadventuresinastronomy/transcript/22898_1__the_big_bang.pdf
  */
  function isPluginFile () {
    var ch = D.querySelectorAll('body > *');

    var plugin = D.querySelectorAll(
      "body > embed[ height = '100%' ], body > video[ name = media ]");

    return ch.length < 4 && plugin.length === 1;
  }

  // ======================================================

  // Storage: http://html5demos.com/storage | http://diveintohtml5.info/storage.html
  function getStorage () {
    var dt = new Date();
    var value;

    var storage = window[STORE_TYPE];

    var delta = 0;

    if (!STORE_TYPE || !window[STORE_TYPE]) return;

    value = storage.getItem(STORE_PREFIX + 'fixes');

    if (value) {
      delta = (dt.getTime() - dt.setTime(storage.getItem(STORE_PREFIX + 'timestamp'))) / 1000;
      if (STORE_MAX_AGE && STORE_MAX_AGE > 0 && delta > STORE_MAX_AGE) {
        log(STORE_TYPE + ': ' + t('stale, delta: %n', { '%n': delta }), STORE_MAX_AGE);
        value = false;
      } else {
        log(STORE_TYPE + ': ' + t('read fixes, last update: %ns ago', { '%n': delta }), value);
      }
    } else {
      log(STORE_TYPE + ': ' + t('empty'));
    }

    return value ? JSON.parse(value) : false;
  }

  function setStorage (data) {
    var dt = new Date();
    var storage = window[STORE_TYPE];

    if (!STORE_TYPE || !window[STORE_TYPE]) return;

    storage.setItem(STORE_PREFIX + 'fixes', JSON.stringify(data));
    storage.setItem(STORE_PREFIX + 'timestamp', dt.getTime());
    storage.setItem(STORE_PREFIX + 'time', dt.toString());

    log(STORE_TYPE + ': ' + t('save fixes'), data);
  }

  function bodyClasses () {
    var host = L.host.replace(/\./g, '-');

    D.body.className += ' ' + host + '_ac5h';
  }

  // Attwood, https://stackoverflow.com/questions/5223/length-of-javascript-object-ie-
  Object.size = function (obj) {
    var size = 0;
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) size++;
    }
    return size;
  };

  // .
})(window, document, window.location, navigator.userAgent, window.AC5U, window.AccessifyHTML5);
