# Store descriptions

Source of truth for the full store descriptions (Chrome Web Store, Edge
Add-ons, Firefox AMO). Stores render no markdown — run
`pnpm store:descriptions` to produce the plain-text files the description
fields actually accept (`build/store-descriptions/<locale>.txt`).

Titles and short summaries are NOT here: stores take them from the package —
`name` and `description` in `src/_locales/<locale>/messages.json`.

---

## English (en)

Google keeps a permanent "Upgrade" button in the header of Gmail, Google Drive and Google Docs — and an "Ask Gemini" button next to it. If you are not planning to upgrade, that is advertising you look at all day. This extension removes it.

Install, and both buttons are gone — cleanly, with the neighboring icons closing the gap, as if they were never there.

#### Key features

- Hides the Upgrade button and the Ask Gemini button in Gmail, Google Drive and Google Docs
- Each button has its own toggle in the popup; both are on by default
- No flashing: hiding applies before the page is painted and survives Google's dynamic re-renders and in-app navigation
- Works immediately in tabs that were already open when you installed it
- Toggling a setting applies live to every open tab — no reloads
- Interface in 40 languages

#### When Google changes something

Google's markup is obfuscated and changes without notice, so the extension never relies on fragile class names. It recognizes the buttons by stable signals — labels, roles, placement in the header — and when a match is uncertain it deliberately does nothing rather than hide the wrong control. If Google changes the interface enough, a button may reappear for a while: nothing breaks, and an extension update will restore hiding. The popup has a "Report a problem" link so reappearing buttons get noticed quickly.

#### Permissions, in plain words

- Storage — keeps your two toggle values on your device
- Scripting — applies the extension to Gmail/Drive/Docs tabs that were already open at install time
- Access to mail.google.com, drive.google.com and docs.google.com — the only sites it runs on; it cannot read any other page

#### Privacy

No account, no analytics, no servers, no network requests. The only data the extension stores is the two on/off toggles, locally in your browser. Privacy policy: https://github.com/maximtop/hide-gmail-upgrade-button/blob/main/PRIVACY.md

Free and open source: https://github.com/maximtop/hide-gmail-upgrade-button

This extension is not affiliated with, endorsed by, or sponsored by Google. Gmail, Google Drive, Google Docs and Gemini are trademarks of Google LLC, referenced only to describe compatibility.

================================================================================

## Russian (ru)

Google держит в шапке Gmail, Google Диска и Google Документов постоянную кнопку «Upgrade», а рядом — кнопку «Ask Gemini». Если апгрейд вам не нужен, это просто реклама, на которую вы смотрите весь день. Это расширение её убирает.

Установите — и обе кнопки исчезнут: аккуратно, соседние иконки сомкнутся, как будто кнопок никогда не было.

#### Основные возможности

- Скрывает кнопки Upgrade и Ask Gemini в Gmail, Google Диске и Google Документах
- У каждой кнопки — свой переключатель в попапе; по умолчанию оба включены
- Без мелькания: скрытие применяется до отрисовки страницы и переживает динамические перерисовки и навигацию внутри приложений Google
- Сразу работает во вкладках, которые были открыты до установки
- Изменение настройки применяется ко всем открытым вкладкам мгновенно, без перезагрузки
- Интерфейс на 40 языках

#### Когда Google что-то меняет

Вёрстка Google обфусцирована и меняется без предупреждения, поэтому расширение не привязывается к хрупким именам классов. Оно узнаёт кнопки по устойчивым признакам — подписям, ролям, расположению в шапке — а при малейшей неоднозначности сознательно ничего не делает, чтобы не скрыть лишнее. Если Google изменит интерфейс сильнее, кнопка может на время появиться снова: ничего не сломается, а обновление расширения вернёт скрытие. В попапе есть ссылка «Сообщить о проблеме», чтобы вернувшиеся кнопки быстро замечались.

#### Разрешения простыми словами

- Хранилище — хранит два значения переключателей на вашем устройстве
- Скрипты — применяет расширение к вкладкам Gmail/Диска/Документов, открытым до установки
- Доступ к mail.google.com, drive.google.com и docs.google.com — единственные сайты, где расширение работает; другие страницы ему недоступны

#### Приватность

Без аккаунтов, аналитики, серверов и сетевых запросов. Единственные данные, которые хранит расширение, — два переключателя, локально в вашем браузере. Политика конфиденциальности: https://github.com/maximtop/hide-gmail-upgrade-button/blob/main/PRIVACY.md

Бесплатно и с открытым кодом: https://github.com/maximtop/hide-gmail-upgrade-button

Расширение не аффилировано с Google и не одобрено ею. Gmail, Google Drive, Google Docs и Gemini — товарные знаки Google LLC, упомянутые только для описания совместимости.
