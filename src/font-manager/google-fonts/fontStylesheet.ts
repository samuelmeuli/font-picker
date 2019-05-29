import { Font, Script, Variant } from "../../shared/types";
import get from "../utils/request";

const FONT_BASE_URL = "https://fonts.googleapis.com/css";

/**
 * Return URL to the Google Fonts stylesheet for the specified font families and variants.
 * If previewsOnly is set to true, only the characters contained in the font family names are
 * included
 */
export default async function getStylesheet(
	fonts: Font[],
	scripts: Script[],
	variants: Variant[],
	previewsOnly: boolean,
): Promise<string> {
	// Build query URL for specified font families and variants
	const variantsEnc = variants.join(",");
	const familiesEnc = fonts.map(
		(font): string => `${encodeURIComponent(font.family)}:${variantsEnc}`,
	);
	let query = `?family=${familiesEnc.join("|")}`;

	// Query the fonts in the specified scripts
	query += `&subset=${scripts.join(",")}`;

	// If previewsOnly: Only query the characters contained in the font names
	if (previewsOnly) {
		// Concatenate the family names of all fonts
		const familyNamesConcat = fonts.map((font): string => font.family).join("");
		// Create a string with all characters (listed once) contained in the font family names
		const downloadChars = familyNamesConcat
			.split("")
			.filter((char, pos, self): boolean => self.indexOf(char) === pos)
			.join("");
		// Query only the identified characters
		query += `&text=${downloadChars}`;
	}

	// Fetch and return stylesheet
	const url = `${FONT_BASE_URL}${query}`;
	return get(url);
}
