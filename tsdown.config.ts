import { defineConfig } from 'tsdown'

const commonBanner = {
  author: '三咲智子 Kevin Deng <sxzz@sxzz.moe>',
  homepage: 'https://github.com/sxzz/userscripts',
  supportURL: 'https://github.com/sxzz/userscripts/issues',
  license: 'MIT',
  contributionURL: 'https://github.com/sponsors/sxzz',
}

export default defineConfig({
  entry: {
    'vue-devtools': './src/vue-devtools.ts',
  },
  platform: 'browser',
  format: 'iife',

  outputOptions: {
    entryFileNames: '[name].user.js',
    banner: generateBanner({
      name: 'Force Enable Vue Devtools',
      version: '0.0.0',
      description:
        'Force enable Vue Devtools for production-build apps of Vue 2 or Vue 3.',
      ...commonBanner,
      namespace:
        'https://github.com/sxzz/userscripts/blob/main/dist/vue-devtools.user.js',
      'run-at': 'document-start',
      noframes: '',
      include: '*',
      downloadURL: `https://github.com/sxzz/userscripts/raw/refs/heads/main/dist/vue-devtools.user.js`,
    }),
  },
})

function generateBanner(properties: Record<string, string>) {
  const maxLength = Math.max(
    ...Object.keys(properties).map((key) => key.length),
  )
  const lines = Object.entries(properties).map(([key, value]) => {
    return `// @${key.padEnd(maxLength + 1)} ${value}`
  })
  return `// ==UserScript==
${lines.join('\n')}
// ==/UserScript==`
}
