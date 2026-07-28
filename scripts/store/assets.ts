/**
 * @file Generates store assets (screenshots, promo tiles) from SVG master
 * layouts. Reproducible: run `pnpm store:assets` after design changes.
 * Sizes follow current Chrome Web Store requirements: screenshots 1280x800,
 * small promo tile 440x280, marquee 1400x560; Edge/AMO accept the same
 * screenshot size. All content is mock data — no personal information.
 */

import fs from 'node:fs';
import path from 'node:path';

import sharp from 'sharp';

const ROOT_DIR = path.resolve(import.meta.dirname, '../..');

const OUTPUT_DIR = path.join(ROOT_DIR, 'assets/store');

const TEAL = '#0F766E';

const TEAL_DARK = '#0A5D57';

const INK = '#1B2430';

const MUTED = '#5B6470';

const CARD_BORDER = '#E2E5EA';

const BG = '#F2F6F5';

const FONT = 'Helvetica, Arial, sans-serif';

/**
 * Locales the screenshots are generated for; captions below plus popup
 * strings from src/_locales keep the assets localizable.
 */
const LOCALES = ['en', 'ru'] as const;

/**
 * Screenshot locale.
 */
type Locale = (typeof LOCALES)[number];

/**
 * Headline/subline pairs per screenshot, per locale.
 */
const CAPTIONS: Record<Locale, { headlines: string[]; sublines: string[] }> = {
    en: {
        headlines: [
            'Remove Upgrade from the header',
            'Two toggles — the whole UI',
            'Works across three apps',
            'Private by default',
        ],
        sublines: [
            'The Upgrade and Ask Gemini buttons disappear from Gmail, Drive and Docs',
            'Each button switches off separately; changes apply instantly',
            'Gmail · Google Drive · Google Docs',
            'No analytics, no network requests; only two toggles are stored',
        ],
    },
    ru: {
        headlines: [
            'Уберите Upgrade из шапки',
            'Два переключателя — весь интерфейс',
            'Работает в трёх приложениях',
            'Приватность по умолчанию',
        ],
        sublines: [
            'Кнопки Upgrade и Ask Gemini исчезают из Gmail, Диска и Документов',
            'Каждая кнопка отключается отдельно; настройки применяются мгновенно',
            'Gmail · Google Диск · Google Документы',
            'Без аналитики и сетевых запросов; хранится только два переключателя',
        ],
    },
};

/**
 * Escapes text for embedding into SVG.
 *
 * @param text Raw text.
 *
 * @returns XML-escaped text.
 */
const esc = (text: string): string => {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
};

/**
 * Reads a popup string from the locale catalog, so screenshot popups always
 * match the shipped UI texts.
 *
 * @param locale Locale code.
 * @param key Message key.
 *
 * @returns Localized message.
 */
const msg = (locale: Locale, key: string): string => {
    const file = path.join(ROOT_DIR, 'src/_locales', locale, 'messages.json');
    const messages = JSON.parse(fs.readFileSync(file, 'utf-8'));
    return messages[key].message;
};

/**
 * The extension icon artwork as an SVG group.
 *
 * @param x Left position.
 * @param y Top position.
 * @param size Rendered size in px.
 *
 * @returns SVG fragment.
 */
const iconArt = (x: number, y: number, size: number): string => {
    const s = size / 128;
    return `<g transform="translate(${x} ${y}) scale(${s})">
        <rect width="128" height="128" rx="28" fill="${TEAL}"/>
        <rect x="26" y="52" width="76" height="24" rx="12" fill="#FFFFFF"/>
        <line x1="34" y1="98" x2="94" y2="30" stroke="${TEAL}" stroke-width="16" stroke-linecap="round"/>
        <line x1="34" y1="98" x2="94" y2="30" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round"/>
    </g>`;
};

/**
 * A mock app-header strip (generic, no Google branding).
 *
 * @param x Left position.
 * @param y Top position.
 * @param width Rendered width.
 * @param withButtons Whether the Upgrade pill and sparkle are present.
 *
 * @returns SVG fragment.
 */
