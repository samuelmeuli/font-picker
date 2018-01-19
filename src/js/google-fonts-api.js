/**
 * Add Google Fonts stylesheet for the specified font family and variants
 */
export function downloadFont(font) {
	let url = 'https://fonts.googleapis.com/css?family=';
	url += font.family.replace(/ /g, '+');
	if (font.variants.includes('regular')) {
		url += ':regular';
	}
	else {
		url += `:${font.variants[0]}`;
	}

	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = url;
	document.head.appendChild(link);
}


/**
 * Fetch list of all fonts available on Google Fonts, sorted by popularity
 */
export async function fetchFontList(apiKey) {
	const response = await window.fetch(`https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=${apiKey}`);
	const json = await response.json();
	return json.items;
}