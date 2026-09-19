# SMART Franchise Landing Page

Static RTL landing page for SMART Franchise / SnappMarket, ready for GitHub Pages.

## Files
- `index.html`
- `style.css`
- `script.js`
- `assets/`

## GitHub Pages
1. Create a GitHub repository.
2. Upload all files from this folder to the repository root.
3. Go to **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select `main` and `/ (root)` and save.

## Lead form
GitHub Pages has no server-side form handling. To make the form store real leads, connect it to a service such as Formspree/Basin or your own endpoint.

Open `script.js` and set:

```js
const FORM_ENDPOINT = "YOUR_ENDPOINT_HERE";
```

The form already supports validation and POST submission.

## Before production launch
Verify/update the public business numbers and financial examples in `index.html` before publishing.
