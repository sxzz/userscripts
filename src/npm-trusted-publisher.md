# npm-trusted-publisher

This userscript helps you fill the form for npm Trusted Publisher for packages automatically on npmjs.com.

- [Install](https://github.com/sxzz/userscripts/raw/refs/heads/main/dist/npm-trusted-publisher.user.js)
- [Source](https://github.com/sxzz/userscripts/blob/refs/heads/main/src/npm-trusted-publisher.ts)

## Flow

- Activate when a page of `https://www.npmjs.com/package/*/access` is opened
- The userscript will fetch the metadata of the current package.
- It will try to read the `repository` field of the package metadata and find the corresponding GitHub repository.
- Fill the form with the information of the GitHub repository for OIDC if found.

## Learn More 

[npm Trusted Publisher](https://github.com/e18e/ecosystem-issues/issues/201)


