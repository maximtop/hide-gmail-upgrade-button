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

No account, no analytics, no servers, no network requests. The only data the extension stores is the two on/off toggles, locally in your browser. Privacy policy: https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

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

Без аккаунтов, аналитики, серверов и сетевых запросов. Единственные данные, которые хранит расширение, — два переключателя, локально в вашем браузере. Политика конфиденциальности: https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

Бесплатно и с открытым кодом: https://github.com/maximtop/hide-gmail-upgrade-button

Расширение не аффилировано с Google и не одобрено ею. Gmail, Google Drive, Google Docs и Gemini — товарные знаки Google LLC, упомянутые только для описания совместимости.

================================================================================

## German (de)

Google hält in der Kopfzeile von Gmail, Google Drive und Google Docs dauerhaft eine „Upgrade"-Schaltfläche bereit — und daneben „Ask Gemini". Wenn Sie kein Upgrade planen, ist das Werbung, auf die Sie den ganzen Tag schauen. Diese Erweiterung entfernt sie.

Installieren — und beide Schaltflächen sind weg: sauber, die benachbarten Symbole rücken zusammen, als hätte es sie nie gegeben.

#### Hauptfunktionen

- Blendet die Schaltflächen Upgrade und Ask Gemini in Gmail, Google Drive und Google Docs aus
- Jede Schaltfläche hat einen eigenen Schalter im Popup; beide sind standardmäßig aktiv
- Kein Aufblitzen: Das Ausblenden greift vor dem ersten Rendern und übersteht Googles dynamische Neuaufbauten und die Navigation in der App
- Wirkt sofort auch in Tabs, die bei der Installation bereits offen waren
- Änderungen an den Schaltern gelten sofort für alle offenen Tabs — ohne Neuladen
- Oberfläche in 40 Sprachen

#### Wenn Google etwas ändert

Googles Markup ist verschleiert und ändert sich ohne Ankündigung, daher verlässt sich die Erweiterung nie auf fragile Klassennamen. Sie erkennt die Schaltflächen an stabilen Signalen — Beschriftungen, Rollen, Position in der Kopfzeile — und tut im Zweifel bewusst nichts, statt das falsche Element auszublenden. Ändert Google die Oberfläche stärker, kann eine Schaltfläche vorübergehend wieder auftauchen: Nichts geht kaputt, ein Update der Erweiterung stellt das Ausblenden wieder her. Im Popup gibt es den Link „Problem melden", damit zurückgekehrte Schaltflächen schnell auffallen.

#### Berechtigungen, einfach erklärt

- Speicher — bewahrt Ihre zwei Schalterwerte auf Ihrem Gerät auf
- Skripte — wendet die Erweiterung auf Gmail/Drive/Docs-Tabs an, die bei der Installation bereits offen waren
- Zugriff auf mail.google.com, drive.google.com und docs.google.com — die einzigen Websites, auf denen sie läuft; andere Seiten kann sie nicht lesen

#### Datenschutz

Kein Konto, keine Analyse, keine Server, keine Netzwerkanfragen. Die einzigen gespeicherten Daten sind die zwei Schalter, lokal in Ihrem Browser. Datenschutzerklärung: https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

Kostenlos und Open Source: https://github.com/maximtop/hide-gmail-upgrade-button

Diese Erweiterung ist nicht mit Google verbunden und wird nicht von Google unterstützt. Gmail, Google Drive, Google Docs und Gemini sind Marken von Google LLC und werden nur zur Beschreibung der Kompatibilität genannt.

================================================================================

## French (fr)

Google garde en permanence un bouton « Upgrade » dans l'en-tête de Gmail, Google Drive et Google Docs — et un bouton « Ask Gemini » juste à côté. Si vous ne comptez pas passer à la version payante, c'est de la publicité que vous regardez toute la journée. Cette extension la supprime.

Installez-la : les deux boutons disparaissent proprement, les icônes voisines se resserrent, comme s'ils n'avaient jamais existé.

#### Fonctionnalités principales

- Masque les boutons Upgrade et Ask Gemini dans Gmail, Google Drive et Google Docs
- Chaque bouton a son propre interrupteur dans le popup ; les deux sont activés par défaut
- Aucun clignotement : le masquage s'applique avant le premier affichage et résiste aux re-rendus dynamiques et à la navigation interne de Google
- Fonctionne immédiatement dans les onglets déjà ouverts au moment de l'installation
- Tout changement de réglage s'applique en direct à tous les onglets ouverts — sans rechargement
- Interface en 40 langues

#### Quand Google change quelque chose

Le balisage de Google est obscurci et change sans préavis ; l'extension ne s'appuie donc jamais sur des noms de classes fragiles. Elle reconnaît les boutons à des signaux stables — libellés, rôles, position dans l'en-tête — et, en cas de doute, préfère ne rien faire plutôt que masquer le mauvais élément. Si Google modifie fortement l'interface, un bouton peut réapparaître un temps : rien ne casse, et une mise à jour de l'extension rétablira le masquage. Le popup contient un lien « Signaler un problème » pour que les boutons revenus soient vite repérés.

#### Les autorisations, en clair

- Stockage — conserve vos deux réglages sur votre appareil
- Scripts — applique l'extension aux onglets Gmail/Drive/Docs déjà ouverts lors de l'installation
- Accès à mail.google.com, drive.google.com et docs.google.com — les seuls sites où elle s'exécute ; elle ne peut lire aucune autre page

#### Confidentialité

Pas de compte, pas d'analytique, pas de serveurs, pas de requêtes réseau. Les seules données stockées sont vos deux interrupteurs, localement dans votre navigateur. Politique de confidentialité : https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

Gratuit et open source : https://github.com/maximtop/hide-gmail-upgrade-button

Cette extension n'est ni affiliée à Google, ni approuvée par Google. Gmail, Google Drive, Google Docs et Gemini sont des marques de Google LLC, citées uniquement pour décrire la compatibilité.

================================================================================

## Spanish (es)

Google mantiene un botón «Upgrade» permanente en la cabecera de Gmail, Google Drive y Google Docs, y un botón «Ask Gemini» justo al lado. Si no piensas pagar la mejora, es publicidad que miras todo el día. Esta extensión la elimina.

Instálala y ambos botones desaparecen limpiamente: los iconos vecinos se juntan, como si nunca hubieran existido.

#### Funciones principales

- Oculta los botones Upgrade y Ask Gemini en Gmail, Google Drive y Google Docs
- Cada botón tiene su propio interruptor en el popup; ambos vienen activados por defecto
- Sin parpadeos: la ocultación se aplica antes del primer renderizado y sobrevive a los re-renderizados dinámicos y a la navegación interna de Google
- Funciona de inmediato en las pestañas que ya estaban abiertas al instalar
- Cambiar un ajuste se aplica en vivo a todas las pestañas abiertas, sin recargar
- Interfaz en 40 idiomas

#### Cuando Google cambia algo

El marcado de Google está ofuscado y cambia sin aviso, así que la extensión nunca depende de nombres de clase frágiles. Reconoce los botones por señales estables — etiquetas, roles, posición en la cabecera — y, ante la duda, prefiere no hacer nada antes que ocultar el control equivocado. Si Google cambia mucho la interfaz, un botón puede reaparecer un tiempo: nada se rompe, y una actualización de la extensión restaurará la ocultación. El popup incluye un enlace «Informar de un problema» para detectar rápido los botones que vuelven.

#### Los permisos, en palabras claras

- Almacenamiento — guarda tus dos ajustes en tu dispositivo
- Scripts — aplica la extensión a las pestañas de Gmail/Drive/Docs ya abiertas al instalarla
- Acceso a mail.google.com, drive.google.com y docs.google.com — los únicos sitios donde funciona; no puede leer ninguna otra página

#### Privacidad

Sin cuentas, sin analítica, sin servidores, sin peticiones de red. Los únicos datos que guarda la extensión son los dos interruptores, localmente en tu navegador. Política de privacidad: https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

Gratuita y de código abierto: https://github.com/maximtop/hide-gmail-upgrade-button

Esta extensión no está afiliada a Google ni cuenta con su respaldo. Gmail, Google Drive, Google Docs y Gemini son marcas de Google LLC, mencionadas solo para describir compatibilidad.

================================================================================

## Spanish, Latin America (es_419)

Google mantiene un botón «Upgrade» permanente en la cabecera de Gmail, Google Drive y Google Docs, y un botón «Ask Gemini» al lado. Si no planeas pagar la mejora, es publicidad que ves todo el día. Esta extensión la elimina.

Instálala y ambos botones desaparecen limpiamente: los íconos vecinos se juntan, como si nunca hubieran existido.

#### Funciones principales

- Oculta los botones Upgrade y Ask Gemini en Gmail, Google Drive y Google Docs
- Cada botón tiene su propio interruptor en el popup; ambos vienen activados por defecto
- Sin parpadeos: la ocultación se aplica antes del primer renderizado y sobrevive a los re-renderizados dinámicos y a la navegación interna de Google
- Funciona de inmediato en las pestañas que ya estaban abiertas al instalar
- Cambiar un ajuste se aplica en vivo a todas las pestañas abiertas, sin recargar
- Interfaz en 40 idiomas

#### Cuando Google cambia algo

El marcado de Google está ofuscado y cambia sin aviso, así que la extensión nunca depende de nombres de clase frágiles. Reconoce los botones por señales estables — etiquetas, roles, posición en la cabecera — y, ante la duda, prefiere no hacer nada antes que ocultar el control equivocado. Si Google cambia mucho la interfaz, un botón puede reaparecer un tiempo: nada se rompe, y una actualización de la extensión restaurará la ocultación. El popup incluye un enlace «Informar un problema» para detectar rápido los botones que vuelven.

#### Los permisos, en palabras claras

- Almacenamiento — guarda tus dos ajustes en tu dispositivo
- Scripts — aplica la extensión a las pestañas de Gmail/Drive/Docs ya abiertas al instalarla
- Acceso a mail.google.com, drive.google.com y docs.google.com — los únicos sitios donde funciona; no puede leer ninguna otra página

#### Privacidad

Sin cuentas, sin analítica, sin servidores, sin solicitudes de red. Los únicos datos que guarda la extensión son los dos interruptores, localmente en tu navegador. Política de privacidad: https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

Gratuita y de código abierto: https://github.com/maximtop/hide-gmail-upgrade-button

Esta extensión no está afiliada a Google ni cuenta con su respaldo. Gmail, Google Drive, Google Docs y Gemini son marcas de Google LLC, mencionadas solo para describir compatibilidad.

================================================================================

## Italian (it)

Google tiene un pulsante «Upgrade» fisso nell'intestazione di Gmail, Google Drive e Google Docs — e accanto un pulsante «Ask Gemini». Se non hai intenzione di passare alla versione a pagamento, è pubblicità che guardi tutto il giorno. Questa estensione la rimuove.

Installala: entrambi i pulsanti spariscono in modo pulito, le icone vicine si compattano, come se non fossero mai esistiti.

#### Funzionalità principali

- Nasconde i pulsanti Upgrade e Ask Gemini in Gmail, Google Drive e Google Docs
- Ogni pulsante ha il proprio interruttore nel popup; entrambi attivi per impostazione predefinita
- Nessun lampeggio: l'occultamento si applica prima del primo rendering e resiste ai re-render dinamici e alla navigazione interna di Google
- Funziona subito anche nelle schede già aperte al momento dell'installazione
- Ogni modifica alle impostazioni si applica in tempo reale a tutte le schede aperte, senza ricaricare
- Interfaccia in 40 lingue

#### Quando Google cambia qualcosa

Il markup di Google è offuscato e cambia senza preavviso, quindi l'estensione non si affida mai a fragili nomi di classe. Riconosce i pulsanti da segnali stabili — etichette, ruoli, posizione nell'intestazione — e nel dubbio preferisce non fare nulla piuttosto che nascondere l'elemento sbagliato. Se Google modifica molto l'interfaccia, un pulsante può ricomparire per un po': non si rompe nulla, e un aggiornamento dell'estensione ripristinerà l'occultamento. Nel popup c'è il link «Segnala un problema» per accorgersi in fretta dei pulsanti ricomparsi.

#### I permessi, in parole semplici

- Archiviazione — conserva i tuoi due interruttori sul tuo dispositivo
- Script — applica l'estensione alle schede Gmail/Drive/Docs già aperte al momento dell'installazione
- Accesso a mail.google.com, drive.google.com e docs.google.com — gli unici siti su cui funziona; non può leggere altre pagine

#### Privacy

Nessun account, nessuna analisi, nessun server, nessuna richiesta di rete. Gli unici dati salvati sono i due interruttori, localmente nel tuo browser. Informativa sulla privacy: https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

