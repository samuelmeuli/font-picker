import { Font, FontList, Script, Variant } from "../shared/types";
import extractFontStyles from "./google-fonts/extractFontStyles";
import getStylesheet from "./google-fonts/fontStylesheet";
import { applyActiveFont, applyFontPreview } from "./styles/declarations";
import { createStylesheet, deleteStylesheet, stylesheetExists } from "./styles/stylesheets";

/**
 * Get the Google Fonts stylesheet for the specified font (in the specified scripts and variants,
 * only the characters needed for creating the font previews), add the necessary CSS declarations to
 * apply them and add the fonts' stylesheets to the document head
 */
export async function loadFontPreviews(
	fonts: FontList,
	scripts: Script[],
	variants: Variant[],
	selectorSuffix: string,
): Promise<void> {
	// Only load previews of fonts which don't have a stylesheet (for preview or full font) yet
	const fontsArray: Font[] = Array.from(fonts.values());
	const fontsToFetch = fontsArray
		.map((font: Font) => font.id)
		.filter(fontId => !stylesheetExists(fontId, false) && !stylesheetExists(fontId, true));

	// Get Google Fonts stylesheet containing all requested styles
	const response = await getStylesheet(fontsArray, scripts, variants, true);
	// Parse response and assign styles to the corresponding font
	const fontStyles = extractFontStyles(response);

	// Create separate stylesheets for the fonts
	fontsArray.forEach(font => {
		applyFontPreview(font, selectorSuffix);

		// Add stylesheets for fonts which need to be downloaded
		if (fontsToFetch.includes(font.id)) {
			// Make sure response contains styles for the font
			if (!(font.id in fontStyles)) {
				console.error(
					`Missing styles for font "${font.family}" (fontId "${font.id}") in Google Fonts response`,
				);
				return;
			}
			createStylesheet(font.id, fontStyles[font.id], true);
		}
	});
}

/**
 * Get the Google Fonts stylesheet for the specified font (in the specified scripts and variants),
 * add the necessary CSS declarations to apply it and add the font's stylesheet to the document head
 */
export async function loadActiveFont(
	font: Font,
	previousFontFamily: string,
	scripts: Script[],
	variants: Variant[],
	selectorSuffix: string,
): Promise<void> {
	// Only load font if it doesn't have a stylesheet yet
	if (stylesheetExists(font.id, false)) {
		// Add CSS declaration to apply the new active font
		applyActiveFont(font, previousFontFamily, selectorSuffix);
	} else {
		// Get Google Fonts stylesheet containing all requested styles
		const fontStyle = await getStylesheet([font], scripts, variants, false);

		// Delete preview stylesheet if exists
		if (stylesheetExists(font.id, true)) {
			deleteStylesheet(font.id);
		}

		// Add CSS declaration to apply the new active font
		applyActiveFont(font, previousFontFamily, selectorSuffix);

		// Create stylesheet with the font's corresponding styles from the response
		createStylesheet(font.id, fontStyle, false);
	}
}
