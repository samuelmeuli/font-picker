import { checkFullFont, checkPreviewFont, fetchFontList } from './font-download';


/**
 * Class responsible for retrieving and filtering/sorting the font list, keeping track of the active
 * font, and downloading and applying fonts and font previews
 * @see FontPicker.js (same parameters)
 */
export default class FontHandler {

	/**
	 * Download the default font (if necessary) and apply it
	 */
	constructor(apiKey, defaultFont, options, onChange) {

		this.activeFont = defaultFont;
		this.apiKey = apiKey;
		this.fonts = [];
		this.onChange = onChange;
		this.options = options;
		this.name = options.name;
		this.previewIndex = 0; // list index up to which font previews have been downloaded

		// make default font active and download it (if necessary)
		this.activeFont = {
			family: defaultFont,
			variants: 'regular'
		};
		checkFullFont(this.activeFont, this.options.variants);

		// apply default font
		this.stylesheet = document.createElement('style');
		this.stylesheet.rel = 'stylesheet';
		this.stylesheet.type = 'text/css';
		let style = `
			.apply-font${this.name} {
				font-family: "${this.activeFont.family}";
			}
		`;
		// font weight/style: split number and text in font variant parameter
		const defaultVariant = this.options.variants[0].split(/(\d+)/).filter(Boolean);
		// either font weight or style is specified (e.g. 'regular, '300', 'italic')
		if (defaultVariant.length === 1) {
			if (defaultVariant[0] === 'regular') {
				style += `
					.apply-font${this.name}, #font-picker > ul > li > a {
						font-weight: 400;
						font-style: normal;
					}
				`;
			}
			else if (defaultVariant[0] === 'italic') {
				style += `
					.apply-font${this.name}, #font-picker > ul > li > a {
						font-weight: 400;
						font-style: italic;
					}
				`;
			}
			else {
				style += `
					.apply-font${this.name}, #font-picker > ul > li > a {
						font-weight: ${defaultVariant[0]};
						font-style: normal;
					}
				`;
			}
		}
		// both font weight and style are specified
		else if (defaultVariant.length === 2) {
			style += `
			.apply-font${this.name}, #font-picker > ul > li > a {
				font-weight: ${defaultVariant[0]};
				font-style: ${defaultVariant[1]};
			}
		`;
		}
		this.stylesheet.appendChild(document.createTextNode(style));
		document.head.appendChild(this.stylesheet);
	}

	/**
	 * Download list of available Google Fonts and filter/sort it according as specified in the
	 * 'options' parameter object
	 */
	init() {
		return fetchFontList(this.apiKey)
			.then((fetchedList) => {
				let fontList = fetchedList;

				// 'families' parameter (only keep fonts whose names are included in the provided array)
				if (this.options.families) {
					fontList = fontList.filter(font => this.options.families.includes(font.family));
				}

				// 'categories' parameter (only keep fonts in categories from the provided array)
				if (this.options.categories) {
					fontList = fontList.filter(font => this.options.categories.includes(font.category));
				}

				// 'variants' parameter (only keep fonts with at least the specified variants)
				if (this.options.variants) {
					fontList = fontList.filter((font) => {
						for (let i = 0; i < this.options.variants.length; i += 1) {
							if (font.variants.indexOf(this.options.variants[i]) === -1) {
								return false;
							}
						}
						return true;
					});
				}

				// add default font to beginning of list if it is not already in it
				if (fontList.filter(font => font.family === this.activeFont.family).length === 0) {
					fontList.unshift(this.activeFont);
				}

				// 'limit' parameter (limit font list size)
				if (this.options.limit) {
					fontList = fontList.slice(0, this.options.limit);
				}

				// 'sort' parameter (list is already sorted by popularity)
				if (this.options.sort === 'alphabetical') {
					fontList = fontList.sort((fontA, fontB) => fontA.family.localeCompare(fontB.family));
				}

				// save modified font list
				this.fonts = fontList;

				// download previews for the first 10 fonts in the list
				this.downloadPreviews(10);
			});
	}

	/**
	 * Set the font with the given font list index as the active one, download (if necessary) and
	 * apply it
	 */
	changeActiveFont(index) {
		const previousFont = this.activeFont.family;

		// change font
		this.activeFont = this.fonts[index];

		// apply font and set fallback fonts
		const fallbackFont = this.activeFont.category === 'handwriting' ? 'cursive' : this.activeFont.category;
		const style = `
			.apply-font${this.name} {
				font-family: "${this.activeFont.family}", "${previousFont}", ${fallbackFont};
			}
		`;
		this.stylesheet.replaceChild(document.createTextNode(style), this.stylesheet.childNodes[0]);

		// download font (if necessary)
		checkFullFont(this.activeFont, this.options.variants, this.onChange);
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
			checkPreviewFont(this.fonts[i], this.options.variants);
			const style = `
				.font-${this.fonts[i].family.replace(/\s+/g, '-').toLowerCase()} {
					font-family: "${this.fonts[i].family}";
				}
			`;
			this.stylesheet.appendChild(document.createTextNode(style));
		}

		if (downloadIndexMax > this.previewIndex) {
			this.previewIndex = downloadIndexMax;
		}
	}
}