import extractFontStyles from "./google-fonts/extractFontStyles";
import getStylesheet from "./google-fonts/fontStylesheet";
import { createStylesheet, deleteStylesheet, stylesheetExists } from "./styles/stylesheets";

/**
 * Get the Google Fonts stylesheet for the specified fonts (in the specified scripts and variants),
 * split up the returned CSS rules into stylesheets per font and add these to the document head.
 * If previewsOnly is set to true, only download the font parts for writing all characters contained
 * in the fonts' names.
 */
export default async function loadFonts(
	fonts: Font[],
	scripts: Script[],
	variants: Variant[],
	previewsOnly: boolean,
): Promise<void> {
	let fontsToFetch: Font[];
	if (previewsOnly) {
		// Only load previews of fonts which don't have a stylesheet (for preview or full font) yet
		fontsToFetch = fonts.filter(
			font => !stylesheetExists(font.id, false) && !stylesheetExists(font.id, true),
		);
	} else {
		// Only load fonts which don't have a stylesheet (for full font) yet
		fontsToFetch = fonts.filter(font => !stylesheetExists(font.id, false));
	}

	// Get Google Fonts stylesheet containing all requested styles
	const response = await getStylesheet(fonts, scripts, variants, previewsOnly);
	// Parse response and assign styles to the corresponding font
	const fontStyles = extractFontStyles(response);

	// Create separate stylesheets for the fonts
	fontsToFetch.forEach(font => {
		// Make sure response contains styles for the font
		if (!(font.id in fontStyles)) {
			console.error(
				`Missing styles for font "${font.family}" (fontId "${font.id}") in Google Fonts response`,
			);
			return;
		}
		if (!previewsOnly) {
			// Delete preview stylesheet if exists
			if (stylesheetExists(font.id, true)) {
				deleteStylesheet(font.id);
			}
		}
		// Create stylesheet with the font's corresponding styles from the response
		createStylesheet(font.id, fontStyles[font.id], previewsOnly);
	});
}