Gratuita e open source: https://github.com/maximtop/hide-gmail-upgrade-button

Questa estensione non è affiliata a Google né da essa approvata. Gmail, Google Drive, Google Docs e Gemini sono marchi di Google LLC, citati solo per descrivere la compatibilità.

================================================================================

## Portuguese, Brazil (pt_BR)

O Google mantém um botão «Upgrade» permanente no cabeçalho do Gmail, do Google Drive e do Google Docs — e um botão «Ask Gemini» ao lado. Se você não pretende fazer upgrade, é publicidade que você olha o dia inteiro. Esta extensão remove isso.

Instale e os dois botões somem de forma limpa: os ícones vizinhos se aproximam, como se os botões nunca tivessem existido.

#### Principais recursos

- Oculta os botões Upgrade e Ask Gemini no Gmail, Google Drive e Google Docs
- Cada botão tem seu próprio interruptor no popup; ambos vêm ativados por padrão
- Sem piscadas: a ocultação é aplicada antes da primeira renderização e sobrevive às re-renderizações dinâmicas e à navegação interna do Google
- Funciona imediatamente nas abas que já estavam abertas na instalação
- Alterar uma configuração vale na hora para todas as abas abertas — sem recarregar
- Interface em 40 idiomas

#### Quando o Google muda algo

A marcação do Google é ofuscada e muda sem aviso, então a extensão nunca depende de nomes de classe frágeis. Ela reconhece os botões por sinais estáveis — rótulos, papéis, posição no cabeçalho — e, na dúvida, prefere não fazer nada a ocultar o controle errado. Se o Google mudar muito a interface, um botão pode reaparecer por um tempo: nada quebra, e uma atualização da extensão restaurará a ocultação. O popup tem o link «Relatar um problema» para que botões que voltaram sejam notados rapidamente.

#### As permissões, em palavras simples

- Armazenamento — guarda seus dois ajustes no seu dispositivo
- Scripts — aplica a extensão às abas do Gmail/Drive/Docs já abertas na instalação
- Acesso a mail.google.com, drive.google.com e docs.google.com — os únicos sites onde funciona; nenhuma outra página pode ser lida

#### Privacidade

Sem conta, sem análise, sem servidores, sem solicitações de rede. Os únicos dados armazenados são os dois interruptores, localmente no seu navegador. Política de privacidade: https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

Gratuita e de código aberto: https://github.com/maximtop/hide-gmail-upgrade-button

Esta extensão não é afiliada ao Google nem endossada por ele. Gmail, Google Drive, Google Docs e Gemini são marcas do Google LLC, citadas apenas para descrever compatibilidade.

================================================================================

## Portuguese, Portugal (pt_PT)

A Google mantém um botão «Upgrade» permanente no cabeçalho do Gmail, do Google Drive e do Google Docs — e um botão «Ask Gemini» ao lado. Se não tenciona fazer upgrade, é publicidade para a qual olha o dia inteiro. Esta extensão remove-a.

Instale e ambos os botões desaparecem de forma limpa: os ícones vizinhos aproximam-se, como se os botões nunca tivessem existido.

#### Funcionalidades principais

- Oculta os botões Upgrade e Ask Gemini no Gmail, Google Drive e Google Docs
- Cada botão tem o seu próprio interruptor no popup; ambos ativados por predefinição
- Sem intermitências: a ocultação aplica-se antes da primeira renderização e sobrevive às re-renderizações dinâmicas e à navegação interna da Google
- Funciona de imediato nos separadores já abertos no momento da instalação
- Alterar uma definição aplica-se em direto a todos os separadores abertos — sem recarregar
- Interface em 40 idiomas

#### Quando a Google muda algo

A marcação da Google é ofuscada e muda sem aviso, pelo que a extensão nunca depende de nomes de classes frágeis. Reconhece os botões por sinais estáveis — etiquetas, papéis, posição no cabeçalho — e, na dúvida, prefere não fazer nada a ocultar o controlo errado. Se a Google alterar muito a interface, um botão pode reaparecer por algum tempo: nada se parte, e uma atualização da extensão reporá a ocultação. O popup tem a ligação «Comunicar um problema» para que os botões regressados sejam rapidamente detetados.

#### As permissões, em palavras simples

- Armazenamento — guarda as suas duas definições no seu dispositivo
- Scripts — aplica a extensão aos separadores do Gmail/Drive/Docs já abertos na instalação
- Acesso a mail.google.com, drive.google.com e docs.google.com — os únicos sites onde funciona; não consegue ler outras páginas

#### Privacidade

Sem conta, sem análises, sem servidores, sem pedidos de rede. Os únicos dados guardados são os dois interruptores, localmente no seu navegador. Política de privacidade: https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

Gratuita e de código aberto: https://github.com/maximtop/hide-gmail-upgrade-button

Esta extensão não é afiliada da Google nem por ela aprovada. Gmail, Google Drive, Google Docs e Gemini são marcas da Google LLC, referidas apenas para descrever compatibilidade.

================================================================================

## Dutch (nl)

Google houdt permanent een «Upgrade»-knop in de koptekst van Gmail, Google Drive en Google Docs — met daarnaast een «Ask Gemini»-knop. Als u niet van plan bent te upgraden, is dat reclame waar u de hele dag naar kijkt. Deze extensie verwijdert die.

Installeer, en beide knoppen zijn weg — netjes, de omliggende pictogrammen schuiven aan, alsof ze nooit hebben bestaan.

#### Belangrijkste functies

- Verbergt de knoppen Upgrade en Ask Gemini in Gmail, Google Drive en Google Docs
- Elke knop heeft een eigen schakelaar in de popup; beide staan standaard aan
- Geen flikkering: het verbergen gebeurt vóór de eerste weergave en overleeft Googles dynamische her-renders en interne navigatie
- Werkt direct in tabbladen die al open waren bij de installatie
- Een gewijzigde instelling geldt live voor alle open tabbladen — zonder herladen
- Interface in 40 talen

#### Als Google iets verandert

De opmaak van Google is versluierd en verandert zonder aankondiging; de extensie vertrouwt daarom nooit op fragiele klassennamen. Ze herkent de knoppen aan stabiele signalen — labels, rollen, plek in de koptekst — en doet bij twijfel bewust niets, in plaats van het verkeerde element te verbergen. Verandert Google de interface ingrijpend, dan kan een knop tijdelijk terugkeren: er gaat niets kapot, en een update van de extensie herstelt het verbergen. De popup bevat de link «Een probleem melden», zodat teruggekeerde knoppen snel opvallen.

#### De machtigingen, in gewone taal

- Opslag — bewaart uw twee instellingen op uw apparaat
- Scripts — past de extensie toe op Gmail/Drive/Docs-tabbladen die bij installatie al open waren
- Toegang tot mail.google.com, drive.google.com en docs.google.com — de enige sites waarop ze draait; andere pagina's kan ze niet lezen

#### Privacy

Geen account, geen analyse, geen servers, geen netwerkverzoeken. De enige opgeslagen gegevens zijn de twee schakelaars, lokaal in uw browser. Privacybeleid: https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

Gratis en open source: https://github.com/maximtop/hide-gmail-upgrade-button

Deze extensie is niet gelieerd aan Google en wordt niet door Google ondersteund. Gmail, Google Drive, Google Docs en Gemini zijn handelsmerken van Google LLC, alleen genoemd om compatibiliteit te beschrijven.

================================================================================

## Danish (da)

Google har en permanent «Upgrade»-knap i toppen af Gmail, Google Drev og Google Docs — og en «Ask Gemini»-knap ved siden af. Hvis du ikke planlægger at opgradere, er det reklame, du kigger på hele dagen. Denne udvidelse fjerner den.

Installer, og begge knapper er væk — pænt og rent, naboikonerne rykker sammen, som om knapperne aldrig havde eksisteret.

#### Vigtigste funktioner

- Skjuler knapperne Upgrade og Ask Gemini i Gmail, Google Drev og Google Docs
- Hver knap har sin egen kontakt i popup'en; begge er slået til som standard
- Ingen blinken: skjulningen sker før første optegning og overlever Googles dynamiske gen-optegninger og interne navigation
- Virker med det samme i faner, der allerede var åbne ved installationen
- Ændringer i indstillinger gælder øjeblikkeligt for alle åbne faner — uden genindlæsning
- Brugerflade på 40 sprog

#### Når Google ændrer noget

Googles opmærkning er sløret og ændrer sig uden varsel, så udvidelsen stoler aldrig på skrøbelige klassenavne. Den genkender knapperne på stabile signaler — etiketter, roller, placering i toppen — og gør i tvivlstilfælde bevidst ingenting frem for at skjule det forkerte element. Ændrer Google grænsefladen markant, kan en knap dukke op igen i en periode: intet går i stykker, og en opdatering af udvidelsen genopretter skjulningen. Popup'en har linket «Rapportér et problem», så tilbagevendte knapper hurtigt bliver opdaget.

#### Tilladelserne, med almindelige ord

- Lagring — gemmer dine to indstillinger på din enhed
- Scripts — anvender udvidelsen på Gmail/Drev/Docs-faner, der allerede var åbne ved installationen
- Adgang til mail.google.com, drive.google.com og docs.google.com — de eneste sider, den kører på; andre sider kan den ikke læse

#### Privatliv

Ingen konto, ingen analyse, ingen servere, ingen netværksforespørgsler. De eneste gemte data er de to kontakter, lokalt i din browser. Privatlivspolitik: https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

Gratis og open source: https://github.com/maximtop/hide-gmail-upgrade-button

Denne udvidelse er ikke tilknyttet Google og er ikke godkendt af Google. Gmail, Google Drive, Google Docs og Gemini er varemærker tilhørende Google LLC og nævnes kun for at beskrive kompatibilitet.

================================================================================

## Swedish (sv)

Google håller en permanent «Upgrade»-knapp i sidhuvudet på Gmail, Google Drive och Google Dokument — och en «Ask Gemini»-knapp bredvid. Om du inte tänker uppgradera är det reklam du tittar på hela dagen. Det här tillägget tar bort den.

Installera, så är båda knapparna borta — snyggt, grannikonerna sluter luckan, som om knapparna aldrig funnits.

#### Viktigaste funktionerna

- Döljer knapparna Upgrade och Ask Gemini i Gmail, Google Drive och Google Dokument
- Varje knapp har sin egen omkopplare i popup-fönstret; båda är på som standard
- Inget blinkande: döljandet sker före första uppritningen och överlever Googles dynamiska omritningar och interna navigering
- Fungerar direkt i flikar som redan var öppna vid installationen
- Ändrade inställningar gäller direkt i alla öppna flikar — utan omladdning
- Gränssnitt på 40 språk

#### När Google ändrar något

Googles markup är obfuskerad och ändras utan förvarning, så tillägget litar aldrig på sköra klassnamn. Det känner igen knapparna på stabila signaler — etiketter, roller, plats i sidhuvudet — och gör vid tvekan medvetet ingenting hellre än att dölja fel element. Om Google ändrar gränssnittet kraftigt kan en knapp dyka upp igen ett tag: inget går sönder, och en uppdatering av tillägget återställer döljandet. Popup-fönstret har länken «Rapportera ett problem» så att återkomna knappar snabbt upptäcks.

#### Behörigheterna, med enkla ord

- Lagring — sparar dina två inställningar på din enhet
- Skript — tillämpar tillägget på Gmail/Drive/Dokument-flikar som redan var öppna vid installationen
- Åtkomst till mail.google.com, drive.google.com och docs.google.com — de enda webbplatser det körs på; andra sidor kan det inte läsa

#### Integritet

Inget konto, ingen analys, inga servrar, inga nätverksanrop. Det enda som lagras är de två omkopplarna, lokalt i din webbläsare. Integritetspolicy: https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

Gratis och öppen källkod: https://github.com/maximtop/hide-gmail-upgrade-button

Det här tillägget är inte anslutet till Google och stöds inte av Google. Gmail, Google Drive, Google Docs och Gemini är varumärken som tillhör Google LLC och nämns endast för att beskriva kompatibilitet.

================================================================================

## Norwegian (nb)

Google har en permanent «Upgrade»-knapp i toppfeltet i Gmail, Google Disk og Google Dokumenter — og en «Ask Gemini»-knapp ved siden av. Hvis du ikke planlegger å oppgradere, er det reklame du ser på hele dagen. Denne utvidelsen fjerner den.

Installer, og begge knappene er borte — pent og ryddig, naboikonene rykker sammen, som om knappene aldri fantes.

#### Hovedfunksjoner

