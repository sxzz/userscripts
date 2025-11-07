import GitHost from 'hosted-git-info'
import { fetch, sleep } from './utils'

observe()

function observe() {
  const observer = new MutationObserver(() => {
    if (document.querySelector<HTMLFormElement>('#deleteOidc')) {
      observer.disconnect()
      return
    }

    const button = document.querySelector<HTMLButtonElement>(
      'button[aria-label="Add Trusted Publisher connection for GitHub Actions"]',
    )
    if (!button) return

    autofill(button)
    observer.disconnect()
  })
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })
}

async function autofill(button: HTMLButtonElement) {
  button?.click()

  const [repoInfo] = await Promise.all([fetchRepoInfo(), sleep(100)])
  if (!repoInfo) return

  while (true) {
    const ownerInput = document.querySelector<HTMLInputElement>(
      '#oidc #oidc_repositoryOwner',
    )
    const repoInput = document.querySelector<HTMLInputElement>(
      '#oidc #oidc_repositoryName',
    )
    if (!ownerInput || !repoInput) {
      console.warn('Failed to find input fields, retrying...')
      await sleep(100)
    } else {
      ownerInput.value = repoInfo.user
      repoInput.value = repoInfo.project
      break
    }
  }

  const workflowInput = document.querySelector<HTMLInputElement>(
    '#oidc #oidc_workflowName',
  )
  if (workflowInput) {
    const storageKey = 'trusted-publisher-workflow'

    workflowInput.value = localStorage.getItem(storageKey) || 'release.yml'
    workflowInput.addEventListener('change', (e) => {
      localStorage.setItem(storageKey, (e.target as HTMLInputElement).value)
    })
  }

  const submitButton = document.querySelector<HTMLButtonElement>(
    '#oidc button[type="submit"]',
  )
  if (submitButton) {
    const label2FA = document.createElement('div')
    label2FA.innerHTML = `<label style="font-size: 20px; font-weight: bold"><input type="checkbox"> Enable 2FA</label>`
    submitButton.parentElement?.before(label2FA)

    const checkbox2FA = label2FA.querySelector('input')!
    const npmRadio2FA = document.querySelector<HTMLInputElement>(
      '#package-settings_publishingAccess_tfa-always-required',
    )
    checkbox2FA.checked = !npmRadio2FA?.checked

    submitButton.style.fontSize = '30px'
    submitButton.style.fontWeight = 'bold'
    submitButton.addEventListener('click', async (event) => {
      event.stopPropagation()
      event.preventDefault()

      await Promise.all([submitOidc(), submit2FA(checkbox2FA)])
      location.reload()
    })
  }
}

async function submitOidc() {
  const form = document.querySelector<HTMLFormElement>('#oidc')
  if (!form) {
    // eslint-disable-next-line no-alert
    alert('Failed to find OIDC form')
    return
  }

  form.target = 'oidc'
  await createWindow('oidc', 0, () => form.submit())
}

async function submit2FA(checkbox2FA: HTMLInputElement) {
  if (!checkbox2FA.checked) return

  const form = document.querySelector<HTMLFormElement>('#package-settings')
  const radio = document.querySelector<HTMLInputElement>(
    '#package-settings_publishingAccess_tfa-always-required',
  )

  if (form && radio) {
    radio.checked = true
    form.target = '2fa'
    await createWindow('2fa', 1, () => form.submit())
  } else {
    console.warn('Failed to find 2FA form, skipping...')
  }
}

async function fetchRepoInfo() {
  const url = new URL(location.href)
  const pkgName = url.pathname.split('/').slice(2, -1).join('/')

  const pkg = await fetch(`https://registry.npmjs.org/${pkgName}`)

  const repositoryURL: string | undefined =
    typeof pkg.repository === 'string' ? pkg.repository : pkg.repository?.url
  if (!repositoryURL) {
    console.warn(`No repository field found in package ${pkgName}.`)
    return
  }

  const gitHost = GitHost.fromUrl(repositoryURL, {
    noCommittish: true,
    noGitPlus: true,
  })
  if (!gitHost) {
    console.error(`Invalid repository URL`)
    return
  }
  if (gitHost.type !== 'github') {
    console.warn(`Only GitHub repositories are supported.`)
    return
  }

  return gitHost
}

async function createWindow(
  name: string,
  i: number,
  onReady: (win: Window) => void | Promise<void>,
) {
  const win = window.open(
    'about:blank',
    name,
    `width=400,height=400,left=${i * 400}`,
  )
  if (!win) {
    // eslint-disable-next-line no-alert
    alert('Please allow popups for this website')
    return
  }

  win.document.title = name
  await onReady(win)

  await waitWindow(win)
  win.close()
}

async function waitWindow(win: Window) {
  while (true) {
    await sleep(100)

    let host: string | undefined
    let text: string | undefined
    try {
      host = win.location.host
      text = win.document.body.textContent
    } catch {}
    if (
      host === 'www.npmjs.com' &&
      !text?.includes('Two-Factor Authentication')
    )
      break
  }
}
