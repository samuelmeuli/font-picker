import { downloadFont, fetchFontList } from './google-fonts-api';
import isFontAvailable from './is-font-available';


/**
 * Class responsible for retrieving and filtering/sorting the font list, keeping track of and
 * downloading/applying the active font
 * @see FontPicker.js (same parameters)
 */
export default class FontHandler {

	/**
	 * Download the default font (if necessary) and apply it
	 */
	constructor(apiKey, defaultFont, options) {

		// TODO parameter validation

		this.activeFont = defaultFont;
		this.apiKey = apiKey;
		this.fonts = [];
		this.options = options;

		// make default font active and download it unless it is already available
		if (!isFontAvailable(defaultFont)) {
			this.activeFont = {
				kind: 'webfonts#webfont',
				family: defaultFont
			};
			downloadFont(this.activeFont);
		}
		else {
			this.activeFont = {
				kind: 'local',
				family: defaultFont
			};
		}

		// apply default font
		this.stylesheet = document.createElement('style');
		this.stylesheet.rel = 'stylesheet';
		this.stylesheet.type = 'text/css';
		const style = `.apply-font { font-family: ${this.activeFont.family}; }`;
		this.stylesheet.appendChild(document.createTextNode(style));
		document.head.appendChild(this.stylesheet);
	}

	/**
	 * Download list of available Google Fonts and filter/sort it according as specified in the
	 * 'options' parameter object
	 */
	async init() {
		let fontList = await fetchFontList(this.apiKey);

		// add default font to beginning of list if it is not already in it
		if (fontList.filter(font => font.family === this.activeFont.family).length === 0) {
			fontList.unshift(this.activeFont);
		}

		// 'families' parameter (only keep fonts whose names are included in the provided array)
		if (this.options.families) {
			fontList = fontList.filter(font => this.options.families.includes(font.family));
		}

		// 'categories' parameter (only keep fonts in categories from the provided array)
		if (this.options.categories) {
			fontList = fontList.filter(font => this.options.categories.includes(font.category));
		}

		// 'minStyles' parameter (only keep fonts with at least the specified number of styles)
		if (this.options.minStyles) {
			fontList = fontList.filter(font => font.variants.length >= this.options.minStyles);
		}

		// 'limit' parameter (limit font list size)
		if (this.options.limit) {
			fontList = fontList.slice(0, this.options.limit);
		}

		// 'sort' parameter (list is already sorted by popularity -> sort the list alphabetically unless
		// popularity is specified as the sorting attribute)
		if (this.options.sort !== 'popularity') {
			fontList = fontList.sort((fontA, fontB) => fontA.family.localeCompare(fontB.family));
		}

		this.fonts = fontList;
	}

	/**
	 * Set the font with the given font list index as the active one, download (if necessary) and
	 * apply it
	 */
	changeActiveFont(index) {
		const previousFont = this.activeFont.family;

		// change font
		this.activeFont = this.fonts[index];

		// download font if it is not already available
		if (!isFontAvailable(this.activeFont.family)) {
			downloadFont(this.activeFont);
		}

		// apply font and set fallback fonts
		this.stylesheet.firstChild.remove();
		const style = `.apply-font { font-family: ${this.activeFont.family}, ${previousFont}, ${this.activeFont.category === 'handwriting' ? 'cursive' : this.activeFont.category}; }`;
		this.stylesheet.appendChild(document.createTextNode(style));
	}
}