- Skjuler knappene Upgrade og Ask Gemini i Gmail, Google Disk og Google Dokumenter
- Hver knapp har sin egen bryter i popupen; begge er på som standard
- Ingen blinking: skjulingen skjer før første opptegning og overlever Googles dynamiske omtegninger og interne navigasjon
- Virker umiddelbart i faner som allerede var åpne ved installasjonen
- Endrede innstillinger gjelder umiddelbart i alle åpne faner — uten omlasting
- Grensesnitt på 40 språk

#### Når Google endrer noe

Googles oppmerking er tilslørt og endres uten varsel, så utvidelsen stoler aldri på skjøre klassenavn. Den gjenkjenner knappene på stabile signaler — etiketter, roller, plassering i toppfeltet — og gjør i tvilstilfeller bevisst ingenting fremfor å skjule feil element. Endrer Google grensesnittet kraftig, kan en knapp dukke opp igjen en stund: ingenting går i stykker, og en oppdatering av utvidelsen gjenoppretter skjulingen. Popupen har lenken «Rapporter et problem», slik at knapper som kommer tilbake raskt blir oppdaget.

#### Tillatelsene, i klartekst

- Lagring — beholder de to innstillingene dine på enheten din
- Skript — bruker utvidelsen på Gmail/Disk/Dokumenter-faner som allerede var åpne ved installasjonen
- Tilgang til mail.google.com, drive.google.com og docs.google.com — de eneste nettstedene den kjører på; andre sider kan den ikke lese

#### Personvern

Ingen konto, ingen analyse, ingen servere, ingen nettverksforespørsler. Det eneste som lagres er de to bryterne, lokalt i nettleseren din. Personvernerklæring: https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

Gratis og åpen kildekode: https://github.com/maximtop/hide-gmail-upgrade-button

Denne utvidelsen er ikke tilknyttet Google og er ikke godkjent av Google. Gmail, Google Drive, Google Docs og Gemini er varemerker for Google LLC og nevnes kun for å beskrive kompatibilitet.

================================================================================

## Finnish (fi)

Google pitää Gmailin, Google Driven ja Google Docsin yläpalkissa pysyvää «Upgrade»-painiketta — ja sen vieressä «Ask Gemini» -painiketta. Jos et aio päivittää, se on mainontaa, jota katsot koko päivän. Tämä laajennus poistaa sen.

Asenna, ja molemmat painikkeet katoavat siististi: viereiset kuvakkeet siirtyvät yhteen, aivan kuin painikkeita ei olisi koskaan ollutkaan.

#### Tärkeimmät ominaisuudet

- Piilottaa Upgrade- ja Ask Gemini -painikkeet Gmailissa, Google Drivessa ja Google Docsissa
- Kummallakin painikkeella on oma kytkin ponnahdusikkunassa; molemmat ovat oletuksena päällä
- Ei välkkymistä: piilotus tapahtuu ennen ensimmäistä piirtoa ja kestää Googlen dynaamiset uudelleenpiirrot ja sovelluksen sisäisen navigoinnin
- Toimii heti välilehdissä, jotka olivat auki jo asennushetkellä
- Asetuksen muutos vaikuttaa heti kaikkiin avoimiin välilehtiin — ilman uudelleenlatausta
- Käyttöliittymä 40 kielellä

#### Kun Google muuttaa jotain

Googlen merkintäkoodi on sekoitettu ja muuttuu ilman varoitusta, joten laajennus ei koskaan nojaa hauraisiin luokkanimiin. Se tunnistaa painikkeet vakaista signaaleista — nimistä, rooleista, sijainnista yläpalkissa — ja epävarmassa tilanteessa se ei tee mitään sen sijaan, että piilottaisi väärän elementin. Jos Google muuttaa käyttöliittymää rajusti, painike voi ilmestyä hetkeksi takaisin: mikään ei hajoa, ja laajennuksen päivitys palauttaa piilotuksen. Ponnahdusikkunassa on «Ilmoita ongelmasta» -linkki, jotta palanneet painikkeet huomataan nopeasti.

#### Käyttöoikeudet selkokielellä

- Tallennus — säilyttää kaksi asetustasi laitteellasi
- Komentosarjat — ottaa laajennuksen käyttöön Gmail/Drive/Docs-välilehdissä, jotka olivat auki jo asennettaessa
- Pääsy osoitteisiin mail.google.com, drive.google.com ja docs.google.com — ainoat sivustot, joilla se toimii; muita sivuja se ei voi lukea

#### Yksityisyys

Ei tiliä, ei analytiikkaa, ei palvelimia, ei verkkopyyntöjä. Ainoat tallennetut tiedot ovat kaksi kytkintä, paikallisesti selaimessasi. Tietosuojakäytäntö: https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

Ilmainen ja avoin lähdekoodi: https://github.com/maximtop/hide-gmail-upgrade-button

Tämä laajennus ei ole Googlen tytäryhtiö eikä Googlen hyväksymä. Gmail, Google Drive, Google Docs ja Gemini ovat Google LLC:n tavaramerkkejä, jotka mainitaan vain yhteensopivuuden kuvaamiseksi.

================================================================================

## Polish (pl)

Google trzyma w nagłówku Gmaila, Dysku Google i Dokumentów Google stały przycisk «Upgrade», a obok — przycisk «Ask Gemini». Jeśli nie planujesz przechodzić na wersję płatną, to reklama, na którą patrzysz cały dzień. To rozszerzenie ją usuwa.

Zainstaluj, a oba przyciski znikną — czysto, sąsiednie ikony się zsuną, jakby przycisków nigdy nie było.

#### Najważniejsze funkcje

- Ukrywa przyciski Upgrade i Ask Gemini w Gmailu, na Dysku Google i w Dokumentach Google
- Każdy przycisk ma własny przełącznik w wyskakującym okienku; oba są domyślnie włączone
- Bez migotania: ukrywanie działa przed pierwszym wyrenderowaniem strony i przeżywa dynamiczne przerysowania oraz nawigację wewnątrz aplikacji Google
- Działa od razu w kartach otwartych jeszcze przed instalacją
- Zmiana ustawienia działa natychmiast we wszystkich otwartych kartach — bez przeładowań
- Interfejs w 40 językach

#### Gdy Google coś zmienia

Znaczniki Google są zaciemnione i zmieniają się bez ostrzeżenia, więc rozszerzenie nigdy nie polega na kruchych nazwach klas. Rozpoznaje przyciski po stabilnych sygnałach — etykietach, rolach, położeniu w nagłówku — a w razie wątpliwości świadomie nic nie robi, zamiast ukryć niewłaściwy element. Jeśli Google mocno zmieni interfejs, przycisk może na jakiś czas wrócić: nic się nie psuje, a aktualizacja rozszerzenia przywróci ukrywanie. W okienku jest link «Zgłoś problem», dzięki któremu powracające przyciski szybko zostają zauważone.

#### Uprawnienia prostymi słowami

- Pamięć — przechowuje dwa ustawienia na Twoim urządzeniu
- Skrypty — stosuje rozszerzenie do kart Gmail/Dysk/Dokumenty otwartych przed instalacją
- Dostęp do mail.google.com, drive.google.com i docs.google.com — jedyne strony, na których działa; innych stron nie może czytać

#### Prywatność

Bez kont, analityki, serwerów i żądań sieciowych. Jedyne przechowywane dane to dwa przełączniki, lokalnie w Twojej przeglądarce. Polityka prywatności: https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

Bezpłatne i open source: https://github.com/maximtop/hide-gmail-upgrade-button

To rozszerzenie nie jest powiązane z Google ani przez Google wspierane. Gmail, Google Drive, Google Docs i Gemini to znaki towarowe Google LLC, wymienione wyłącznie w celu opisania zgodności.

================================================================================

## Czech (cs)

Google drží v záhlaví Gmailu, Disku Google a Dokumentů Google trvalé tlačítko «Upgrade» a vedle něj tlačítko «Ask Gemini». Pokud upgrade neplánujete, je to reklama, na kterou se díváte celý den. Toto rozšíření ji odstraní.

Nainstalujte — a obě tlačítka zmizí: čistě, sousední ikony se srazí k sobě, jako by tlačítka nikdy neexistovala.

#### Hlavní funkce

- Skryje tlačítka Upgrade a Ask Gemini v Gmailu, na Disku Google a v Dokumentech Google
- Každé tlačítko má ve vyskakovacím okně vlastní přepínač; oba jsou ve výchozím stavu zapnuté
- Žádné problikávání: skrytí se použije před prvním vykreslením a přežije dynamická překreslení i navigaci uvnitř aplikací Google
- Funguje okamžitě i na kartách otevřených ještě před instalací
- Změna nastavení se projeví okamžitě na všech otevřených kartách — bez načítání
- Rozhraní ve 40 jazycích

#### Když Google něco změní

Značky Google jsou obfuskované a mění se bez varování, takže rozšíření nikdy nespoléhá na křehké názvy tříd. Tlačítka poznává podle stabilních signálů — popisků, rolí, umístění v záhlaví — a při nejistotě raději neudělá nic, než aby skrylo nesprávný prvek. Pokud Google rozhraní změní výrazně, tlačítko se může na čas objevit znovu: nic se nerozbije a aktualizace rozšíření skrývání obnoví. Ve vyskakovacím okně je odkaz «Nahlásit problém», aby si vrácených tlačítek někdo rychle všiml.

#### Oprávnění jednoduše

- Úložiště — uchovává dvě nastavení na vašem zařízení
- Skripty — aplikuje rozšíření na karty Gmail/Disk/Dokumenty otevřené před instalací
- Přístup k mail.google.com, drive.google.com a docs.google.com — jediné weby, na kterých běží; jiné stránky číst nemůže

#### Soukromí

Žádný účet, žádná analytika, žádné servery, žádné síťové požadavky. Jediná uložená data jsou dva přepínače, lokálně ve vašem prohlížeči. Zásady ochrany soukromí: https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

Zdarma a open source: https://github.com/maximtop/hide-gmail-upgrade-button

Toto rozšíření není spojeno s Googlem ani jím není schváleno. Gmail, Google Drive, Google Docs a Gemini jsou ochranné známky Google LLC, zmíněné pouze pro popis kompatibility.

================================================================================

## Slovak (sk)

Google drží v záhlaví Gmailu, Disku Google a Dokumentov Google trvalé tlačidlo «Upgrade» a vedľa neho tlačidlo «Ask Gemini». Ak upgrade neplánujete, je to reklama, na ktorú sa pozeráte celý deň. Toto rozšírenie ju odstráni.

Nainštalujte — a obe tlačidlá zmiznú: čisto, susedné ikony sa zomknú, akoby tlačidlá nikdy neexistovali.

#### Hlavné funkcie

- Skryje tlačidlá Upgrade a Ask Gemini v Gmaile, na Disku Google a v Dokumentoch Google
- Každé tlačidlo má vo vyskakovacom okne vlastný prepínač; oba sú predvolene zapnuté
- Žiadne blikanie: skrytie sa aplikuje pred prvým vykreslením a prežije dynamické prekreslenia aj navigáciu vnútri aplikácií Google
- Funguje okamžite aj na kartách otvorených ešte pred inštaláciou
- Zmena nastavenia sa prejaví okamžite na všetkých otvorených kartách — bez načítania
- Rozhranie v 40 jazykoch

#### Keď Google niečo zmení

Značky Google sú obfuskované a menia sa bez varovania, takže rozšírenie sa nikdy nespolieha na krehké názvy tried. Tlačidlá spoznáva podľa stabilných signálov — popisov, rolí, umiestnenia v záhlaví — a pri neistote radšej neurobí nič, než aby skrylo nesprávny prvok. Ak Google rozhranie zmení výrazne, tlačidlo sa môže na čas objaviť znovu: nič sa nepokazí a aktualizácia rozšírenia skrývanie obnoví. Vo vyskakovacom okne je odkaz «Nahlásiť problém», aby si vrátené tlačidlá niekto rýchlo všimol.

#### Oprávnenia jednoducho

- Úložisko — uchováva dve nastavenia na vašom zariadení
- Skripty — aplikuje rozšírenie na karty Gmail/Disk/Dokumenty otvorené pred inštaláciou
- Prístup k mail.google.com, drive.google.com a docs.google.com — jediné weby, na ktorých beží; iné stránky čítať nemôže

#### Súkromie

Žiadny účet, žiadna analytika, žiadne servery, žiadne sieťové požiadavky. Jediné uložené dáta sú dva prepínače, lokálne vo vašom prehliadači. Zásady ochrany súkromia: https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

Zadarmo a open source: https://github.com/maximtop/hide-gmail-upgrade-button

Toto rozšírenie nie je spojené s Googlom ani ním nie je schválené. Gmail, Google Drive, Google Docs a Gemini sú ochranné známky Google LLC, uvedené len na opis kompatibility.

