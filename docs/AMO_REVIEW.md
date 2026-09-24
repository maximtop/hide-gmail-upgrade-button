# Firefox Add-ons reviewer notes

Purpose: hide Upgrade and Ask Gemini promotional controls in Gmail, Google
Drive and Google Docs. Also hide Upgrade in Google Calendar after the user
explicitly grants optional access on the onboarding page or in the popup.

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
optional and requested only after clicking the access button on the
onboarding page or the popup's access switch. The onboarding page is a
packaged extension page that opens in a new tab once after installation (not
after updates) and loads nothing remote; `tabs.create` and `action.getUserSettings`
(used only to show whether the toolbar icon is pinned) need no permission.

1. In Firefox Desktop, open Gmail, Google Drive and Google Docs with a consumer
   Google account, then install the extension. The onboarding page opens.
   Existing tabs should be handled without reloading once Firefox has granted
   access to those sites.
2. Where Google shows Upgrade or Ask Gemini, confirm those controls are hidden.
3. Turn each popup toggle off: its control returns immediately. Turn it on:
   the control disappears. Other header controls remain available.
4. Reload or navigate within a Google app; the settings persist and the
   mutation watcher handles re-rendered controls.
5. In Calendar, confirm nothing changes before optional access is granted.
   Grant Calendar access with "Enable in Google Calendar" on the onboarding
   page (reopen it from "How it works" in the popup) or the popup switch, then
   confirm Upgrade is hidden without reloading and both places show access as
   on. Revoke it with "Turn off" on the page or the popup switch and confirm
   Upgrade returns. Calendar does not have an Ask Gemini hiding feature.

Google varies promotional controls by account, region and rollout. If a
control is absent or ambiguous, the extension deliberately does nothing.
No reviewer credentials are included or required by the extension itself.

Source: https://github.com/maximtop/hide-gmail-upgrade-button (MIT).
Support: me@maximtop.dev