const headerStrip = (x: number, y: number, width: number, withButtons: boolean): string => {
    const s = width / 1480;
    const rightIcons = withButtons
        ? `<g transform="translate(936 62)"><circle r="26" fill="none" stroke="#5f6368" stroke-width="6.5"/>
             <path d="M-9 -8 a9 9 0 1 1 12 12 q-3 2.4 -3 7" fill="none" stroke="#5f6368" stroke-width="6.5"
                 stroke-linecap="round"/><circle cy="17" r="4" fill="#5f6368"/></g>
           <path transform="translate(1102 62)" d="M0 -30 Q4 -8 26 0 Q4 8 0 30 Q-4 8 -26 0 Q-4 -8 0 -30 Z"
               fill="#8a8f98"/>
           <rect x="1148" y="30" width="150" height="64" rx="32" fill="#dbeafe"/>
           <text x="1223" y="73" text-anchor="middle" font-family="${FONT}" font-size="30" font-weight="600"
               fill="#1a56c9">Upgrade</text>`
        : `<g transform="translate(1208 62)"><circle r="26" fill="none" stroke="#5f6368" stroke-width="6.5"/>
             <path d="M-9 -8 a9 9 0 1 1 12 12 q-3 2.4 -3 7" fill="none" stroke="#5f6368" stroke-width="6.5"
                 stroke-linecap="round"/><circle cy="17" r="4" fill="#5f6368"/></g>`;
    return `<g transform="translate(${x} ${y}) scale(${s})">
        <rect width="1480" height="124" rx="22" fill="#ffffff" stroke="${CARD_BORDER}" stroke-width="2"/>
        <g stroke="#5f6368" stroke-width="7" stroke-linecap="round">
            <line x1="52" y1="47" x2="96" y2="47"/><line x1="52" y1="62" x2="96" y2="62"/>
            <line x1="52" y1="77" x2="96" y2="77"/>
        </g>
        <rect x="128" y="34" width="56" height="56" rx="14" fill="#e8eaed"/>
        <rect x="216" y="27" width="520" height="70" rx="35" fill="#eef1f5"/>
        <circle cx="258" cy="62" r="14" fill="none" stroke="#5f6368" stroke-width="7"/>
        <line x1="268" y1="73" x2="282" y2="87" stroke="#5f6368" stroke-width="7" stroke-linecap="round"/>
        ${rightIcons}
        <g fill="#5f6368" transform="translate(1352 62)">
            <circle cx="-18" cy="-18" r="5"/><circle cx="0" cy="-18" r="5"/><circle cx="18" cy="-18" r="5"/>
            <circle cx="-18" r="5"/><circle r="5"/><circle cx="18" r="5"/>
            <circle cx="-18" cy="18" r="5"/><circle cy="18" r="5"/><circle cx="18" cy="18" r="5"/>
        </g>
        <g transform="translate(1424 62)">
            <circle r="30" fill="#c2cbd6"/><circle cy="-8" r="11" fill="#ffffff"/>
            <path d="M-18 16 a18 12 0 0 1 36 0 Z" fill="#ffffff"/>
        </g>
    </g>`;
};

/**
 * Splits a sentence into two lines at the space nearest to its middle.
 *
 * @param text Sentence to wrap.
 *
 * @returns Two lines (the second may be empty for short texts).
 */
const wrapTwoLines = (text: string): [string, string] => {
    const middle = Math.floor(text.length / 2);
    let split = -1;
    for (let i = 0; i < text.length; i += 1) {
        if (text[i] === ' ' && (split === -1 || Math.abs(i - middle) < Math.abs(split - middle))) {
            split = i;
        }
    }
    if (split === -1) {
        return [text, ''];
    }
    return [text.slice(0, split), text.slice(split + 1)];
};

/**
 * A mock of the extension popup, using the shipped locale strings.
 *
 * @param x Left position.
 * @param y Top position.
 * @param scale Scale factor (popup base width is 300).
 * @param locale Locale for the texts.
 *
 * @returns SVG fragment.
 */
