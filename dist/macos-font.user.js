// ==UserScript==
// @name               macOS Antialiased Font
// @name:zh-CN         macOS 抗锯齿字体
// @name:zh-TW         macOS 抗鋸齒字型
// @version            1.0.1
// @description        Enable antialiased fonts for macOS.
// @description:zh-CN  启用 macOS 的抗锯齿字体。
// @description:zh-TW  啟用 macOS 的抗鋸齒字型。
// @run-at             document-body
// @include            *
// @author             Kevin Deng <sxzz@sxzz.moe>
// @homepage           https://github.com/sxzz/userscripts
// @supportURL         https://github.com/sxzz/userscripts/issues
// @license            MIT
// @contributionURL    https://github.com/sponsors/sxzz
// @namespace          https://github.com/sxzz/userscripts/blob/main/dist/macos-font.user.js
// @downloadURL        https://github.com/sxzz/userscripts/raw/refs/heads/main/dist/macos-font.user.js
// ==/UserScript==
(function() {
	document.body.style.setProperty("-webkit-font-smoothing", "antialiased", "important");
})();
