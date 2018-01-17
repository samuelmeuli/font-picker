import { fetchFontList } from './google-fonts-api';


export async function generateFontList(apiKey, options) {
	let fontList = await fetchFontList(apiKey);

	// 'families' parameter (only keep fonts whose names are included in the provided array)
	if (options.families) {
		fontList = fontList.filter(font => options.families.includes(font.family));
	}

	// 'categories' parameter (only keep fonts in categories from the provided array)
	if (options.categories) {
		fontList = fontList.filter(font => options.categories.includes(font.category));
	}

	// 'minStyles' parameter (only keep fonts with at least the specified number of styles)
	if (options.minStyles) {
		fontList = fontList.filter(font => font.variants.length >= options.minStyles);
	}

	// 'limit' parameter (limit font list size)
	if (options.limit) {
		fontList = fontList.slice(0, options.limit);
	}

	// 'sort' parameter (list is already sorted by popularity -> sort the list alphabetically unless
	// popularity is specified as the sorting attribute)
	if (options.sort !== 'popularity') {
		fontList = fontList.sort((fontA, fontB) => fontA.family.localeCompare(fontB.family));
	}

	return fontList;
}