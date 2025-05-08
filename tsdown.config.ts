import { defineConfig, type Options } from 'tsdown'

const sharedBanner = {
  author: '三咲智子 Kevin Deng <sxzz@sxzz.moe>',
  homepage: 'https://github.com/sxzz/userscripts',
  supportURL: 'https://github.com/sxzz/userscripts/issues',
  license: 'MIT',
  contributionURL: 'https://github.com/sponsors/sxzz',
}

const sharedConfig: Options = {
  platform: 'browser',
  format: 'iife',
  outputOptions: {
    entryFileNames: '[name].user.js',
  },
}

export default defineConfig([
  {
    entry: './src/vue-devtools.ts',
    ...sharedConfig,
    outputOptions: {
      ...sharedConfig.outputOptions,
      banner: generateBanner({
        name: 'Force Enable Vue Devtools',
        version: '0.0.0',
        description:
          'Force enable Vue Devtools for production-build apps of Vue 2 or Vue 3.',
        ...sharedBanner,
        namespace:
          'https://github.com/sxzz/userscripts/blob/main/dist/vue-devtools.user.js',
        'run-at': 'document-start',
        noframes: '',
        include: '*',
        downloadURL: `https://github.com/sxzz/userscripts/raw/refs/heads/main/dist/vue-devtools.user.js`,
      }),
    },
  },
  {
    entry: './src/macos-font.ts',
    ...sharedConfig,
    outputOptions: {
      ...sharedConfig.outputOptions,
      banner: generateBanner({
        name: 'macOS Font',
        version: '1.0.0',
        description: 'Enable antialiased fonts for macOS.',
        ...sharedBanner,
        namespace:
          'https://github.com/sxzz/userscripts/blob/main/dist/macos-font.user.js',
        'run-at': 'document-start',
        include: '*',
        downloadURL: `https://github.com/sxzz/userscripts/raw/refs/heads/main/dist/macos-font.user.js`,
      }),
    },
  },
])

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
