import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: {
    'vue-devtools': './src/vue-devtools/index.ts',
  },
  platform: 'browser',
  format: 'iife',

  outputOptions: {
    entryFileNames: '[name].user.js',
    banner: `
// ==UserScript==
// @name              Force Enable Vue Devtools
// @version           0.0.0
// @author            三咲智子 Kevin Deng <sxzz@sxzz.moe>
// @description       Force enable Vue Devtools for production-build apps of Vue 2 or Vue 3.
// @homepage          https://github.com/sxzz/userscripts
// @supportURL        https://github.com/sxzz/userscripts/issues
// @namespace         https://sxzz.dev
// @license           MIT
// @run-at            document-start
// @noframes
// @include           /^.*$/
// @downloadURL       https://github.com/sxzz/userscripts/raw/refs/heads/main/dist/vue-devtools.user.js
// ==/UserScript==
// `.trim(),
  },
})
