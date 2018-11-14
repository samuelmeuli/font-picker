import { isFontAvailable } from './isFontAvailable';


/**
 * Transform the font's name to a valid selector (make the name lowercase and replace spaces with
 * dashes)
 */
function getFontSelector(font) {
	return font.family.replace(/\s+/g, '-').toLowerCase();
}


/**
 * Generate the URL to the Google Fonts stylesheet of the specified font
 */
function getDownloadURL(font, variants, onlyCharacters) {
	// Base URL
	let url = 'https://fonts.googleapis.com/css?family=';
	// Font name
	url += font.family.replace(/ /g, '+');
	// Font variants
	url += `:${variants[0]}`;
	for (let i = 1; i < variants.length; i += 1) {
		url += `,${variants[i]}`;
	}
	// Only download characters in the font name if onlyCharacters is true
	if (onlyCharacters === true) {
		// Remove spaces and duplicate letters from the font name
		let downloadChars = font.family;
		downloadChars = downloadChars.replace(/\s+/g, '');
		downloadChars = downloadChars.split('').filter((x, n, s) => s.indexOf(x) === n).join('');
		url += `&text=${downloadChars}`;
	}
	return url;
}


/**
 * Add Google Fonts stylesheet for the specified font family and variants
 */
function downloadFullFont(font, fontSelector, variants, onChange) {
	const url = getDownloadURL(font, variants, false);

	// Add the stylesheet to the document head
	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = url;
	link.id = `font-full-${fontSelector}`;
	if (onChange) {
		// If onChange function is specified: execute it once the stylesheet has loaded
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
function downloadPreviewFont(font, fontSelector, variants) {
	const url = getDownloadURL(font, variants, true);

	// Add the stylesheet to the document head
	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = url;
	link.id = `font-preview-${fontSelector}`;
	document.head.appendChild(link);
}


/**
 * Check whether the full font needs to be downloaded and do so if necessary. Afterwards, execute
 * the onChange function
 */
export function checkFullFont(font, variants, onChange) {
	const fontSelector = getFontSelector(font);

	if (document.getElementById(`font-preview-${fontSelector}`)) {
		// If preview font is available: replace it with the full font
		document.getElementById(`font-preview-${fontSelector}`).outerHTML = ''; // remove tag
		downloadFullFont(font, fontSelector, variants, onChange);
	}	else if (
		!document.getElementById(`font-full-${fontSelector}`) &&
		!isFontAvailable(font.family)
	) {
		// If font is not available: download it
		downloadFullFont(font, fontSelector, variants, onChange);
	}	else if (onChange) {
		// If font is available: execute onChange function if it is specified
		onChange(font);
	}
}


/**
 * Check whether the preview font needs to be downloaded and do so if necessary
 */
export function checkPreviewFont(font, variants) {
	const fontSelector = getFontSelector(font);

	// If full font is not available: download preview font
	if (!document.getElementById(`font-full-${fontSelector}`) && !isFontAvailable(font.family)) {
		downloadPreviewFont(font, fontSelector, variants);
	}
}
