observe()

function observe() {
  const observer = new MutationObserver(() => {
    const button = document.querySelector<HTMLButtonElement>(
      'button[aria-label="Add Trusted Publisher connection for GitHub Actions"]',
    )
    if (!button) return

    injectDeprecationNotice(button)
    observer.disconnect()
  })
  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })
}

function injectDeprecationNotice(button: HTMLButtonElement) {
  const notice = document.createElement('div')
  notice.style.cssText = `
    margin: 16px 0;
    padding: 16px;
    border: 2px solid #d97706;
    border-radius: 8px;
    background: #fef3c7;
    color: #78350f;
    font-size: 14px;
    line-height: 1.5;
  `
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
  `
  button.parentElement?.before(notice)
}
