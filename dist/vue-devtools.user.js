// ==UserScript==
// @name               Force Enable Vue Devtools
// @name:zh-CN         强制启用 Vue Devtools
// @name:zh-TW         強制啟用 Vue Devtools
// @version            1.0.0
// @description        Force enable Vue Devtools for production-build apps of Vue 2 or Vue 3.
// @description:zh-CN  强制启用 Vue Devtools，适用于 Vue 2 或 Vue 3 的生产环境构建应用。
// @description:zh-TW  強制啟用 Vue Devtools，適用於 Vue 2 或 Vue 3 的生產環境構建應用。
// @author             三咲智子 Kevin Deng <sxzz@sxzz.moe>
// @homepage           https://github.com/sxzz/userscripts
// @supportURL         https://github.com/sxzz/userscripts/issues
// @license            MIT
// @contributionURL    https://github.com/sponsors/sxzz
// @namespace          https://github.com/sxzz/userscripts/blob/main/dist/vue-devtools.user.js
// @run-at             document-start
// @noframes           
// @include            *
// @downloadURL        https://github.com/sxzz/userscripts/raw/refs/heads/main/dist/vue-devtools.user.js
// ==/UserScript==
(function() {

"use strict";

//#region src/vue-devtools.ts
/* @license
* Refer from https://github.com/EHfive/userscripts/tree/master/userscripts/enbale-vue-devtools
*/
let initted = false;
main();
document.addEventListener("DOMContentLoaded", () => {
	main();
});
function main() {
	if (initted) return;
	const devtoolsHook = getDevtoolsHook();
	if (!devtoolsHook) {
		console.warn("No Vue Devtools hook found, waiting");
		return;
	}
	initted = true;
	observePage();
}
function getDevtoolsHook() {
	return globalThis.__VUE_DEVTOOLS_GLOBAL_HOOK__;
}
function registerVue2App(app) {
	let Vue = app.constructor;
	while (Vue.super) Vue = Vue.super;
	Vue.config.devtools = true;
	console.info("enabling devtools for Vue instance", app);
	const devtoolsHook = getDevtoolsHook();
	devtoolsHook.emit("init", Vue);
}
function registerVue3App(app) {
	const devtoolsHook = getDevtoolsHook();
	if (!Array.isArray(devtoolsHook.apps)) return;
	if (devtoolsHook.apps.includes(app)) return;
	const version = app.version;
	if (!version) return;
	console.info("enabling devtools for Vue 3 instance", app);
	const types = {
		Fragment: void 0,
		Text: void 0,
		Comment: void 0,
		Static: void 0
	};
	devtoolsHook.emit("app:init", app, version, types);
	const unmount = app.unmount.bind(app);
	app.unmount = function() {
		devtoolsHook.emit("app:unmount", app);
		unmount();
	};
}
function checkVue2Instance(target) {
	const vue = target && target.__vue__;
	return !!(vue && typeof vue === "object" && vue._isVue && typeof vue.constructor === "function");
}
function checkVue3Instance(target) {
	const app = target && target.__vue_app__;
	return !!app;
}
function observePage() {
	const roots = new WeakSet();
	const observer = new MutationObserver(() => {
		for (const el of Array.from(document.querySelectorAll("*"))) if (checkVue3Instance(el)) {
			const app = el.__vue_app__;
			if (roots.has(app)) continue;
			roots.add(app);
			registerVue3App(app);
		} else if (checkVue2Instance(el)) {
			const instance = el.__vue__;
			const root = instance.$parent ? instance.$root : instance;
			if (roots.has(root)) continue;
			roots.add(root);
			registerVue2App(root);
		}
	});
	observer.observe(document.documentElement, {
		attributes: true,
		subtree: true,
		childList: true
	});
	return observer;
}

//#endregion
})();