# Firefox Add-ons reviewer notes

Purpose: hide Upgrade and Ask Gemini promotional controls in Gmail, Google
Drive and Google Docs. Also hide Upgrade in Google Calendar after the user
explicitly grants optional access through the popup.

No extension account, payment, analytics, telemetry, remote code or network
requests. Settings are stored locally. Google account sign-in is needed only
to use the Google websites, not an extension account.

## Reproduce this release

The attached source ZIP is the committed repository state from the same GitHub
Release as the submitted Firefox ZIP. It includes the dependency lockfile.
Use Ubuntu 24.04 or macOS, Node.js 24.x and pnpm 10.33.4:

```sh
npm install --global pnpm@10.33.4
pnpm install --frozen-lockfile
pnpm release firefox
```

Compare the extracted contents of `build/release/firefox.zip` with the
submitted package; ZIP timestamps may differ. TypeScript is bundled with
Rspack. Production output is not minified. No Git checkout is needed to build.

## Permissions and test steps

`storage` persists local preferences; `scripting` injects into matching tabs
that were already open when installed or when optional access is granted.
Required hosts cover only Gmail, Drive and Docs. Calendar host access is
optional and requested only after clicking the popup's access button.

1. In Firefox Desktop, open Gmail, Google Drive and Google Docs with a consumer
   Google account, then install the extension. Existing tabs should be handled
   without reloading once Firefox has granted access to those sites.
2. Where Google shows Upgrade or Ask Gemini, confirm those controls are hidden.
3. Turn each popup toggle off: its control returns immediately. Turn it on:
   the control disappears. Other header controls remain available.
4. Reload or navigate within a Google app; the settings persist and the
   mutation watcher handles re-rendered controls.
5. In Calendar, confirm nothing changes before optional access is granted.
   Grant Calendar access using the popup button, then confirm Upgrade is hidden
   without reloading. Revoke that access through the popup and confirm it
   returns. Calendar does not have an Ask Gemini hiding feature.

Google varies promotional controls by account, region and rollout. If a
control is absent or ambiguous, the extension deliberately does nothing.
No reviewer credentials are included or required by the extension itself.

Source: https://github.com/maximtop/hide-gmail-upgrade-button (MIT).
Support: me@maximtop.dev
