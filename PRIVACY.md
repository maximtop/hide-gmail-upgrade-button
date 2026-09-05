# Privacy Policy

**Hide Upgrade Button for Gmail, Drive & Docs**

Effective date: August 21, 2026

## Summary

Hide Upgrade Button for Gmail, Drive & Docs does not collect, transmit, sell or share any
data. It makes no network requests. The only thing it stores is your two
on/off preferences, locally in your own browser.

## What the extension processes

- **Your two settings** — "Hide the Upgrade button" and "Hide the Ask Gemini
  button" (each a single on/off value). They are stored in
  `chrome.storage.local`, private to this extension inside your browser
  profile, plus a copy in the extension's own local cache so the popup can
  open instantly. Neither ever leaves your device.
- **Header markup of supported pages, in memory only.** To find the buttons,
  the content script inspects the header area of Gmail, Google Drive,
  Google Docs and, when you grant optional access, Google Calendar pages
  while they are open. Nothing it sees is recorded,
  persisted or transmitted — it never reads your email, files or documents,
  only the toolbar controls it exists to hide.

The extension does not use `chrome.storage.sync` and does not send data to
any server — there is no server.

## What is not collected

- No accounts, sign-in or identifiers of any kind
- No analytics, telemetry or crash reporting
- No browsing history, email contents, document contents or form input
- No advertising, and no sharing or sale of data to third parties
- No remote code: every script the extension runs ships inside the package
  (Manifest V3), nothing is loaded from the network

## Permissions and why they are needed

| Permission | Why it is required |
| --- | --- |
| `storage` | Keep your two toggle values on your device |
| `scripting` | Apply the extension to supported tabs that were already open when access was granted |
| `mail.google.com`, `drive.google.com`, `docs.google.com` | Required access for the extension's original supported sites |
| `calendar.google.com` (optional) | Works automatically after you enable Calendar once in the popup |

## Removing your data

Uninstall the extension (`chrome://extensions` → Remove, or `about:addons` in
Firefox). The browser deletes the extension's storage together with it —
that is all the data there is. Hidden buttons reappear when the pages are
next reloaded or re-rendered.

## Changes to this policy

Any change will be published in this file in the project repository, with the
effective date above updated accordingly.

## Contact

Questions or concerns: open an issue at
<https://github.com/maximtop/hide-gmail-upgrade-button/issues> or email
<me@maximtop.dev>.

## Affiliation

This project is independent. It is not affiliated with, endorsed by, or
sponsored by Google. Gmail, Google Drive, Google Docs, Google Calendar and Gemini are
trademarks of Google LLC and are referenced only to describe compatibility.
