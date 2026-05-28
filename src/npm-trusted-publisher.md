# npm-trusted-publisher

> [!WARNING]
> **This userscript is deprecated.** Please uninstall it.
>
> npm now ships a native [`npm trust`](https://docs.npmjs.com/cli/v11/commands/npm-trust) command (npm v11.10+) which configures Trusted Publisher from the CLI without needing the npmjs.com web form.
>
> Run the following in your package directory instead:
>
> ```sh
> npm trust
> ```

- [Source](https://github.com/sxzz/userscripts/blob/refs/heads/main/src/npm-trusted-publisher.ts)

## Flow (legacy)

- Activate when a page of `https://www.npmjs.com/package/*/access` is opened
- The userscript will fetch the metadata of the current package.
- It will try to read the `repository` field of the package metadata and find the corresponding GitHub repository.
- Fill the form with the information of the GitHub repository for OIDC if found.

## Learn More

- [npm trust CLI command](https://docs.npmjs.com/cli/v11/commands/npm-trust)
- [npm Trusted Publisher](https://github.com/e18e/ecosystem-issues/issues/201)