================================================================================

## Hungarian (hu)

A Google állandó «Upgrade» gombot tart a Gmail, a Google Drive és a Google Dokumentumok fejlécében — mellette pedig egy «Ask Gemini» gombot. Ha nem tervez előfizetni, ez olyan reklám, amit egész nap néz. Ez a bővítmény eltávolítja.

Telepítse, és mindkét gomb eltűnik — tisztán, a szomszédos ikonok összezárnak, mintha a gombok soha nem is léteztek volna.

#### Fő funkciók

- Elrejti az Upgrade és az Ask Gemini gombokat a Gmailben, a Google Drive-ban és a Google Dokumentumokban
- Mindkét gombhoz saját kapcsoló tartozik a felugró ablakban; alapértelmezetten mindkettő be van kapcsolva
- Nincs villanás: az elrejtés az első kirajzolás előtt érvényesül, és túléli a Google dinamikus újrarajzolásait és az alkalmazáson belüli navigációt
- Azonnal működik a telepítéskor már nyitva lévő lapokon is
- A beállítások módosítása azonnal érvényes minden nyitott lapon — újratöltés nélkül
- Felület 40 nyelven

#### Amikor a Google változtat valamin

A Google jelölése obfuszkált és figyelmeztetés nélkül változik, ezért a bővítmény sosem támaszkodik törékeny osztálynevekre. A gombokat stabil jelek alapján ismeri fel — feliratok, szerepek, elhelyezkedés a fejlécben —, és bizonytalanság esetén inkább nem tesz semmit, mintsem rossz elemet rejtsen el. Ha a Google jelentősen átalakítja a felületet, egy gomb egy időre visszatérhet: semmi sem romlik el, és a bővítmény frissítése helyreállítja az elrejtést. A felugró ablakban ott a «Probléma jelentése» link, hogy a visszatérő gombok gyorsan feltűnjenek.

#### Az engedélyek egyszerűen

- Tárhely — a két beállítást az eszközén őrzi
- Parancsfájlok — a bővítményt a telepítéskor már nyitott Gmail/Drive/Dokumentumok lapokra alkalmazza
- Hozzáférés a mail.google.com, drive.google.com és docs.google.com címekhez — csak ezeken az oldalakon fut; más oldalakat nem tud olvasni

#### Adatvédelem

Nincs fiók, nincs analitika, nincsenek szerverek, nincsenek hálózati kérések. Az egyetlen tárolt adat a két kapcsoló, helyben a böngészőjében. Adatvédelmi irányelvek: https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

Ingyenes és nyílt forráskódú: https://github.com/maximtop/hide-gmail-upgrade-button

Ez a bővítmény nem áll kapcsolatban a Google-lal, és a Google nem támogatja. A Gmail, a Google Drive, a Google Docs és a Gemini a Google LLC védjegyei, említésük csak a kompatibilitás leírását szolgálja.

================================================================================

## Romanian (ro)

Google ține un buton «Upgrade» permanent în antetul Gmail, Google Drive și Google Docs — și un buton «Ask Gemini» alături. Dacă nu plănuiți un upgrade, e publicitate la care vă uitați toată ziua. Această extensie o elimină.

Instalați — și ambele butoane dispar: curat, pictogramele vecine se strâng, ca și cum butoanele n-ar fi existat niciodată.

#### Funcții principale

- Ascunde butoanele Upgrade și Ask Gemini din Gmail, Google Drive și Google Docs
- Fiecare buton are propriul comutator în fereastra pop-up; ambele sunt activate implicit
- Fără pâlpâit: ascunderea se aplică înainte de prima redare și supraviețuiește re-redărilor dinamice și navigării în aplicațiile Google
- Funcționează imediat și în filele deja deschise la instalare
- Schimbarea unei setări se aplică pe loc în toate filele deschise — fără reîncărcare
- Interfață în 40 de limbi

#### Când Google schimbă ceva

Marcajul Google este obfuscat și se schimbă fără avertisment, așa că extensia nu se bazează niciodată pe nume de clase fragile. Recunoaște butoanele după semnale stabile — etichete, roluri, poziția în antet — iar în caz de incertitudine preferă să nu facă nimic decât să ascundă elementul greșit. Dacă Google schimbă interfața semnificativ, un buton poate reapărea o vreme: nimic nu se strică, iar o actualizare a extensiei va restabili ascunderea. Pop-upul are linkul «Raportează o problemă», ca butoanele revenite să fie observate rapid.

#### Permisiunile, pe înțeles

- Stocare — păstrează cele două setări pe dispozitivul dvs.
- Scripturi — aplică extensia filelor Gmail/Drive/Docs deja deschise la instalare
- Acces la mail.google.com, drive.google.com și docs.google.com — singurele site-uri pe care rulează; alte pagini nu poate citi

#### Confidențialitate

Fără cont, fără analitice, fără servere, fără cereri de rețea. Singurele date stocate sunt cele două comutatoare, local în browserul dvs. Politica de confidențialitate: https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

Gratuită și open source: https://github.com/maximtop/hide-gmail-upgrade-button

Această extensie nu este afiliată cu Google și nu este aprobată de Google. Gmail, Google Drive, Google Docs și Gemini sunt mărci ale Google LLC, menționate doar pentru a descrie compatibilitatea.

================================================================================

## Bulgarian (bg)

Google държи постоянен бутон «Upgrade» в заглавната лента на Gmail, Google Drive и Google Docs — а до него бутон «Ask Gemini». Ако не планирате надграждане, това е реклама, която гледате цял ден. Това разширение я премахва.

Инсталирайте — и двата бутона изчезват: чисто, съседните икони се събират, сякаш бутоните никога не са съществували.

#### Основни функции

- Скрива бутоните Upgrade и Ask Gemini в Gmail, Google Drive и Google Docs
- Всеки бутон има собствен превключвател в изскачащия прозорец; и двата са включени по подразбиране
- Без премигване: скриването се прилага преди първото изчертаване и издържа динамичните пречертавания и навигацията в приложенията на Google
- Работи веднага и в раздели, отворени още преди инсталацията
- Промяната на настройка важи мигновено за всички отворени раздели — без презареждане
- Интерфейс на 40 езика

#### Когато Google промени нещо

Маркирането на Google е обфускирано и се променя без предупреждение, затова разширението никога не разчита на крехки имена на класове. То разпознава бутоните по стабилни сигнали — надписи, роли, място в заглавната лента — и при съмнение съзнателно не прави нищо, вместо да скрие грешен елемент. Ако Google промени интерфейса силно, бутон може временно да се появи отново: нищо не се чупи, а обновление на разширението ще възстанови скриването. В изскачащия прозорец има връзка «Съобщете за проблем», за да се забелязват бързо върналите се бутони.

#### Разрешенията с прости думи

- Хранилище — пази двете ви настройки на вашето устройство
- Скриптове — прилага разширението към раздели Gmail/Drive/Docs, отворени преди инсталацията
- Достъп до mail.google.com, drive.google.com и docs.google.com — единствените сайтове, на които работи; други страници не може да чете

#### Поверителност

Без акаунти, без анализи, без сървъри, без мрежови заявки. Единствените съхранявани данни са двата превключвателя, локално във вашия браузър. Политика за поверителност: https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

Безплатно и с отворен код: https://github.com/maximtop/hide-gmail-upgrade-button

Това разширение не е свързано с Google и не е одобрено от Google. Gmail, Google Drive, Google Docs и Gemini са търговски марки на Google LLC, споменати само за описание на съвместимостта.

================================================================================

## Greek (el)

Η Google κρατά ένα μόνιμο κουμπί «Upgrade» στην κεφαλίδα του Gmail, του Google Drive και των Google Docs — και δίπλα ένα κουμπί «Ask Gemini». Αν δεν σκοπεύετε να αναβαθμίσετε, είναι διαφήμιση που κοιτάτε όλη μέρα. Αυτή η επέκταση την αφαιρεί.

Εγκαταστήστε την — και τα δύο κουμπιά εξαφανίζονται: καθαρά, τα γειτονικά εικονίδια κλείνουν το κενό, σαν να μην υπήρξαν ποτέ.

#### Κύριες λειτουργίες

- Αποκρύπτει τα κουμπιά Upgrade και Ask Gemini σε Gmail, Google Drive και Google Docs
- Κάθε κουμπί έχει τον δικό του διακόπτη στο αναδυόμενο παράθυρο· και οι δύο είναι ενεργοί από προεπιλογή
- Χωρίς τρεμόπαιγμα: η απόκρυψη εφαρμόζεται πριν από την πρώτη σχεδίαση και αντέχει τις δυναμικές επανασχεδιάσεις και την εσωτερική πλοήγηση της Google
- Λειτουργεί αμέσως και σε καρτέλες που ήταν ήδη ανοιχτές κατά την εγκατάσταση
- Η αλλαγή ρύθμισης εφαρμόζεται ζωντανά σε όλες τις ανοιχτές καρτέλες — χωρίς επαναφόρτωση
- Διεπαφή σε 40 γλώσσες

#### Όταν η Google αλλάζει κάτι

Η σήμανση της Google είναι συσκοτισμένη και αλλάζει χωρίς προειδοποίηση, οπότε η επέκταση δεν βασίζεται ποτέ σε εύθραυστα ονόματα κλάσεων. Αναγνωρίζει τα κουμπιά από σταθερά σήματα — ετικέτες, ρόλους, θέση στην κεφαλίδα — και σε αμφιβολία προτιμά να μην κάνει τίποτα παρά να κρύψει λάθος στοιχείο. Αν η Google αλλάξει πολύ τη διεπαφή, ένα κουμπί μπορεί να επανεμφανιστεί για λίγο: τίποτα δεν χαλάει, και μια ενημέρωση της επέκτασης θα επαναφέρει την απόκρυψη. Το αναδυόμενο παράθυρο έχει σύνδεσμο «Αναφορά προβλήματος», ώστε τα κουμπιά που επιστρέφουν να γίνονται γρήγορα αντιληπτά.

#### Οι άδειες, με απλά λόγια

- Αποθήκευση — κρατά τις δύο ρυθμίσεις σας στη συσκευή σας
- Δέσμες ενεργειών — εφαρμόζει την επέκταση σε καρτέλες Gmail/Drive/Docs που ήταν ήδη ανοιχτές κατά την εγκατάσταση
- Πρόσβαση σε mail.google.com, drive.google.com και docs.google.com — οι μόνοι ιστότοποι όπου τρέχει· άλλες σελίδες δεν μπορεί να διαβάσει

#### Απόρρητο

Χωρίς λογαριασμό, χωρίς αναλυτικά στοιχεία, χωρίς διακομιστές, χωρίς αιτήματα δικτύου. Τα μόνα αποθηκευμένα δεδομένα είναι οι δύο διακόπτες, τοπικά στο πρόγραμμα περιήγησής σας. Πολιτική απορρήτου: https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

Δωρεάν και ανοιχτού κώδικα: https://github.com/maximtop/hide-gmail-upgrade-button

Αυτή η επέκταση δεν σχετίζεται με την Google ούτε εγκρίνεται από αυτήν. Τα Gmail, Google Drive, Google Docs και Gemini είναι εμπορικά σήματα της Google LLC και αναφέρονται μόνο για την περιγραφή συμβατότητας.

================================================================================

## Ukrainian (uk)

Google тримає в шапці Gmail, Google Диска та Google Документів постійну кнопку «Upgrade», а поруч — кнопку «Ask Gemini». Якщо ви не плануєте оновлюватися, це реклама, на яку ви дивитеся весь день. Це розширення її прибирає.

Встановіть — і обидві кнопки зникнуть: акуратно, сусідні іконки зімкнуться, наче кнопок ніколи не було.

#### Основні можливості

- Приховує кнопки Upgrade і Ask Gemini у Gmail, Google Диску та Google Документах
- У кожної кнопки — власний перемикач у спливному вікні; обидва ввімкнені за замовчуванням
- Без мерехтіння: приховування застосовується до першого малювання сторінки й переживає динамічні перемальовування та навігацію всередині застосунків Google
- Одразу працює у вкладках, відкритих ще до встановлення
- Зміна налаштування застосовується миттєво до всіх відкритих вкладок — без перезавантаження
- Інтерфейс 40 мовами

#### Коли Google щось змінює

Розмітка Google обфускована й змінюється без попередження, тому розширення ніколи не покладається на крихкі імена класів. Воно впізнає кнопки за стійкими ознаками — підписами, ролями, розташуванням у шапці — а за найменшої неоднозначності свідомо нічого не робить, щоб не приховати зайве. Якщо Google змінить інтерфейс сильніше, кнопка може на час з'явитися знову: нічого не зламається, а оновлення розширення поверне приховування. У спливному вікні є посилання «Повідомити про проблему», щоб кнопки, які повернулися, швидко помічали.

