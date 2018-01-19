import { checkFullFont, checkPreviewFont, fetchFontList } from './font-download';


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

		this.activeFont = defaultFont;
		this.apiKey = apiKey;
		this.fonts = [];
		this.options = options;
		this.previewIndex = 0; // list index up to which font previews have been downloaded

		// make default font active and download it (if necessary)
		this.activeFont = {
			family: defaultFont,
			variants: 'regular'
		};
		checkFullFont(this.activeFont);

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

		if (this.options) {
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

			// 'sort' parameter (list is already sorted by popularity -> sort the list alphabetically
			// unless popularity is specified as the sorting attribute)
			if (this.options.sort !== 'popularity') {
				fontList = fontList.sort((fontA, fontB) => fontA.family.localeCompare(fontB.family));
			}
		}

		// save modified font list
		this.fonts = fontList;

		// download previews for the first 10 fonts in the list
		this.downloadPreviews(10);
	}

	/**
	 * Set the font with the given font list index as the active one, download (if necessary) and
	 * apply it
	 */
	changeActiveFont(index) {
		const previousFont = this.activeFont.family;

		// change font
		this.activeFont = this.fonts[index];

		// download font (if necessary)
		checkFullFont(this.activeFont);

		// apply font and set fallback fonts
		const style = `.apply-font { font-family: ${this.activeFont.family}, ${previousFont}, ${this.activeFont.category === 'handwriting' ? 'cursive' : this.activeFont.category}; }`;
		this.stylesheet.replaceChild(document.createTextNode(style), this.stylesheet.childNodes[0]);
	}

	/**
	 * Download font previews for the list entries up to the given index
	 */
	downloadPreviews(downloadIndex) {
		// stop at the end of the font list
		let downloadIndexMax;
		if (downloadIndex > this.fonts.length) {
			downloadIndexMax = this.fonts.length;
		}
		else {
			downloadIndexMax = downloadIndex;
		}

		// download the previews up to the given index and apply them to the list entries
		for (let i = this.previewIndex; i < downloadIndexMax; i += 1) {
			checkPreviewFont(this.fonts[i]);
			const style = `.font-${this.fonts[i].family.replace(/\s+/g, '-').toLowerCase()} { font-family: ${this.fonts[i].family}; }`;
			this.stylesheet.appendChild(document.createTextNode(style));
		}

		if (downloadIndexMax > this.previewIndex) {
			this.previewIndex = downloadIndexMax;
		}
	}
}