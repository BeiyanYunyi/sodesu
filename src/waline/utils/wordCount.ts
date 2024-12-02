/**
 * The wordCount module should be lightweight as it's packed into client.
 *
 * So We just make a simple implement here
 *
 * Forked from https://github.com/vuepress-theme-hope/vuepress-theme-hope/blob/main/packages/reading-time2/src/node/readingTime.ts
 */

/**
 * Extract Latin words from content
 */
export function getWords(content: string): RegExpMatchArray | null {
  return content.match(/[\w\s,.\u00C0-\u024F\u0400-\u04FF]+/giu);
}

/**
 * Extract Chinese Characters from content
 */
export function getChinese(content: string): RegExpMatchArray | null {
  return content.match(/[\u4E00-\u9FD5]/gu);
}

/**
 * Get word number of given string
 */
export function getWordNumber(content: string): number {
  return (getWords(content)?.reduce<number>(
    (accumulator, word) =>
      accumulator
      + (['', ',', '.'].includes(word.trim())
        ? 0
        : word.trim().split(/\s+/u).length),
    0,
  ) || 0) + (getChinese(content)?.length || 0);
}