const popupMock = (x: number, y: number, scale: number, locale: Locale): string => {
    const toggle = (ty: number, label: string): string => `
        <text x="22" y="${ty + 27}" font-family="${FONT}" font-size="14" fill="${INK}">${esc(label)}</text>
        <rect x="240" y="${ty + 12}" width="38" height="22" rx="11" fill="${TEAL}"/>
        <circle cx="${240 + 27}" cy="${ty + 23}" r="8" fill="#ffffff"/>`;
    return `<g transform="translate(${x} ${y}) scale(${scale})">
        <rect width="300" height="248" rx="14" fill="#ffffff" stroke="${CARD_BORDER}" stroke-width="1.5"/>
        ${iconArt(16, 14, 24)}
        <text x="50" y="31" font-family="${FONT}" font-size="15" font-weight="700" fill="${INK}">
            ${esc(msg(locale, 'popup_title'))}</text>
        <line x1="16" y1="48" x2="284" y2="48" stroke="${CARD_BORDER}" stroke-width="1.5"/>
        ${toggle(52, msg(locale, 'popup_toggle_label'))}
        ${toggle(96, msg(locale, 'popup_toggle_gemini_label'))}
        <line x1="16" y1="150" x2="284" y2="150" stroke="${CARD_BORDER}" stroke-width="1.5"/>
        <text x="22" y="170" font-family="${FONT}" font-size="10.5" fill="${MUTED}">
            Gmail · Google Drive · Google Docs</text>
        <text x="22" y="192" font-family="${FONT}" font-size="10" fill="${MUTED}">
            ${esc(wrapTwoLines(msg(locale, 'popup_markup_note'))[0])}</text>
        <text x="22" y="207" font-family="${FONT}" font-size="10" fill="${MUTED}">
            ${esc(wrapTwoLines(msg(locale, 'popup_markup_note'))[1])}</text>
        <text x="22" y="228" font-family="${FONT}" font-size="10.5" fill="${TEAL}">
            ${esc(msg(locale, 'popup_report_link'))}</text>
    </g>`;
};

/**
 * Shared screenshot scaffold: background, headline, subline.
 *
 * @param locale Locale for captions.
 * @param index Screenshot index (0-based).
 * @param body SVG fragment with the screenshot's content.
 *
 * @returns Complete SVG document 1280x800.
 */
