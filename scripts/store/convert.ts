/**
 * @file Conversion of the store description markdown into the plain text
 * store description fields accept (they render no markdown), and extraction
 * of per-language sections from the single source-of-truth document.
 */

/**
 * Converts markdown to store-ready plain text: headings become plain lines,
 * emphasis markers are stripped, list markers become bullet characters.
 *
 * @param markdown Markdown source.
 *
 * @returns Plain text with preserved line structure.
 */
export const convertMarkdownToPlainText = (markdown: string): string => {
    return markdown
        .replace(/^#{1,6}\s+(.+)$/gm, '$1')
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\*(.+?)\*/g, '$1')
        .replace(/`(.+?)`/g, '$1')
        .replace(/^[-*]\s+/gm, '• ')
        .replace(/^\d+\.\s+/gm, '• ')
        .replace(/^-{3,}$/gm, '')
        .replace(/^={3,}$/gm, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim();
};

/**
 * Splits the source document into language sections. A section starts with
 * a `## <Language> (<code>)` heading and runs until the next one.
 *
 * @param content Full markdown document.
 *
 * @returns Map of locale code to the section's markdown body.
 */
export const extractLanguageSections = (content: string): Record<string, string> => {
    const sections: Record<string, string> = {};
    const headingPattern = /^## .+ \(([a-zA-Z0-9_]{2,6})\)$/gm;

    const matches = Array.from(content.matchAll(headingPattern));
    matches.forEach((match, index) => {
        const code = match[1];
        const start = (match.index ?? 0) + match[0].length;
        const end = index + 1 < matches.length ? matches[index + 1]?.index : content.length;
        if (code) {
            sections[code] = content.slice(start, end).trim();
        }
    });

    return sections;
};
