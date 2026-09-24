# Firefox Add-ons reviewer notes

Purpose: hide the Upgrade and Ask Gemini promotional controls in Gmail, Google
Drive and Google Docs, and Upgrade in Google Calendar once the user grants
optional access on the onboarding page or in the popup.

No extension account, payment, analytics, telemetry, remote code or network
requests. Settings are stored locally. A Google account is needed only to use
the Google websites.

## Reproduce this release

The attached source ZIP is the committed repository state from the same GitHub
Release as the submitted Firefox ZIP, lockfile included. Use Ubuntu 24.04 or
macOS, Node.js 24.x and pnpm 11.18.0:

```sh
npm install --global pnpm@11.18.0
pnpm install --frozen-lockfile
pnpm release firefox
```

Compare the extracted `build/release/firefox.zip` with the submitted package;
ZIP timestamps may differ. TypeScript is bundled with Rspack; output is not
minified. No Git checkout is needed.

## Permissions and test steps

`storage` keeps local preferences; `scripting` injects into matching tabs
already open at install or when optional access is granted. Required hosts are
only Gmail, Drive and Docs. Calendar host access is optional, requested only
from the onboarding page's access button or the popup's access switch. The
onboarding page is packaged, opens in a new tab once after installation (not
after updates) and loads nothing remote. `tabs.create` and
`action.getUserSettings` (only to show whether the toolbar icon is pinned) need
no permission.

1. In Firefox Desktop, open Gmail, Drive and Docs with a consumer Google
   account, then install the extension. The onboarding page opens; existing
   tabs are handled without reloading once Firefox grants access to them.
2. Where Google shows Upgrade or Ask Gemini, confirm they are hidden.
3. Turn each popup toggle off: its control returns immediately. Turn it on: the
   control disappears. Other header controls stay available.
4. Reload or navigate within a Google app: settings persist and re-rendered
   controls stay hidden.
5. In Calendar, nothing changes before optional access is granted. Grant it
   with "Enable in Google Calendar" on the onboarding page (reopen it from
   "How it works" in the popup) or the popup switch: Upgrade hides without
   reloading and both places show access as on. Revoke it with "Turn off" on
   the page or the popup switch: Upgrade returns. Ask Gemini is not hidden in
   Calendar.

Google varies promotional controls by account, region and rollout; if a
control is absent or ambiguous, the extension does nothing. No reviewer
credentials are included; the extension itself needs none.

Source: https://github.com/maximtop/hide-gmail-upgrade-button (MIT).
Support: me@maximtop.dev