#### Дозволи простими словами

- Сховище — зберігає два значення перемикачів на вашому пристрої
- Скрипти — застосовує розширення до вкладок Gmail/Диска/Документів, відкритих до встановлення
- Доступ до mail.google.com, drive.google.com і docs.google.com — єдині сайти, де розширення працює; інші сторінки йому недоступні

#### Приватність

Без облікових записів, аналітики, серверів і мережевих запитів. Єдині дані, які зберігає розширення, — два перемикачі, локально у вашому браузері. Політика конфіденційності: https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

Безкоштовно і з відкритим кодом: https://github.com/maximtop/hide-gmail-upgrade-button

Розширення не афілійоване з Google і не схвалене нею. Gmail, Google Drive, Google Docs і Gemini — торговельні марки Google LLC, згадані лише для опису сумісності.

================================================================================

## Croatian (hr)

Google drži trajni gumb «Upgrade» u zaglavlju Gmaila, Google Drivea i Google dokumenata — a pokraj njega gumb «Ask Gemini». Ako ne planirate nadogradnju, to je oglas u koji gledate cijeli dan. Ovo ga proširenje uklanja.

Instalirajte — i oba gumba nestaju: uredno, susjedne se ikone primaknu, kao da gumbi nikada nisu postojali.

#### Glavne značajke

- Skriva gumbe Upgrade i Ask Gemini u Gmailu, Google Driveu i Google dokumentima
- Svaki gumb ima vlastiti prekidač u skočnom prozoru; oba su uključena prema zadanim postavkama
- Bez treperenja: skrivanje se primjenjuje prije prvog iscrtavanja i preživljava dinamička ponovna iscrtavanja te navigaciju unutar Googleovih aplikacija
- Radi odmah i u karticama otvorenima prije instalacije
- Promjena postavke odmah vrijedi u svim otvorenim karticama — bez ponovnog učitavanja
- Sučelje na 40 jezika

#### Kad Google nešto promijeni

Googleove su oznake obfuscirane i mijenjaju se bez najave, pa se proširenje nikada ne oslanja na krhka imena klasa. Gumbe prepoznaje po stabilnim signalima — natpisima, ulogama, položaju u zaglavlju — a u dvojbi radije ne čini ništa nego da sakrije pogrešan element. Promijeni li Google sučelje jače, gumb se može nakratko vratiti: ništa se ne kvari, a ažuriranje proširenja vratit će skrivanje. U skočnom prozoru je poveznica «Prijavi problem» kako bi se vraćeni gumbi brzo primijetili.

#### Dozvole, jednostavnim riječima

- Pohrana — čuva vaše dvije postavke na vašem uređaju
- Skripte — primjenjuje proširenje na kartice Gmail/Drive/Dokumenti otvorene prije instalacije
- Pristup na mail.google.com, drive.google.com i docs.google.com — jedine stranice na kojima radi; druge stranice ne može čitati

#### Privatnost

Bez računa, bez analitike, bez poslužitelja, bez mrežnih zahtjeva. Jedini pohranjeni podaci su dva prekidača, lokalno u vašem pregledniku. Pravila privatnosti: https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

Besplatno i otvorenog koda: https://github.com/maximtop/hide-gmail-upgrade-button

Ovo proširenje nije povezano s Googleom niti ga Google podržava. Gmail, Google Drive, Google Docs i Gemini zaštitni su znakovi tvrtke Google LLC, spomenuti samo radi opisa kompatibilnosti.

================================================================================

## Slovenian (sl)

Google v glavi Gmaila, Google Drivea in Google Dokumentov ohranja stalni gumb «Upgrade» — in poleg njega gumb «Ask Gemini». Če nadgradnje ne načrtujete, je to oglas, ki ga gledate ves dan. Ta razširitev ga odstrani.

Namestite — in oba gumba izgineta: čisto, sosednje ikone se strnejo, kot da gumbov nikoli ne bi bilo.

#### Glavne funkcije

- Skrije gumba Upgrade in Ask Gemini v Gmailu, Google Driveu in Google Dokumentih
- Vsak gumb ima svoje stikalo v pojavnem oknu; obe sta privzeto vklopljeni
- Brez utripanja: skrivanje se uveljavi pred prvim izrisom in preživi dinamične ponovne izrise ter navigacijo znotraj Googlovih aplikacij
- Deluje takoj tudi v zavihkih, odprtih pred namestitvijo
- Sprememba nastavitve velja takoj v vseh odprtih zavihkih — brez ponovnega nalaganja
- Vmesnik v 40 jezikih

#### Ko Google kaj spremeni

Googlove oznake so zakrite in se spreminjajo brez opozorila, zato se razširitev nikoli ne zanaša na krhka imena razredov. Gumba prepozna po stabilnih znakih — napisih, vlogah, položaju v glavi — in ob negotovosti raje ne stori ničesar, kot da bi skrila napačen element. Če Google vmesnik močno spremeni, se gumb lahko za nekaj časa vrne: nič se ne pokvari, posodobitev razširitve pa skrivanje obnovi. V pojavnem oknu je povezava «Prijavi težavo», da se vrnjeni gumbi hitro opazijo.

#### Dovoljenja, preprosto povedano

- Shramba — hrani vaši dve nastavitvi na vaši napravi
- Skripti — razširitev uporabi na zavihkih Gmail/Drive/Dokumenti, odprtih pred namestitvijo
- Dostop do mail.google.com, drive.google.com in docs.google.com — edine strani, na katerih teče; drugih strani ne more brati

#### Zasebnost

Brez računa, brez analitike, brez strežnikov, brez omrežnih zahtev. Edina shranjena podatka sta dve stikali, lokalno v vašem brskalniku. Pravilnik o zasebnosti: https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

Brezplačno in odprtokodno: https://github.com/maximtop/hide-gmail-upgrade-button

Ta razširitev ni povezana z Googlom in je Google ne podpira. Gmail, Google Drive, Google Docs in Gemini so blagovne znamke družbe Google LLC, omenjene le za opis združljivosti.

================================================================================

## Serbian (sr)

Google држи стално дугме «Upgrade» у заглављу Gmail-а, Google диска и Google докумената — а поред њега дугме «Ask Gemini». Ако не планирате надоградњу, то је реклама у коју гледате цео дан. Ово проширење је уклања.

Инсталирајте — и оба дугмета нестају: уредно, суседне иконе се примакну, као да дугмад никада није постојала.

#### Главне функције

- Скрива дугмад Upgrade и Ask Gemini у Gmail-у, Google диску и Google документима
- Свако дугме има свој прекидач у искачућем прозору; оба су подразумевано укључена
- Без треперења: скривање се примењује пре првог исцртавања и преживљава динамична поновна исцртавања и навигацију унутар Google апликација
- Ради одмах и у картицама отвореним пре инсталације
- Промена подешавања одмах важи у свим отвореним картицама — без поновног учитавања
- Интерфејс на 40 језика

#### Када Google нешто промени

Google-ове ознаке су обфусковане и мењају се без најаве, па се проширење никада не ослања на крхка имена класа. Дугмад препознаје по стабилним сигналима — натписима, улогама, положају у заглављу — а у недоумици радије не чини ништа него да сакрије погрешан елемент. Ако Google знатно измени интерфејс, дугме се може накратко вратити: ништа се не квари, а ажурирање проширења враћа скривање. У искачућем прозору је веза «Пријави проблем» како би се враћена дугмад брзо приметила.

#### Дозволе, једноставним речима

- Складиште — чува ваша два подешавања на вашем уређају
- Скрипте — примењује проширење на картице Gmail/Диск/Документи отворене пре инсталације
- Приступ на mail.google.com, drive.google.com и docs.google.com — једини сајтови на којима ради; друге странице не може да чита

#### Приватност

Без налога, без аналитике, без сервера, без мрежних захтева. Једини сачувани подаци су два прекидача, локално у вашем прегледачу. Политика приватности: https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

Бесплатно и отвореног кода: https://github.com/maximtop/hide-gmail-upgrade-button

Ово проширење није повезано са Google-ом нити га Google подржава. Gmail, Google Drive, Google Docs и Gemini су заштитни знакови компаније Google LLC, поменути само ради описа компатибилности.

================================================================================

## Lithuanian (lt)

„Google" Gmail, „Google" disko ir „Google" dokumentų antraštėje laiko nuolatinį mygtuką «Upgrade», o šalia — mygtuką «Ask Gemini». Jei atnaujinti neketinate, tai reklama, į kurią žiūrite visą dieną. Šis plėtinys ją pašalina.

Įdiekite — ir abu mygtukai dingsta: švariai, gretimos piktogramos susiglaudžia, tarsi mygtukų niekada nebūtų buvę.

#### Pagrindinės funkcijos

- Paslepia mygtukus „Upgrade" ir „Ask Gemini" sistemose „Gmail", „Google" diske ir „Google" dokumentuose
- Kiekvienas mygtukas turi savo jungiklį iškylančiajame lange; abu įjungti pagal numatytuosius nustatymus
- Jokio mirksėjimo: slėpimas pritaikomas prieš pirmą atvaizdavimą ir atlaiko dinaminius peratvaizdavimus bei naršymą programų viduje
- Veikia iš karto ir skirtukuose, atvertuose dar prieš diegimą
- Nustatymo pakeitimas iškart galioja visuose atviruose skirtukuose — be perkrovimo
- Sąsaja 40 kalbų

#### Kai „Google" ką nors pakeičia

„Google" žymėjimas užmaskuotas ir keičiasi be įspėjimo, todėl plėtinys niekada nesiremia trapiais klasių pavadinimais. Mygtukus jis atpažįsta pagal stabilius požymius — užrašus, vaidmenis, vietą antraštėje — o abejodamas sąmoningai nieko nedaro, užuot paslėpęs ne tą elementą. Jei „Google" sąsają pakeis smarkiai, mygtukas gali kuriam laikui grįžti: niekas nesuges, o plėtinio atnaujinimas slėpimą atkurs. Iškylančiajame lange yra nuoroda «Pranešti apie problemą», kad grįžę mygtukai būtų greitai pastebėti.

#### Leidimai paprastais žodžiais

- Saugykla — laiko du jūsų nustatymus jūsų įrenginyje
- Scenarijai — pritaiko plėtinį Gmail/Disko/Dokumentų skirtukams, atvertiems prieš diegimą
- Prieiga prie mail.google.com, drive.google.com ir docs.google.com — vienintelės svetainės, kuriose jis veikia; kitų puslapių skaityti negali

#### Privatumas

Jokių paskyrų, analitikos, serverių ar tinklo užklausų. Vieninteliai saugomi duomenys — du jungikliai, lokaliai jūsų naršyklėje. Privatumo politika: https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

Nemokamas ir atviro kodo: https://github.com/maximtop/hide-gmail-upgrade-button

Šis plėtinys nėra susijęs su „Google" ir nėra jos remiamas. „Gmail", „Google Drive", „Google Docs" ir „Gemini" yra „Google LLC" prekių ženklai, minimi tik suderinamumui apibūdinti.

================================================================================

## Turkish (tr)

Google, Gmail, Google Drive ve Google Dokümanlar'ın üst çubuğunda kalıcı bir «Upgrade» düğmesi tutuyor — yanında da bir «Ask Gemini» düğmesi. Yükseltme yapmayı düşünmüyorsanız, bu bütün gün baktığınız bir reklamdır. Bu uzantı onu kaldırır.

Yükleyin — iki düğme de temizce kaybolur: komşu simgeler aradaki boşluğu kapatır, sanki düğmeler hiç var olmamış gibi.

#### Başlıca özellikler

- Gmail, Google Drive ve Google Dokümanlar'daki Upgrade ve Ask Gemini düğmelerini gizler
- Her düğmenin açılır penceredeki kendi anahtarı vardır; ikisi de varsayılan olarak açıktır
- Titreme yok: gizleme, sayfanın ilk çiziminden önce uygulanır ve Google'ın dinamik yeniden çizimlerine ve uygulama içi gezinmeye dayanır
- Yükleme sırasında zaten açık olan sekmelerde anında çalışır
- Bir ayarın değiştirilmesi tüm açık sekmelere anında uygulanır — yeniden yükleme gerekmez
- 40 dilde arayüz

#### Google bir şeyi değiştirdiğinde

