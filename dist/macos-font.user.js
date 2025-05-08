// ==UserScript==
// @name             macOS Font
// @version          1.0.0
// @description      Enable antialiased fonts for macOS.
// @author           三咲智子 Kevin Deng <sxzz@sxzz.moe>
// @homepage         https://github.com/sxzz/userscripts
// @supportURL       https://github.com/sxzz/userscripts/issues
// @license          MIT
// @contributionURL  https://github.com/sponsors/sxzz
// @namespace        https://github.com/sxzz/userscripts/blob/main/dist/macos-font.user.js
// @run-at           document-start
// @include          *
// @downloadURL      https://github.com/sxzz/userscripts/raw/refs/heads/main/dist/macos-font.user.js
// ==/UserScript==
(function() {

"use strict";

//#region src/macos-font.ts
document.body.style.setProperty("-webkit-font-smoothing", "antialiased", "important");

//#endregion
})();