import isFontAvailable from './is-font-available';


/**
 * Fetch list of all fonts available on Google Fonts, sorted by popularity
 */
export async function fetchFontList(apiKey) {
	const response = await window.fetch(`https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=${apiKey}`);
	const json = await response.json();
	return json.items;
}


/**
 * Add Google Fonts stylesheet for the specified font family and variants
 */
function downloadFullFont(font, fontId, variants, onChange) {
	// generate the stylesheet URL
	let url = 'https://fonts.googleapis.com/css?family=';
	// font name
	url += font.family.replace(/ /g, '+');
	// font variants
	url += `:${variants[0]}`;
	for (let i = 1; i < variants.length; i += 1) {
		url += `|${variants[i]}`;
	}

	// add the stylesheet to the document head
	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = url;
	link.id = `font-full-${fontId}`;
	// if onChange function is specified: execute it once the stylesheet has loaded
	if (onChange) {
		link.onload = () => {
			onChange(font);
		};
	}
	document.head.appendChild(link);
}


/**
 * Add limited Google Fonts stylesheet for the specified font family (only containing the characters
 * which are needed to write the font family name)
 */
function downloadPreviewFont(font, fontId, variants) {
	// generate the stylesheet URL
	let url = 'https://fonts.googleapis.com/css?family=';
	// font name
	url += font.family.replace(/ /g, '+');
	// font variants
	url += `:${variants[0]}`;
	for (let i = 1; i < variants.length; i += 1) {
		url += `|${variants[i]}`;
	}
	// characters to download: remove spaces and duplicate letters from the font name
	let downloadChars = font.family;
	downloadChars = downloadChars.replace(/\s+/g, '');
	downloadChars = downloadChars.split('').filter((x, n, s) => s.indexOf(x) === n).join('');
	url += `&text=${downloadChars}`;

	// add the stylesheet to the document head
	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = url;
	link.id = `font-preview-${fontId}`;
	document.head.appendChild(link);
}


/**
 * Check whether the full font needs to be downloaded and do so if necessary
 */
export function checkFullFont(font, variants, onChange) {
	const fontId = font.family.replace(/\s+/g, '-').toLowerCase();

	// if preview font is available: replace it with the full font
	if (document.getElementById(`font-preview-${fontId}`)) {
		document.getElementById(`font-preview-${fontId}`).outerHTML = '';
		downloadFullFont(font, fontId, variants, onChange);
	}
	// if font is not available: download it
	else if (!document.getElementById(`font-full-${fontId}`) && !isFontAvailable(font.family)) {
		downloadFullFont(font, fontId, variants, onChange);
	}
	// if is available
	else if (onChange) {
		// execute onChange function if it is specified
		onChange(font);
	}
}


/**
 * Check whether the preview font needs to be downloaded and do so if necessary
 */
export function checkPreviewFont(font, variants) {
	const fontId = font.family.replace(/\s+/g, '-').toLowerCase();

	// if full font is not available: download preview font
	if (!document.getElementById(`font-full-${fontId}`) && !isFontAvailable(font.family)) {
		downloadPreviewFont(font, fontId, variants);
	}
}