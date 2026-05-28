// ==UserScript==
// @name               [Deprecated] Set npm Trusted Publisher
// @name:zh-CN         [已弃用] 设置 npm Trusted Publisher
// @name:zh-TW         [已棄用] 設定 npm Trusted Publisher
// @version            2.0.0
// @description        Deprecated. Use the `npm trust` CLI command (npm v11.10+) instead.
// @description:zh-CN  已弃用。请改用 `npm trust` CLI 命令（npm v11.10+）。
// @description:zh-TW  已棄用。請改用 `npm trust` CLI 命令（npm v11.10+）。
// @author             Kevin Deng <sxzz@sxzz.moe>
// @homepage           https://github.com/sxzz/userscripts
// @supportURL         https://github.com/sxzz/userscripts/issues
// @license            MIT
// @contributionURL    https://github.com/sponsors/sxzz
// @run-at             document-end
// @include            https://www.npmjs.com/package/*
// @namespace          https://github.com/sxzz/userscripts/blob/main/dist/npm-trusted-publisher.user.js
// @downloadURL        https://github.com/sxzz/userscripts/raw/refs/heads/main/dist/npm-trusted-publisher.user.js
// ==/UserScript==
(function() {
	//#region src/npm-trusted-publisher.ts
	observe();
	function observe() {
		const observer = new MutationObserver(() => {
			const button = document.querySelector("button[aria-label=\"Add Trusted Publisher connection for GitHub Actions\"]");
			if (!button) return;
			injectDeprecationNotice(button);
			observer.disconnect();
		});
		observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	}
	function injectDeprecationNotice(button) {
		const notice = document.createElement("div");
		notice.style.cssText = `
    margin: 16px 0;
    padding: 16px;
    border: 2px solid #d97706;
    border-radius: 8px;
    background: #fef3c7;
    color: #78350f;
    font-size: 14px;
    line-height: 1.5;
  `;
		notice.innerHTML = `
    <strong style="font-size: 16px;">⚠️ "Set npm Trusted Publisher" userscript is deprecated</strong>
    <p style="margin: 8px 0;">
      Please uninstall this userscript and use the native
      <a href="https://docs.npmjs.com/cli/v11/commands/npm-trust" target="_blank" rel="noopener noreferrer"
         style="color: #b45309; text-decoration: underline; font-weight: bold;">npm trust</a>
      CLI command (npm v11+) instead:
    </p>
    <pre style="margin: 8px 0; padding: 8px; background: #fffbeb; border-radius: 4px; font-family: ui-monospace, monospace;">npm trust</pre>
    <p style="margin: 8px 0 0;">
      See the
      <a href="https://github.com/sxzz/userscripts/blob/main/src/npm-trusted-publisher.md" target="_blank" rel="noopener noreferrer"
         style="color: #b45309; text-decoration: underline;">deprecation notice</a>
      for details.
    </p>
  `;
		button.parentElement?.before(notice);
	}
	//#endregion
})();
