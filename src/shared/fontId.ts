/**
 * Return the fontId based on the provided font family
 */
export default function getFontId(fontFamily: string): string {
	return fontFamily.replace(/\s+/g, "-").toLowerCase();
}
