import { checkFullFont, checkPreviewFont } from './fontDownload';
import { fetchList, filterList } from './fontList';
import StyleManager from './StyleManager';


/**
 * Class for managing the list of fonts for the font picker, keeping track of the active font, and
 * downloading/activating Google Fonts
 * @param {string} apiKey (required) - Google API key
 * @param {string} defaultFont - Font that is selected on initialization (default: 'Open Sans')
 * @param {Object} options - Object with additional (optional) parameters:
 *   @param {string} name - If you have multiple font pickers on your site, you need to give them
 *   unique names (which may only consist of letters and digits). These names must also be appended
 *   to the font picker's ID and the .apply-font class name.
 *   Example: If { name: 'main' }, use #font-picker-main and .apply-font-main
 *   @param {string[]} families - If only specific fonts shall appear in the list, specify their
 *   names in an array
 *   @param {string[]} categories - Array of font categories
 *   Possible values: 'sans-serif', 'serif', 'display', 'handwriting', 'monospace' (default: all
 *   categories)
 *   @param {string[]} variants - Array of variants which the fonts must include and which will be
 *   downloaded; the first variant in the array will become the default variant (and will be used
 *   in the font picker and the .apply-font class)
 *   Example: ['regular', 'italic', '700', '700italic'] (default: ['regular'])
 *   @param {number} limit - Maximum number of fonts to be displayed in the list (the least popular
 *   fonts will be omitted; default: 100)
 *   @param {string} sort - Sorting attribute for the font list
 *   Possible values: 'alphabetical' (default), 'popularity'
 * @param {function} onChange - Function which is executed whenever the user changes the active font
 * and its stylesheet finishes downloading
 */
export default class FontManager {
	/**
	 * Validate parameters passed to the class constructor
	 */
	static validateParameters(apiKey, defaultFont, options, onChange) {
		// Parameter validation
		if (!apiKey || typeof apiKey !== 'string') {
			throw Error('apiKey parameter is not a string or missing');
		}
		if (defaultFont && typeof defaultFont !== 'string') {
			throw Error('defaultFont parameter is not a string');
		}
		if (typeof options !== 'object') {
			throw Error('options parameter is not an object');
		}
		if (options.name) {
			if (typeof options.name !== 'string') {
				throw Error('options.name parameter is not a string');
			}
			if (options.name.match(/[^0-9a-z]/i)) {
				throw Error('options.name may only contain letters and digits');
			}
		}
		if (options.families && !(options.families instanceof Array)) {
			throw Error('options.families parameter is not an array');
		}
		if (options.categories && !(options.categories instanceof Array)) {
			throw Error('options.categories parameter is not an array');
		}
		if (options.variants && !(options.variants instanceof Array)) {
			throw Error('options.variants parameter is not an array');
		}
		if (options.limit && typeof options.limit !== 'number') {
			throw Error('options.limit parameter is not a number');
		}
		if (options.sort && typeof options.sort !== 'string') {
			throw Error('options.sort parameter is not a string');
		}
		if (onChange && typeof onChange !== 'function') {
			throw Error('onChange is not a function');
		}
	}

	/**
	 * Set default values for options that have not been specified
	 */
	static setDefaultOptions(options) {
		const newOptions = options;
		if (!options.name) {
			newOptions.name = '';
		}
		if (!options.limit) {
			newOptions.limit = 100;
		}
		if (!options.variants) {
			newOptions.variants = ['regular'];
		}
		if (!options.sort) {
			newOptions.sort = 'alphabetical';
		}
		return newOptions;
	}

	/**
	 * Download the default font (if necessary) and apply it
	 */
	constructor(apiKey, defaultFont, options = {}, onChange) {
		// Check parameters and apply defaults if necessary
		FontManager.validateParameters(apiKey, defaultFont, options, onChange);
		const newDefaultFont = defaultFont || 'Open Sans';
		const newOptions = FontManager.setDefaultOptions(options);

		// Save parameters as class variables
		this.apiKey = apiKey;
		this.onChange = onChange;
		this.options = newOptions;

		// Set activeFont and initialize font list
		this.activeFont = {
			family: newDefaultFont,
			variants: 'regular'
		};
		this.fonts = [];
		this.previewIndex = 0; // list index up to which font previews have been downloaded

		// Font weight/style for previews: split number and text in font variant parameter
		const defaultVariant = this.options.variants[0].split(/(\d+)/).filter(Boolean);

		// Download and apply default font
		checkFullFont(this.activeFont, this.options.variants);
		this.styleManager = new StyleManager(this.options.name, this.activeFont, defaultVariant);
	}

	/**
	 * Download list of available Google Fonts and filter/sort it according to the specified
	 * parameters in the 'options' object
	 */
	init() {
		return fetchList(this.apiKey)
			.then((fontList) => {
				this.fonts = filterList(fontList, this.activeFont, this.options);
				this.downloadPreviews(10);
			});
	}

	/**
	 * Download font previews for the list entries up to the given index
	 */
	downloadPreviews(downloadIndex) {
		// Stop at the end of the font list
		let downloadIndexMax;
		if (downloadIndex > this.fonts.length) {
			downloadIndexMax = this.fonts.length;
		} else {
			downloadIndexMax = downloadIndex;
		}

		// Download the previews up to the given index and apply them to the list entries
		for (let i = this.previewIndex; i < downloadIndexMax; i += 1) {
			this.styleManager.applyPreviewStyle(this.fonts[i]);
			checkPreviewFont(this.fonts[i], this.options.variants);
		}

		if (downloadIndexMax > this.previewIndex) {
			this.previewIndex = downloadIndexMax;
		}
	}

	/**
	 * Set the specified font as the active one, download it (if necessary) and apply it. On success,
	 * return the index of the font in the font list. On error, return -1.
	 */
	setActiveFont(fontFamily) {
		const listIndex = this.fonts.findIndex(f => f.family === fontFamily);
		if (listIndex === -1) {
			// Font is not part of font list: Keep current activeFont and log error
			console.error(`Cannot update activeFont: The font "${fontFamily}" is not in the font list`);
			return -1;
		}
		// Font is part of font list: Update activeFont and set previous one as fallback
		const previousFont = this.activeFont.family;
		this.activeFont = this.fonts[listIndex];
		this.styleManager.changeActiveStyle(this.activeFont, previousFont);
		checkFullFont(this.activeFont, this.options.variants, this.onChange);
		return listIndex;
	}
}