Google'ın işaretlemesi gizlenmiştir ve haber vermeden değişir; bu yüzden uzantı asla kırılgan sınıf adlarına güvenmez. Düğmeleri kararlı sinyallerden tanır — etiketler, roller, üst çubuktaki konum — ve emin olamadığında yanlış öğeyi gizlemektense bilinçli olarak hiçbir şey yapmaz. Google arayüzü büyük ölçüde değiştirirse bir düğme bir süreliğine geri dönebilir: hiçbir şey bozulmaz ve uzantının güncellemesi gizlemeyi geri getirir. Açılır pencerede, geri dönen düğmelerin hızla fark edilmesi için «Sorun bildir» bağlantısı vardır.

#### İzinler, sade bir dille

- Depolama — iki ayarınızı cihazınızda saklar
- Komut dosyaları — uzantıyı, yükleme sırasında zaten açık olan Gmail/Drive/Dokümanlar sekmelerine uygular
- mail.google.com, drive.google.com ve docs.google.com erişimi — çalıştığı tek siteler; başka sayfaları okuyamaz

#### Gizlilik

Hesap yok, analiz yok, sunucu yok, ağ isteği yok. Saklanan tek veri, tarayıcınızda yerel olarak tutulan iki anahtardır. Gizlilik politikası: https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

Ücretsiz ve açık kaynak: https://github.com/maximtop/hide-gmail-upgrade-button

Bu uzantı Google ile bağlantılı değildir ve Google tarafından desteklenmemektedir. Gmail, Google Drive, Google Docs ve Gemini, Google LLC'nin ticari markalarıdır ve yalnızca uyumluluğu tanımlamak için anılmıştır.

================================================================================

## Arabic (ar)

تُبقي Google زرّ «Upgrade» دائمًا في رأس Gmail وGoogle Drive وGoogle Docs — وبجانبه زرّ «Ask Gemini». إذا لم تكن تنوي الترقية، فهذا إعلان تنظر إليه طوال اليوم. هذه الإضافة تزيله.

ثبّت الإضافة، فيختفي الزرّان تمامًا: بشكل نظيف، وتتقارب الأيقونات المجاورة كأن الزرّين لم يكونا موجودين قط.

#### الميزات الرئيسية

- تخفي زرّي Upgrade وAsk Gemini في Gmail وGoogle Drive وGoogle Docs
- لكل زرّ مفتاح مستقل في النافذة المنبثقة؛ وكلاهما مفعّل افتراضيًا
- بلا وميض: يُطبَّق الإخفاء قبل أول رسم للصفحة ويصمد أمام إعادة الرسم الديناميكية والتنقّل داخل تطبيقات Google
- تعمل فورًا في علامات التبويب التي كانت مفتوحة قبل التثبيت
- تغيير الإعداد يسري فورًا على كل علامات التبويب المفتوحة — دون إعادة تحميل
- واجهة بـ 40 لغة

#### عندما تغيّر Google شيئًا

ترميز Google مُعمّى ويتغيّر دون إشعار، لذا لا تعتمد الإضافة أبدًا على أسماء الفئات الهشّة. إنها تتعرّف على الأزرار من إشارات ثابتة — التسميات والأدوار والموضع في الرأس — وعند الشك تمتنع عمدًا عن أي فعل بدلًا من إخفاء العنصر الخطأ. إذا غيّرت Google الواجهة كثيرًا، فقد يظهر الزر مجددًا لفترة: لا شيء يتعطّل، وسيعيد تحديث الإضافة الإخفاء. في النافذة المنبثقة رابط «الإبلاغ عن مشكلة» ليُلاحَظ الزر العائد بسرعة.

#### الأذونات بكلمات بسيطة

- التخزين — يحفظ إعداديك على جهازك
- البرمجة النصية — تُطبِّق الإضافة على علامات تبويب Gmail/Drive/Docs المفتوحة قبل التثبيت
- الوصول إلى mail.google.com وdrive.google.com وdocs.google.com — المواقع الوحيدة التي تعمل عليها؛ ولا يمكنها قراءة أي صفحة أخرى

#### الخصوصية

لا حسابات، لا تحليلات، لا خوادم، لا طلبات شبكة. البيانات الوحيدة المخزّنة هي المفتاحان، محليًا في متصفحك. سياسة الخصوصية: https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

مجانية ومفتوحة المصدر: https://github.com/maximtop/hide-gmail-upgrade-button

هذه الإضافة غير تابعة لـ Google وغير معتمدة منها. Gmail وGoogle Drive وGoogle Docs وGemini علامات تجارية لشركة Google LLC، وذُكرت فقط لوصف التوافق.

================================================================================

## Hebrew (he)

Google מחזיקה כפתור «Upgrade» קבוע בכותרת של Gmail, Google Drive ו-Google Docs — ולידו כפתור «Ask Gemini». אם אינכם מתכננים לשדרג, זו פרסומת שאתם מביטים בה כל היום. התוסף הזה מסיר אותה.

התקינו — ושני הכפתורים נעלמים: בנקיון, האייקונים השכנים נסגרים על הרווח, כאילו הכפתורים מעולם לא היו.

#### תכונות עיקריות

- מסתיר את הכפתורים Upgrade ו-Ask Gemini ב-Gmail, ב-Google Drive וב-Google Docs
- לכל כפתור מתג משלו בחלון הקופץ; שניהם פעילים כברירת מחדל
- ללא הבהוב: ההסתרה מוחלת לפני הציור הראשון ושורדת רינדורים מחדש דינמיים וניווט בתוך אפליקציות Google
- עובד מיד גם בכרטיסיות שהיו פתוחות לפני ההתקנה
- שינוי הגדרה חל מיידית על כל הכרטיסיות הפתוחות — ללא טעינה מחדש
- ממשק ב-40 שפות

#### כש-Google משנה משהו

הסימון של Google מעורפל ומשתנה ללא התראה, ולכן התוסף לעולם אינו נסמך על שמות מחלקות שבירים. הוא מזהה את הכפתורים לפי אותות יציבים — תוויות, תפקידים, מיקום בכותרת — ובספק מעדיף לא לעשות דבר מאשר להסתיר את הרכיב הלא נכון. אם Google תשנה את הממשק משמעותית, כפתור עשוי לחזור לזמן מה: שום דבר לא נשבר, ועדכון של התוסף ישחזר את ההסתרה. בחלון הקופץ יש קישור «דיווח על בעיה» כדי שכפתורים שחזרו יזוהו מהר.

#### ההרשאות, במילים פשוטות

- אחסון — שומר את שתי ההגדרות שלכם במכשירכם
- סקריפטים — מחיל את התוסף על כרטיסיות Gmail/Drive/Docs שהיו פתוחות לפני ההתקנה
- גישה אל mail.google.com, drive.google.com ו-docs.google.com — האתרים היחידים שבהם הוא פועל; דפים אחרים אינו יכול לקרוא

#### פרטיות

בלי חשבון, בלי אנליטיקה, בלי שרתים, בלי בקשות רשת. הנתונים היחידים שנשמרים הם שני המתגים, מקומית בדפדפן שלכם. מדיניות פרטיות: https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

חינמי ובקוד פתוח: https://github.com/maximtop/hide-gmail-upgrade-button

התוסף אינו קשור ל-Google ואינו נתמך על ידה. Gmail, Google Drive, Google Docs ו-Gemini הם סימנים מסחריים של Google LLC, המוזכרים רק לתיאור תאימות.

================================================================================

## Persian (fa)

Google در سربرگ Gmail، Google Drive و Google Docs دکمهٔ دائمی «Upgrade» را نگه می‌دارد — و کنارش دکمهٔ «Ask Gemini» را. اگر قصد ارتقا ندارید، این تبلیغی است که تمام روز به آن نگاه می‌کنید. این افزونه آن را حذف می‌کند.

نصب کنید — و هر دو دکمه تمیز ناپدید می‌شوند: آیکون‌های مجاور به هم می‌رسند، انگار دکمه‌ها هرگز وجود نداشته‌اند.

#### ویژگی‌های اصلی

- دکمه‌های Upgrade و Ask Gemini را در Gmail، Google Drive و Google Docs پنهان می‌کند
- هر دکمه کلید مستقل خود را در پنجرهٔ بازشو دارد؛ هر دو به‌طور پیش‌فرض روشن‌اند
- بدون سوسوزدن: پنهان‌سازی پیش از نخستین ترسیم صفحه اعمال می‌شود و در برابر بازترسیم‌های پویا و پیمایش درون برنامه‌های Google دوام می‌آورد
- بلافاصله در برگه‌هایی که پیش از نصب باز بوده‌اند نیز کار می‌کند
- تغییر تنظیم فوراً روی همهٔ برگه‌های باز اعمال می‌شود — بدون بارگذاری مجدد
- رابط کاربری به ۴۰ زبان

#### وقتی Google چیزی را تغییر می‌دهد

نشانه‌گذاری Google مبهم‌سازی شده و بدون اطلاع تغییر می‌کند، بنابراین افزونه هرگز به نام کلاس‌های شکننده تکیه نمی‌کند. دکمه‌ها را از نشانه‌های پایدار می‌شناسد — برچسب‌ها، نقش‌ها، جایگاه در سربرگ — و در تردید عمداً هیچ کاری نمی‌کند تا عنصر اشتباه را پنهان نکند. اگر Google رابط را زیاد تغییر دهد، دکمه ممکن است مدتی دوباره ظاهر شود: چیزی خراب نمی‌شود و به‌روزرسانی افزونه پنهان‌سازی را برمی‌گرداند. در پنجرهٔ بازشو پیوند «گزارش مشکل» هست تا دکمه‌های بازگشته سریع دیده شوند.

#### مجوزها به زبان ساده

- ذخیره‌سازی — دو تنظیم شما را روی دستگاهتان نگه می‌دارد
- اسکریپت‌نویسی — افزونه را روی برگه‌های Gmail/Drive/Docs که پیش از نصب باز بوده‌اند اعمال می‌کند
- دسترسی به mail.google.com، drive.google.com و docs.google.com — تنها سایت‌هایی که در آن‌ها اجرا می‌شود؛ صفحات دیگر را نمی‌تواند بخواند

#### حریم خصوصی

نه حساب کاربری، نه تحلیل رفتار، نه سرور، نه درخواست شبکه. تنها داده‌های ذخیره‌شده همان دو کلیدند، به‌صورت محلی در مرورگر شما. سیاست حریم خصوصی: https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

رایگان و متن‌باز: https://github.com/maximtop/hide-gmail-upgrade-button

این افزونه به Google وابسته نیست و از سوی آن تأیید نشده است. Gmail، Google Drive، Google Docs و Gemini علائم تجاری Google LLC هستند و تنها برای توصیف سازگاری ذکر شده‌اند.

================================================================================

## Hindi (hi)

Google, Gmail, Google Drive और Google Docs के हेडर में एक स्थायी «Upgrade» बटन रखता है — और उसके बगल में «Ask Gemini» बटन। अगर आप अपग्रेड नहीं करना चाहते, तो यह वह विज्ञापन है जिसे आप दिन भर देखते हैं। यह एक्सटेंशन उसे हटा देता है।

इंस्टॉल करें — और दोनों बटन साफ़-सुथरे ढंग से गायब हो जाते हैं: पड़ोसी आइकन पास आ जाते हैं, मानो बटन कभी थे ही नहीं।

#### मुख्य विशेषताएँ

- Gmail, Google Drive और Google Docs में Upgrade और Ask Gemini बटन छिपाता है
- हर बटन का पॉपअप में अपना टॉगल है; दोनों डिफ़ॉल्ट रूप से चालू हैं
- कोई झिलमिलाहट नहीं: छिपाना पेज के पहले रेंडर से पहले लागू होता है और Google के डायनामिक री-रेंडर तथा ऐप के भीतर नेविगेशन में बना रहता है
- इंस्टॉल के समय पहले से खुले टैब में तुरंत काम करता है
- सेटिंग बदलते ही सभी खुले टैब पर तुरंत लागू — बिना रीलोड
- 40 भाषाओं में इंटरफ़ेस

#### जब Google कुछ बदलता है

Google का मार्कअप अस्पष्ट है और बिना सूचना बदलता है, इसलिए एक्सटेंशन कभी नाज़ुक क्लास नामों पर निर्भर नहीं करता। यह बटन को स्थिर संकेतों से पहचानता है — लेबल, रोल, हेडर में स्थान — और संदेह होने पर गलत तत्व छिपाने के बजाय जान-बूझकर कुछ नहीं करता। अगर Google इंटरफ़ेस बहुत बदल दे, तो बटन कुछ समय के लिए फिर दिख सकता है: कुछ नहीं टूटता, और एक्सटेंशन का अपडेट छिपाना बहाल कर देगा। पॉपअप में «समस्या की रिपोर्ट करें» लिंक है ताकि लौटे बटन जल्दी नज़र में आएँ।

#### अनुमतियाँ, सरल शब्दों में