const screenshotSvg = (locale: Locale, index: number, body: string): string => {
    const { headlines, sublines } = CAPTIONS[locale];
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 800" width="1280" height="800">
        <rect width="1280" height="800" fill="${BG}"/>
        <rect width="1280" height="8" fill="${TEAL}"/>
        ${iconArt(80, 72, 56)}
        <text x="160" y="112" font-family="${FONT}" font-size="46" font-weight="700" fill="${INK}">
            ${esc(headlines[index] ?? '')}</text>
        <text x="160" y="152" font-family="${FONT}" font-size="24" fill="${MUTED}">${esc(sublines[index] ?? '')}</text>
        ${body}
    </svg>`;
};

/**
 * Builds the four screenshot SVGs for a locale.
 *
 * @param locale Locale for captions and popup strings.
 *
 * @returns SVG documents in order.
 */
const buildScreenshots = (locale: Locale): string[] => {
    const beforeLabel = locale === 'ru' ? 'ДО' : 'BEFORE';
    const afterLabel = locale === 'ru' ? 'ПОСЛЕ' : 'AFTER';
    const s1 = `
        <text x="120" y="272" font-family="${FONT}" font-size="22" font-weight="700" letter-spacing="3"
            fill="#9aa1ab">${beforeLabel}</text>
        ${headerStrip(120, 290, 1040, true)}
        <rect x="864" y="298" width="182" height="72" rx="20" fill="none" stroke="#dc2626" stroke-width="3.5"
            stroke-dasharray="10 8"/>
        <text x="120" y="512" font-family="${FONT}" font-size="22" font-weight="700" letter-spacing="3"
            fill="${TEAL}">${afterLabel}</text>
        ${headerStrip(120, 530, 1040, false)}`;
    const s2 = popupMock(430, 240, 1.6, locale);
    const appCard = (cx: number, label: string, glyph: string): string => `
        <g transform="translate(${cx} 300)">
            <rect width="300" height="300" rx="24" fill="#ffffff" stroke="${CARD_BORDER}" stroke-width="2"/>
            ${glyph}
            <text x="150" y="258" text-anchor="middle" font-family="${FONT}" font-size="24" font-weight="600"
                fill="${INK}">${esc(label)}</text>
            ${iconArt(252, 20, 30)}
        </g>`;
    const envelope = `<g transform="translate(90 80)"><rect width="120" height="84" rx="12" fill="#eef1f5"
        stroke="#5f6368" stroke-width="6"/><path d="M8 14 L60 52 L112 14" fill="none" stroke="#5f6368"
        stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></g>`;
    const folder = `<g transform="translate(90 82)"><path d="M0 14 a10 10 0 0 1 10 -10 h34 l14 16 h52 a10 10 0 0 1
        10 10 v54 a10 10 0 0 1 -10 10 h-100 a10 10 0 0 1 -10 -10 Z" fill="#eef1f5" stroke="#5f6368"
        stroke-width="6" stroke-linejoin="round"/></g>`;
    const doc = `<g transform="translate(104 72)"><rect width="92" height="104" rx="10" fill="#eef1f5"
        stroke="#5f6368" stroke-width="6"/><g stroke="#5f6368" stroke-width="6" stroke-linecap="round">
        <line x1="22" y1="34" x2="70" y2="34"/><line x1="22" y1="54" x2="70" y2="54"/>
        <line x1="22" y1="74" x2="52" y2="74"/></g></g>`;
    const appNames = locale === 'ru'
        ? ['Gmail', 'Google Диск', 'Google Документы']
        : ['Gmail', 'Google Drive', 'Google Docs'];
    const s3 = [
        appCard(112, appNames[0] ?? '', envelope),
        appCard(490, appNames[1] ?? '', folder),
        appCard(868, appNames[2] ?? '', doc),
    ].join('');
    const bullets = locale === 'ru'
        ? ['Без аналитики и телеметрии', 'Ноль сетевых запросов', 'Открытый код, лицензия MIT']
        : ['No analytics or telemetry', 'Zero network requests', 'Open source, MIT licensed'];
    const bulletRow = (by: number, text: string): string => `
        <g transform="translate(240 ${by})">
            <rect width="800" height="104" rx="20" fill="#ffffff" stroke="${CARD_BORDER}" stroke-width="2"/>
            <circle cx="56" cy="52" r="22" fill="${TEAL}"/>
            <path d="M46 52 L53 60 L68 42" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round"
                stroke-linejoin="round"/>
            <text x="104" y="62" font-family="${FONT}" font-size="28" font-weight="600" fill="${INK}">
                ${esc(text)}</text>
        </g>`;
    const s4 = [
        bulletRow(252, bullets[0] ?? ''),
        bulletRow(392, bullets[1] ?? ''),
        bulletRow(532, bullets[2] ?? ''),
    ].join('');
    return [s1, s2, s3, s4].map((body, index) => screenshotSvg(locale, index, body));
};

/**
 * Builds the 440x280 small promo tile SVG.
 *
 * @returns SVG document.
 */
const buildSmallTile = (): string => {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 280" width="440" height="280">
        <rect width="440" height="280" fill="${TEAL}"/>
        <rect width="440" height="280" fill="url(#g)"/>
        <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="${TEAL}"/><stop offset="1" stop-color="${TEAL_DARK}"/>
        </linearGradient></defs>
        <g transform="translate(40 78)">
            <rect width="124" height="124" rx="27" fill="#ffffff" opacity="0.14"/>
            ${iconArt(6, 6, 112)}
        </g>
        <text x="196" y="122" font-family="${FONT}" font-size="34" font-weight="700" fill="#ffffff">Hide Upgrade</text>
        <text x="196" y="162" font-family="${FONT}" font-size="34" font-weight="700" fill="#ffffff">Button</text>
        <text x="196" y="198" font-family="${FONT}" font-size="19" fill="#CDEBE7">Gmail · Drive · Docs</text>
    </svg>`;
};

