import { defineConfig, type Options } from 'tsdown'

const sharedBanner = {
  author: 'Kevin Deng <sxzz@sxzz.moe>',
  homepage: 'https://github.com/sxzz/userscripts',
  supportURL: 'https://github.com/sxzz/userscripts/issues',
  license: 'MIT',
  contributionURL: 'https://github.com/sponsors/sxzz',
}

interface ScriptConfig {
  id: string
  banner: Record<string, string>
}

const scripts: ScriptConfig[] = [
  {
    id: 'vue-devtools',
    banner: {
      name: 'Force Enable Vue Devtools',
      'name:zh-CN': '强制启用 Vue Devtools',
      'name:zh-TW': '強制啟用 Vue Devtools',
      version: '1.0.1',
      description:
        'Force enable Vue Devtools for production-build apps of Vue 2 or Vue 3.',
      'description:zh-CN':
        '强制启用 Vue Devtools，适用于 Vue 2 或 Vue 3 的生产环境构建应用。',
      'description:zh-TW':
        '強制啟用 Vue Devtools，適用於 Vue 2 或 Vue 3 的生產環境構建應用。',
      ...sharedBanner,
      'run-at': 'document-start',
      noframes: '',
      include: '*',
    },
  },
  {
    id: 'macos-font',
    banner: {
      name: 'macOS Antialiased Font',
      'name:zh-CN': 'macOS 抗锯齿字体',
      'name:zh-TW': 'macOS 抗鋸齒字型',
      version: '1.0.1',
      description: 'Enable antialiased fonts for macOS.',
      'description:zh-CN': '启用 macOS 的抗锯齿字体。',
      'description:zh-TW': '啟用 macOS 的抗鋸齒字型。',
      'run-at': 'document-body',
      include: '*',
    },
  },
]

const sharedConfig: Options = {
  platform: 'browser',
  format: 'iife',
  outputOptions: {
    entryFileNames: '[name].user.js',
  },
}

export default defineConfig(
  scripts.map((script) => {
    return {
      entry: `./src/${script.id}.ts`,
      ...sharedConfig,
      outputOptions: {
        ...sharedConfig.outputOptions,
        banner: generateBanner({
          ...script.banner,
          ...sharedBanner,
          namespace: `https://github.com/sxzz/userscripts/blob/main/dist/${script.id}.user.js`,
          downloadURL: `https://github.com/sxzz/userscripts/raw/refs/heads/main/dist/${script.id}.user.js`,
        }),
      },
    }
  }),
)

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