- स्टोरेज — आपकी दो सेटिंग्स आपके डिवाइस पर रखता है
- स्क्रिप्टिंग — इंस्टॉल के समय पहले से खुले Gmail/Drive/Docs टैब पर एक्सटेंशन लागू करता है
- mail.google.com, drive.google.com और docs.google.com तक पहुँच — केवल यही साइटें जहाँ यह चलता है; कोई और पेज नहीं पढ़ सकता

#### निजता

न खाता, न एनालिटिक्स, न सर्वर, न नेटवर्क अनुरोध। संग्रहीत एकमात्र डेटा दो टॉगल हैं, आपके ब्राउज़र में स्थानीय रूप से। गोपनीयता नीति: https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

मुफ़्त और ओपन सोर्स: https://github.com/maximtop/hide-gmail-upgrade-button

यह एक्सटेंशन Google से संबद्ध नहीं है और न ही Google द्वारा समर्थित है। Gmail, Google Drive, Google Docs और Gemini, Google LLC के ट्रेडमार्क हैं, जिनका उल्लेख केवल संगतता बताने के लिए किया गया है।

================================================================================

## Thai (th)

Google วางปุ่ม «Upgrade» ถาวรไว้ในส่วนหัวของ Gmail, Google ไดรฟ์ และ Google เอกสาร — พร้อมปุ่ม «Ask Gemini» อยู่ข้าง ๆ หากคุณไม่คิดจะอัปเกรด นั่นคือโฆษณาที่คุณมองอยู่ทั้งวัน ส่วนขยายนี้จะลบมันออก

ติดตั้งแล้วปุ่มทั้งสองจะหายไปอย่างเรียบร้อย ไอคอนข้างเคียงจะขยับชิดกัน ราวกับปุ่มเหล่านั้นไม่เคยมีอยู่

#### คุณสมบัติหลัก

- ซ่อนปุ่ม Upgrade และ Ask Gemini ใน Gmail, Google ไดรฟ์ และ Google เอกสาร
- แต่ละปุ่มมีสวิตช์ของตัวเองในหน้าต่างป๊อปอัป โดยค่าเริ่มต้นเปิดทั้งคู่
- ไม่มีการกะพริบ: การซ่อนมีผลก่อนการวาดหน้าครั้งแรก และคงอยู่แม้ Google จะวาดหน้าใหม่แบบไดนามิกหรือมีการนำทางภายในแอป
- ทำงานทันทีในแท็บที่เปิดอยู่ก่อนการติดตั้ง
- การเปลี่ยนการตั้งค่ามีผลทันทีกับทุกแท็บที่เปิดอยู่ — ไม่ต้องรีโหลด
- อินเทอร์เฟซ 40 ภาษา

#### เมื่อ Google เปลี่ยนแปลงบางอย่าง

มาร์กอัปของ Google ถูกทำให้อ่านยากและเปลี่ยนได้โดยไม่แจ้งล่วงหน้า ส่วนขยายจึงไม่พึ่งพาชื่อคลาสที่เปราะบาง แต่จดจำปุ่มจากสัญญาณที่เสถียร — ป้ายกำกับ บทบาท ตำแหน่งในส่วนหัว — และเมื่อไม่แน่ใจจะจงใจไม่ทำอะไรเลย แทนที่จะซ่อนผิดปุ่ม หาก Google เปลี่ยนอินเทอร์เฟซมาก ปุ่มอาจกลับมาชั่วคราว: ไม่มีอะไรพัง และการอัปเดตส่วนขยายจะกู้การซ่อนคืน ในป๊อปอัปมีลิงก์ «รายงานปัญหา» เพื่อให้ปุ่มที่กลับมาถูกพบอย่างรวดเร็ว

#### สิทธิ์การเข้าถึง อธิบายง่าย ๆ

- พื้นที่จัดเก็บ — เก็บการตั้งค่าสองรายการไว้บนอุปกรณ์ของคุณ
- สคริปต์ — ใช้ส่วนขยายกับแท็บ Gmail/ไดรฟ์/เอกสารที่เปิดอยู่ก่อนติดตั้ง
- การเข้าถึง mail.google.com, drive.google.com และ docs.google.com — เว็บไซต์เดียวที่มันทำงาน อ่านหน้าอื่นไม่ได้

#### ความเป็นส่วนตัว

ไม่มีบัญชี ไม่มีการวิเคราะห์ ไม่มีเซิร์ฟเวอร์ ไม่มีคำขอเครือข่าย ข้อมูลเดียวที่เก็บคือสวิตช์สองตัว ในเบราว์เซอร์ของคุณเอง นโยบายความเป็นส่วนตัว: https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

ฟรีและโอเพนซอร์ส: https://github.com/maximtop/hide-gmail-upgrade-button

ส่วนขยายนี้ไม่ได้เกี่ยวข้องหรือได้รับการรับรองจาก Google Gmail, Google Drive, Google Docs และ Gemini เป็นเครื่องหมายการค้าของ Google LLC ซึ่งกล่าวถึงเพื่ออธิบายความเข้ากันได้เท่านั้น

================================================================================

## Indonesian (id)

Google menempatkan tombol «Upgrade» permanen di header Gmail, Google Drive, dan Google Docs — dengan tombol «Ask Gemini» di sebelahnya. Jika Anda tidak berencana meng-upgrade, itu adalah iklan yang Anda pandangi sepanjang hari. Ekstensi ini menghapusnya.

Pasang, dan kedua tombol hilang dengan rapi: ikon-ikon di sebelahnya merapat, seolah tombol itu tidak pernah ada.

#### Fitur utama

- Menyembunyikan tombol Upgrade dan Ask Gemini di Gmail, Google Drive, dan Google Docs
- Setiap tombol punya sakelar sendiri di popup; keduanya aktif secara bawaan
- Tanpa kedipan: penyembunyian diterapkan sebelum halaman pertama kali digambar dan bertahan terhadap render ulang dinamis serta navigasi di dalam aplikasi Google
- Langsung bekerja di tab yang sudah terbuka saat pemasangan
- Perubahan pengaturan langsung berlaku di semua tab terbuka — tanpa muat ulang
- Antarmuka dalam 40 bahasa

#### Saat Google mengubah sesuatu

Markup Google dikaburkan dan berubah tanpa pemberitahuan, jadi ekstensi ini tidak pernah bergantung pada nama kelas yang rapuh. Ia mengenali tombol dari sinyal yang stabil — label, peran, posisi di header — dan saat ragu memilih tidak melakukan apa-apa daripada menyembunyikan elemen yang salah. Jika Google mengubah antarmuka secara besar, tombol bisa muncul lagi untuk sementara: tidak ada yang rusak, dan pembaruan ekstensi akan memulihkan penyembunyian. Popup punya tautan «Laporkan masalah» agar tombol yang kembali cepat diketahui.

#### Izin, dengan kata sederhana

- Penyimpanan — menyimpan dua pengaturan Anda di perangkat Anda
- Skrip — menerapkan ekstensi ke tab Gmail/Drive/Docs yang sudah terbuka saat pemasangan
- Akses ke mail.google.com, drive.google.com, dan docs.google.com — satu-satunya situs tempat ia berjalan; halaman lain tidak bisa dibacanya

#### Privasi

Tanpa akun, tanpa analitik, tanpa server, tanpa permintaan jaringan. Satu-satunya data yang disimpan adalah dua sakelar, secara lokal di browser Anda. Kebijakan privasi: https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

Gratis dan open source: https://github.com/maximtop/hide-gmail-upgrade-button

Ekstensi ini tidak berafiliasi dengan Google dan tidak didukung oleh Google. Gmail, Google Drive, Google Docs, dan Gemini adalah merek dagang Google LLC, disebut hanya untuk menjelaskan kompatibilitas.

================================================================================

## Filipino (fil)

Pinananatili ng Google ang permanenteng button na «Upgrade» sa header ng Gmail, Google Drive, at Google Docs — at katabi nito ang button na «Ask Gemini». Kung wala kang planong mag-upgrade, iyon ay patalastas na tinitingnan mo buong araw. Inaalis ito ng extension na ito.

I-install — at parehong nawawala nang malinis ang dalawang button: nagdidikit ang mga katabing icon, na parang hindi kailanman umiral ang mga button.

#### Mga pangunahing tampok

- Itinatago ang mga button na Upgrade at Ask Gemini sa Gmail, Google Drive, at Google Docs
- Bawat button ay may sariling switch sa popup; parehong naka-on bilang default
- Walang pagkurap: ang pagtatago ay nailalapat bago ang unang pag-render at nakakaligtas sa mga dynamic na muling pag-render at nabigasyon sa loob ng mga app ng Google
- Gumagana agad sa mga tab na bukas na bago pa ang pag-install
- Ang pagbabago ng setting ay agad na nalalapat sa lahat ng bukas na tab — walang reload
- Interface sa 40 wika

#### Kapag may binago ang Google

Ang markup ng Google ay obfuscated at nagbabago nang walang abiso, kaya hindi kailanman umaasa ang extension sa maseselang pangalan ng class. Nakikilala nito ang mga button sa pamamagitan ng matatag na senyales — label, role, posisyon sa header — at kapag nag-aalinlangan, sadyang walang ginagawa kaysa itago ang maling elemento. Kung malaki ang pagbabago ng Google sa interface, maaaring lumitaw muli ang button nang pansamantala: walang masisira, at ibabalik ng update ng extension ang pagtatago. May link na «Mag-ulat ng problema» sa popup para mabilis mapansin ang mga bumalik na button.

#### Ang mga pahintulot, sa simpleng salita

- Storage — iniingatan ang dalawang setting mo sa iyong device
- Scripting — inilalapat ang extension sa mga tab ng Gmail/Drive/Docs na bukas na noong i-install
- Access sa mail.google.com, drive.google.com, at docs.google.com — ang tanging mga site kung saan ito tumatakbo; hindi nito mababasa ang ibang pahina

#### Privacy

Walang account, walang analytics, walang server, walang network request. Ang tanging data na iniimbak ay ang dalawang switch, lokal sa iyong browser. Patakaran sa privacy: https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

Libre at open source: https://github.com/maximtop/hide-gmail-upgrade-button

Ang extension na ito ay hindi kaakibat ng Google at hindi inendorso ng Google. Ang Gmail, Google Drive, Google Docs, at Gemini ay mga trademark ng Google LLC, binanggit lamang upang ilarawan ang compatibility.

================================================================================

## Vietnamese (vi)

Google giữ một nút «Upgrade» cố định trên thanh đầu của Gmail, Google Drive và Google Tài liệu — cạnh đó là nút «Ask Gemini». Nếu bạn không định nâng cấp, đó là quảng cáo bạn nhìn suốt cả ngày. Tiện ích này loại bỏ nó.

Cài đặt — và cả hai nút biến mất gọn gàng: các biểu tượng bên cạnh xích lại gần nhau, như thể các nút chưa từng tồn tại.

#### Tính năng chính

- Ẩn các nút Upgrade và Ask Gemini trong Gmail, Google Drive và Google Tài liệu
- Mỗi nút có công tắc riêng trong cửa sổ bật lên; cả hai bật sẵn theo mặc định
- Không nhấp nháy: việc ẩn được áp dụng trước lần vẽ trang đầu tiên và trụ vững qua các lần vẽ lại động cũng như điều hướng bên trong ứng dụng Google
- Hoạt động ngay trong các thẻ đã mở trước khi cài đặt
- Thay đổi cài đặt có hiệu lực tức thì trên mọi thẻ đang mở — không cần tải lại
- Giao diện 40 ngôn ngữ

#### Khi Google thay đổi điều gì đó

Mã đánh dấu của Google bị làm rối và thay đổi không báo trước, nên tiện ích không bao giờ dựa vào tên lớp mong manh. Nó nhận diện các nút qua tín hiệu ổn định — nhãn, vai trò, vị trí trên thanh đầu — và khi không chắc chắn thì cố ý không làm gì thay vì ẩn nhầm phần tử. Nếu Google thay đổi giao diện nhiều, nút có thể xuất hiện lại một thời gian: không có gì hỏng, và bản cập nhật tiện ích sẽ khôi phục việc ẩn. Cửa sổ bật lên có liên kết «Báo cáo sự cố» để các nút quay lại được phát hiện nhanh.

#### Quyền hạn, nói một cách đơn giản

- Bộ nhớ — giữ hai cài đặt của bạn trên thiết bị của bạn
- Tập lệnh — áp dụng tiện ích cho các thẻ Gmail/Drive/Tài liệu đã mở khi cài đặt
- Truy cập mail.google.com, drive.google.com và docs.google.com — những trang duy nhất nó chạy; các trang khác nó không thể đọc

#### Quyền riêng tư

