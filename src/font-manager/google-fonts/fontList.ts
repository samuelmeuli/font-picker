import getFontId from "../../shared/fontId";
import { Font, Script } from "../../shared/types";
import get from "../utils/request";

const LIST_BASE_URL = "https://www.googleapis.com/webfonts/v1";

/**
 * Font object returned by the Google API. Contains a field "subsets" which will be renamed to
 * "scripts"
 */
interface FontResponse extends Font {
	subsets: Script[];
}

/**
 * Fetch the list of all available fonts from the Google Fonts API
 */
export default async function getFontList(apiKey: string): Promise<Font[]> {
	// Request list of all Google Fonts, sorted by popularity
	const url = `${LIST_BASE_URL}/webfonts?sort=popularity&key=${apiKey}`;
	const response = await get(url);

	// Parse font list
	const json = JSON.parse(response);

	// For each font:
	// - Rename "subset" key to "script"
	// - Generate fontId
	// Return the updated list
	const fontsOriginal = json.items;
	return fontsOriginal.map((fontOriginal: FontResponse) => {
		const { family, subsets, ...others } = fontOriginal;
		return {
			...others,
			family,
			id: getFontId(family),
			scripts: subsets,
		};
	});
}