/**
 * Builds the 1400x560 marquee promo tile SVG.
 *
 * @returns SVG document.
 */
const buildMarquee = (): string => {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1400 560" width="1400" height="560">
        <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="${TEAL}"/><stop offset="1" stop-color="${TEAL_DARK}"/>
        </linearGradient></defs>
        <rect width="1400" height="560" fill="url(#g)"/>
        ${iconArt(96, 200, 160)}
        <text x="300" y="252" font-family="${FONT}" font-size="58" font-weight="700"
            fill="#ffffff">Hide Upgrade Button</text>
        <text x="300" y="312" font-family="${FONT}" font-size="30" fill="#CDEBE7">for Gmail, Drive &amp; Docs —
            no upsell in your header</text>
        <g transform="translate(300 368)">
            <rect width="760" height="64" rx="14" fill="#ffffff" opacity="0.96"/>
            <g stroke="#5f6368" stroke-width="4" stroke-linecap="round">
                <line x1="26" y1="24" x2="50" y2="24"/><line x1="26" y1="32" x2="50" y2="32"/>
                <line x1="26" y1="40" x2="50" y2="40"/>
            </g>
            <rect x="66" y="16" width="240" height="32" rx="16" fill="#eef1f5"/>
            <g transform="translate(648 32)"><circle r="12" fill="none" stroke="#5f6368" stroke-width="3.5"/>
                <path d="M-4 -4 a4.5 4.5 0 1 1 6 6 q-1.6 1.2 -1.6 3.4" fill="none" stroke="#5f6368"
                    stroke-width="3.5" stroke-linecap="round"/></g>
            <g fill="#5f6368" transform="translate(692 32)">
                <circle cx="-8" cy="-8" r="2.4"/><circle cy="-8" r="2.4"/><circle cx="8" cy="-8" r="2.4"/>
                <circle cx="-8" r="2.4"/><circle r="2.4"/><circle cx="8" r="2.4"/>
                <circle cx="-8" cy="8" r="2.4"/><circle cy="8" r="2.4"/><circle cx="8" cy="8" r="2.4"/>
            </g>
            <g transform="translate(726 32)"><circle r="14" fill="#c2cbd6"/><circle cy="-4" r="5" fill="#ffffff"/>
                <path d="M-8 8 a8 5.5 0 0 1 16 0 Z" fill="#ffffff"/></g>
        </g>
    </svg>`;
};

/**
 * Renders one SVG document to a PNG file.
 *
 * @param svg SVG document.
 * @param output Absolute output path.
 * @param width Output width in px.
 */
const render = async (svg: string, output: string, width: number): Promise<void> => {
    fs.mkdirSync(path.dirname(output), { recursive: true });
    await sharp(Buffer.from(svg), { density: 144 }).resize(width).png().toFile(output);
    console.log(`rendered ${path.relative(ROOT_DIR, output)}`);
};

/**
 * Generates the full asset set.
 */
const main = async (): Promise<void> => {
    for (const locale of LOCALES) {
        const screenshots = buildScreenshots(locale);
        for (const [index, svg] of screenshots.entries()) {
            const output = path.join(OUTPUT_DIR, 'screenshots', locale, `screenshot-${index + 1}.png`);
            await render(svg, output, 1280);
        }
    }
    await render(buildSmallTile(), path.join(OUTPUT_DIR, 'small-promo-tile.png'), 440);
    await render(buildMarquee(), path.join(OUTPUT_DIR, 'marquee-promo-tile.png'), 1400);
};

main().catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
});