Không tài khoản, không phân tích, không máy chủ, không yêu cầu mạng. Dữ liệu duy nhất được lưu là hai công tắc, cục bộ trong trình duyệt của bạn. Chính sách quyền riêng tư: https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

Miễn phí và mã nguồn mở: https://github.com/maximtop/hide-gmail-upgrade-button

Tiện ích này không liên kết với Google và không được Google chứng thực. Gmail, Google Drive, Google Docs và Gemini là thương hiệu của Google LLC, chỉ được nhắc đến để mô tả khả năng tương thích.

================================================================================

## Japanese (ja)

Google は Gmail、Google ドライブ、Google ドキュメントのヘッダーに「Upgrade」ボタンを常時表示し、その隣に「Ask Gemini」ボタンを置いています。アップグレードの予定がないなら、それは一日中目に入る広告です。この拡張機能はそれを取り除きます。

インストールすると両方のボタンがきれいに消え、隣のアイコンが詰めて並び、まるで最初から存在しなかったかのようになります。

#### 主な機能

- Gmail、Google ドライブ、Google ドキュメントの Upgrade ボタンと Ask Gemini ボタンを非表示にします
- 各ボタンにはポップアップ内に個別のスイッチがあり、既定でどちらもオンです
- ちらつきなし：非表示は最初の描画前に適用され、Google の動的な再描画やアプリ内ナビゲーションでも維持されます
- インストール時にすでに開いていたタブでも即座に機能します
- 設定の変更は開いているすべてのタブに即時反映されます — 再読み込み不要
- 40 言語のインターフェース

#### Google が何かを変更したとき

Google のマークアップは難読化されており予告なく変わるため、この拡張機能は壊れやすいクラス名には決して依存しません。ラベル、ロール、ヘッダー内の位置といった安定したシグナルでボタンを認識し、確信が持てないときは誤った要素を隠すのではなく、意図的に何もしません。Google がインターフェースを大きく変えた場合、ボタンが一時的に再表示されることがありますが、何も壊れず、拡張機能のアップデートで非表示が復元されます。ポップアップには「問題を報告」リンクがあり、再表示されたボタンにすぐ気づけます。

#### 権限をわかりやすく

- ストレージ — 2 つの設定値をお使いの端末に保存します
- スクリプト — インストール時にすでに開いていた Gmail／ドライブ／ドキュメントのタブに拡張機能を適用します
- mail.google.com、drive.google.com、docs.google.com へのアクセス — 動作するのはこの 3 サイトのみで、他のページは読み取れません

#### プライバシー

アカウントなし、分析なし、サーバーなし、ネットワークリクエストなし。保存されるデータは 2 つのスイッチだけで、ブラウザー内にローカル保存されます。プライバシーポリシー: https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

無料でオープンソース: https://github.com/maximtop/hide-gmail-upgrade-button

この拡張機能は Google と提携しておらず、Google の承認も受けていません。Gmail、Google Drive、Google Docs、Gemini は Google LLC の商標であり、互換性の説明のためにのみ言及しています。

================================================================================

## Korean (ko)

Google은 Gmail, Google Drive, Google Docs의 헤더에 «Upgrade» 버튼을 상시 표시하고 그 옆에 «Ask Gemini» 버튼을 둡니다. 업그레이드할 계획이 없다면 하루 종일 바라보는 광고일 뿐입니다. 이 확장 프로그램이 그것을 없애 줍니다.

설치하면 두 버튼이 깔끔하게 사라지고, 옆의 아이콘들이 빈자리를 메워 처음부터 없었던 것처럼 보입니다.

#### 주요 기능

- Gmail, Google Drive, Google Docs에서 Upgrade 버튼과 Ask Gemini 버튼을 숨깁니다
- 각 버튼마다 팝업에 개별 스위치가 있으며 기본적으로 둘 다 켜져 있습니다
- 깜빡임 없음: 숨김은 첫 렌더링 전에 적용되며 Google의 동적 재렌더링과 앱 내 탐색에도 유지됩니다
- 설치 시 이미 열려 있던 탭에서도 즉시 작동합니다
- 설정 변경은 열려 있는 모든 탭에 즉시 반영됩니다 — 새로고침 불필요
- 40개 언어 인터페이스

#### Google이 무언가를 바꿀 때

Google의 마크업은 난독화되어 있고 예고 없이 바뀌므로, 이 확장 프로그램은 깨지기 쉬운 클래스 이름에 절대 의존하지 않습니다. 레이블, 역할, 헤더 내 위치 같은 안정적인 신호로 버튼을 인식하고, 확실하지 않으면 잘못된 요소를 숨기는 대신 의도적으로 아무것도 하지 않습니다. Google이 인터페이스를 크게 바꾸면 버튼이 잠시 다시 나타날 수 있지만, 아무것도 망가지지 않으며 확장 프로그램 업데이트가 숨김을 복원합니다. 팝업에는 «문제 신고» 링크가 있어 다시 나타난 버튼을 빨리 알아차릴 수 있습니다.

#### 권한을 쉬운 말로

- 저장소 — 두 가지 설정값을 사용자의 기기에 보관합니다
- 스크립팅 — 설치 시 이미 열려 있던 Gmail/Drive/Docs 탭에 확장 프로그램을 적용합니다
- mail.google.com, drive.google.com, docs.google.com 접근 — 실행되는 유일한 사이트이며 다른 페이지는 읽을 수 없습니다

#### 개인정보 보호

계정 없음, 분석 없음, 서버 없음, 네트워크 요청 없음. 저장되는 유일한 데이터는 두 개의 스위치이며, 브라우저에 로컬로 보관됩니다. 개인정보처리방침: https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

무료 오픈 소스: https://github.com/maximtop/hide-gmail-upgrade-button

이 확장 프로그램은 Google과 제휴하지 않았으며 Google의 승인을 받지 않았습니다. Gmail, Google Drive, Google Docs, Gemini는 Google LLC의 상표이며 호환성 설명을 위해서만 언급됩니다.

================================================================================

## Chinese, Simplified (zh_CN)

Google 在 Gmail、Google 云端硬盘和 Google 文档的顶栏中常驻一个「Upgrade」按钮，旁边还有「Ask Gemini」按钮。如果你不打算升级，那就是你整天盯着看的广告。这个扩展会把它去掉。

安装后，两个按钮干净利落地消失：相邻图标自动靠拢，就像它们从未存在过一样。

#### 主要功能

- 隐藏 Gmail、Google 云端硬盘和 Google 文档中的 Upgrade 和 Ask Gemini 按钮
- 每个按钮在弹窗中都有独立开关；默认均为开启
- 无闪烁：隐藏在页面首次绘制前生效，并能挺过 Google 的动态重绘和应用内导航
- 对安装时已打开的标签页立即生效
- 更改设置即时应用到所有打开的标签页 — 无需刷新
- 40 种语言的界面

#### 当 Google 更改界面时

Google 的标记经过混淆且随时变化，因此扩展从不依赖脆弱的类名。它通过稳定的信号识别按钮 — 标签、角色、在顶栏中的位置 — 拿不准时宁可什么都不做，也不隐藏错误的元素。如果 Google 大改界面，按钮可能会暂时重新出现：不会有任何损坏，扩展更新后即可恢复隐藏。弹窗里有「报告问题」链接，便于快速发现重新出现的按钮。

#### 用大白话说权限

- 存储 — 在你的设备上保存两个开关的状态
- 脚本 — 将扩展应用到安装时已打开的 Gmail/云端硬盘/文档标签页
- 访问 mail.google.com、drive.google.com 和 docs.google.com — 它仅在这三个网站运行；无法读取其他任何页面

#### 隐私

无账号、无分析、无服务器、无网络请求。存储的唯一数据就是那两个开关，保存在你浏览器本地。隐私政策: https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

免费且开源: https://github.com/maximtop/hide-gmail-upgrade-button

本扩展与 Google 无关联，也未获其认可。Gmail、Google Drive、Google Docs 和 Gemini 是 Google LLC 的商标，提及仅为说明兼容性。

================================================================================

## Chinese, Traditional (zh_TW)

Google 在 Gmail、Google 雲端硬碟和 Google 文件的頂欄常駐一個「Upgrade」按鈕，旁邊還有「Ask Gemini」按鈕。如果你不打算升級，那就是你整天盯著看的廣告。這個擴充功能會把它移除。

安裝後，兩個按鈕乾淨俐落地消失：相鄰圖示自動靠攏，就像它們從未存在過一樣。

#### 主要功能

- 隱藏 Gmail、Google 雲端硬碟和 Google 文件中的 Upgrade 和 Ask Gemini 按鈕
- 每個按鈕在彈出視窗中都有獨立開關；預設皆為開啟
- 無閃爍：隱藏在頁面首次繪製前生效，並能撐過 Google 的動態重繪與應用內導覽
- 對安裝時已開啟的分頁立即生效
- 變更設定即時套用到所有開啟的分頁 — 無需重新整理
- 40 種語言的介面

#### 當 Google 更改介面時

Google 的標記經過混淆且隨時變動，因此擴充功能從不依賴脆弱的類別名稱。它透過穩定的訊號辨識按鈕 — 標籤、角色、在頂欄中的位置 — 拿不準時寧可什麼都不做，也不隱藏錯誤的元素。如果 Google 大幅改動介面，按鈕可能暫時重新出現：不會有任何損壞，擴充功能更新後即可恢復隱藏。彈出視窗裡有「回報問題」連結，方便快速發現重新出現的按鈕。

#### 用簡單的話說權限

- 儲存空間 — 在你的裝置上保存兩個開關的狀態
- 指令碼 — 將擴充功能套用到安裝時已開啟的 Gmail/雲端硬碟/文件分頁
- 存取 mail.google.com、drive.google.com 和 docs.google.com — 它僅在這三個網站執行；無法讀取其他任何頁面

#### 隱私

無帳號、無分析、無伺服器、無網路請求。儲存的唯一資料就是那兩個開關，保存在你瀏覽器本機。隱私權政策: https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

免費且開源: https://github.com/maximtop/hide-gmail-upgrade-button

本擴充功能與 Google 無關聯，也未獲其認可。Gmail、Google Drive、Google Docs 和 Gemini 是 Google LLC 的商標，提及僅為說明相容性。

================================================================================

## Catalan (ca)

Google manté un botó «Upgrade» permanent a la capçalera de Gmail, Google Drive i Google Docs — i al costat un botó «Ask Gemini». Si no penseu actualitzar, és publicitat que mireu tot el dia. Aquesta extensió l'elimina.

Instal·leu-la i tots dos botons desapareixen netament: les icones veïnes s'ajunten, com si els botons no haguessin existit mai.

#### Funcions principals

- Amaga els botons Upgrade i Ask Gemini a Gmail, Google Drive i Google Docs
- Cada botó té el seu propi interruptor a la finestra emergent; tots dos activats per defecte
- Sense parpelleig: l'ocultació s'aplica abans del primer renderitzat i sobreviu als re-renderitzats dinàmics i a la navegació interna de Google
- Funciona immediatament a les pestanyes ja obertes en instal·lar
- Canviar un ajust s'aplica en directe a totes les pestanyes obertes, sense recarregar
- Interfície en 40 idiomes

#### Quan Google canvia alguna cosa

El marcatge de Google està ofuscat i canvia sense avís, així que l'extensió mai no depèn de noms de classe fràgils. Reconeix els botons per senyals estables — etiquetes, rols, posició a la capçalera — i, en cas de dubte, prefereix no fer res abans que amagar l'element equivocat. Si Google canvia molt la interfície, un botó pot reaparèixer un temps: res no es trenca, i una actualització de l'extensió restaurarà l'ocultació. La finestra emergent inclou l'enllaç «Informa d'un problema» per detectar ràpid els botons que tornen.

#### Els permisos, en paraules clares

- Emmagatzematge — guarda els vostres dos ajustos al vostre dispositiu
- Scripts — aplica l'extensió a les pestanyes de Gmail/Drive/Docs ja obertes en instal·lar
- Accés a mail.google.com, drive.google.com i docs.google.com — els únics llocs on funciona; no pot llegir cap altra pàgina

#### Privadesa

Sense comptes, sense analítica, sense servidors, sense peticions de xarxa. Les úniques dades desades són els dos interruptors, localment al vostre navegador. Política de privadesa: https://github.com/maximtop/hide-gmail-upgrade-button/blob/master/PRIVACY.md

Gratuïta i de codi obert: https://github.com/maximtop/hide-gmail-upgrade-button

Aquesta extensió no està afiliada a Google ni compta amb el seu suport. Gmail, Google Drive, Google Docs i Gemini són marques de Google LLC, esmentades només per descriure compatibilitat.
