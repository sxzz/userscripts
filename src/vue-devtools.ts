/* @license
 * Refer from https://github.com/EHfive/userscripts/tree/master/userscripts/enbale-vue-devtools
 */

let initted = false
main()

document.addEventListener('DOMContentLoaded', () => main())
globalThis.requestIdleCallback?.(() => main())

function main() {
  if (initted) return

  const devtoolsHook = getDevtoolsHook()
  if (!devtoolsHook) {
    console.warn('No Vue Devtools hook found, waiting')
    return
  }

  initted = true

  observePage()
}

function getDevtoolsHook() {
  try {
    return (
      // @ts-expect-error
      (globalThis.__VUE_DEVTOOLS_GLOBAL_HOOK__ as any) ||
      (typeof unsafeWindow !== 'undefined' &&
        // @ts-expect-error
        (unsafeWindow.__VUE_DEVTOOLS_GLOBAL_HOOK__ as any)) ||
      // @ts-expect-error
      (__VUE_DEVTOOLS_GLOBAL_HOOK__ as any)
    )
  } catch {}
}

function registerVue2App(app: any) {
  let Vue = app.constructor
  while (Vue.super) {
    // find base Vue
    Vue = Vue.super
  }
  Vue.config.devtools = true
  console.info('enabling devtools for Vue instance', app)
  // must re-emit 'init' if this Vue is different with other Vue(s)
  // otherwise this `Vue`'s root instance would not be added to Devtools store
  // https://github.com/vuejs/vue-devtools/blob/933063fd06860464be4bfd8c83ba09d7fc2c753e/packages/app-backend/src/index.js#L218-L225
  const devtoolsHook = getDevtoolsHook()
  devtoolsHook.emit('init', Vue)
}

function registerVue3App(app: any) {
  const devtoolsHook = getDevtoolsHook()
  if (!Array.isArray(devtoolsHook.apps)) return
  if (devtoolsHook.apps.includes(app)) return

  const version = app.version
  if (!version) return

  console.info('enabling devtools for Vue 3 instance', app)

  // FIXME: impossible to get those Symbols,
  // https://github.com/vuejs/vue-next/blob/410e7abbbb78e83989ad2e5a1793c290129dfdc7/packages/runtime-core/src/devtools.ts#L38
  const types = {
    Fragment: undefined,
    Text: undefined,
    Comment: undefined,
    Static: undefined,
  }
  devtoolsHook.emit('app:init', app, version, types)

  const unmount = app.unmount.bind(app)
  app.unmount = function () {
    devtoolsHook.emit('app:unmount', app)
    unmount()
  }
}

function checkVue2Instance(target: any) {
  const vue = target && target.__vue__
  return !!(
    vue &&
    typeof vue === 'object' &&
    vue._isVue &&
    typeof vue.constructor === 'function'
  )
}

function checkVue3Instance(target: any) {
  const app = target && target.__vue_app__
  return !!app
}

function observePage() {
  const roots = new WeakSet()

  const observer = new MutationObserver(() => {
    for (const el of Array.from<any>(document.querySelectorAll('*'))) {
      if (checkVue3Instance(el)) {
        const app = el.__vue_app__
        if (roots.has(app)) continue
        roots.add(app)
        registerVue3App(app)
      } else if (checkVue2Instance(el)) {
        const instance = el.__vue__
        const root = instance.$parent ? instance.$root : instance
        if (roots.has(root)) continue
        roots.add(root)
        registerVue2App(root)
      }
    }
  })
  observer.observe(document.documentElement, {
    attributes: true,
    subtree: true,
    childList: true,
  })
  return observer
}
