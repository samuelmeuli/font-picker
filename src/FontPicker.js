import FontHandler from './js/FontHandler';
import './scss/style.scss';


/**
 * Font picker interface
 * @param apiKey (required): Google API key (https://developers.google.com/fonts/docs/developer_api)
 * @param defaultFont (required): font that is selected when the font picker is initialized
 * @param options:
 * 	 @param families: if only specific fonts shall appear in the list, specify their names in an
 *          array (default: all font families)
 * 	 @param categories: array of font categories (default: all categories)
 *          - 'sans-serif'
 *          - 'serif'
 *          - 'init'
 *          - 'handwriting'
 *          - 'monospace'
 *   @param variants: array of variants which the fonts must include and which will be downloaded;
 *   				the first variant of the array will be used in the font picker and the .apply-font
 *   				class; e.g. ['regular', 'italic', '700', '700italic'] (default: ['regular'])
 *   @param limit: maximum number of fonts to be displayed in the list (most popular fonts will be
 * 				  selected, default: 100)
 *   @param sort: sorting attribute for the font list
 *          - 'alphabetical' (default)
 *          - 'popularity'
 */
export default class FontPicker {

	constructor(apiKey, defaultFont, options = {}) {
		// parameter validation
		if (!apiKey || typeof apiKey !== 'string') {
			throw Error('apiKey parameter is not a string or missing');
		}
		if (!defaultFont || typeof defaultFont !== 'string') {
			throw Error('defaultFont parameter is not a string or missing');
		}
		if (typeof options !== 'object') {
			throw Error('options parameter is not an object');
		}
		if (options.families && !(options.families instanceof Array)) {
			throw Error('families parameter is not an array');
		}
		if (options.categories && !(options.categories instanceof Array)) {
			throw Error('categories parameter is not an array');
		}
		if (options.variants && !(options.variants instanceof Array)) {
			throw Error('variants parameter is not an array');
		}
		if (options.limit && typeof options.limit !== 'number') {
			throw Error('limit parameter is not a number');
		}
		if (options.sort && typeof options.sort !== 'string') {
			throw Error('sort parameter is not a string');
		}

		// default parameters
		const optionsWithDefaults = options;
		if (!options.limit) {
			optionsWithDefaults.limit = 100;
		}
		if (!options.variants) {
			optionsWithDefaults.variants = ['regular'];
		}
		if (!options.sort) {
			optionsWithDefaults.sort = 'alphabetical';
		}

		// initialize FontHandler
		this.fontHandler = new FontHandler(apiKey, defaultFont, optionsWithDefaults);

		// function bindings
		this.closeEventListener = this.closeEventListener.bind(this);
	}

	/**
	 * Download list of available fonts and generate the font picker UI
	 */
	async init() {
		this.expanded = false;
		const fontPickerDiv = document.getElementById('font-picker');

		// HTML for dropdown button (name of active font and dropdown arrow)
		this.dropdownButton = document.createElement('a');
		this.dropdownButton.id = 'dropdown-button';
		this.dropdownButton.onclick = () => this.toggleExpanded();

		this.dropdownFont = document.createElement('p');
		this.dropdownFont.innerHTML = this.fontHandler.activeFont.family;

		this.dropdownButton.append(this.dropdownFont);
		fontPickerDiv.appendChild(this.dropdownButton);
		const dropdownIcon = document.createElement('p');

		// HTML for font list
		this.ul = document.createElement('ul');

		// fetch font list, display dropdown arrow if successful
		try {
			await this.fontHandler.init();
			dropdownIcon.innerHTML = '▾';
		}
		catch (err) {
			const errMessage = 'Error trying to fetch the list of available fonts';
			console.error(errMessage);
			console.error(err);
			dropdownIcon.innerHTML = '⚠';
			fontPickerDiv.title = errMessage;
		}
		this.dropdownButton.append(dropdownIcon);

		// HTML for font list entries
		this.ul.onscroll = () => this.onScroll(); // download font previews on scroll
		for (let i = 0; i < this.fontHandler.fonts.length; i += 1) {
			const li = document.createElement('li');
			const a = document.createElement('a');

			// write font name in the corresponding font, set onclick listener
			a.innerHTML = this.fontHandler.fonts[i].family;
			a.classList.add(`font-${this.fontHandler.fonts[i].family.replace(/\s+/g, '-').toLowerCase()}`);
			a.onclick = () => {
				this.toggleExpanded(); // collapse font list
				this.selectFont(i); // make font with index i active
			};
			li.appendChild(a);

			// if active font: highlight it and save reference
			if (this.fontHandler.fonts[i].family === this.fontHandler.activeFont.family) {
				li.classList.add('active-font');
				this.activeFontA = li;
			}

			this.ul.appendChild(li);
		}
		fontPickerDiv.appendChild(this.ul);
	}

	/**
	 * Return the object of the currently selected font
	 */
	getActiveFont() {
		return this.fontHandler.activeFont;
	}

	/**
	 * EventListener for closing the font picker when clicking anywhere outside it
	 */
	closeEventListener(e) {
		let targetElement = e.target; // clicked element

		do {
			if (targetElement === document.getElementById('font-picker')) {
				// click inside font picker
				return;
			}
			// move up the DOM
			targetElement = targetElement.parentNode;
		} while (targetElement);

		// click outside font picker
		this.toggleExpanded();
	}

	/**
	 * Download the font previews for all visible font entries and the five after them
	 */
	onScroll() {
		const elementHeight = this.ul.scrollHeight / this.fontHandler.fonts.length;
		const downloadIndex = Math.ceil((this.ul.scrollTop + this.ul.clientHeight) / elementHeight);
		this.fontHandler.downloadPreviews(downloadIndex + 5);
	}

	/**
	 * Set the font with the given font list index as the active one and highlight it in the list
	 */
	selectFont(index) {
		// change font
		this.fontHandler.changeActiveFont(index);

		// write new font name in dropdown button
		this.dropdownFont.innerHTML = this.fontHandler.activeFont.family;

		// highlight new active font
		this.activeFontA.classList.remove('active-font');
		this.activeFontA = this.ul.getElementsByTagName('li')[index];
		this.activeFontA.classList.add('active-font');
	}

	/**
	 * Expand/collapse the picker's font list
	 */
	toggleExpanded() {
		if (this.expanded) {
			this.expanded = false;
			this.dropdownButton.classList.remove('expanded');
			this.ul.classList.remove('expanded');
			document.removeEventListener('click', this.closeEventListener);
		}
		else {
			this.expanded = true;
			this.dropdownButton.classList.add('expanded');
			this.ul.classList.add('expanded');
			document.addEventListener('click', this.closeEventListener);
		}
	}
}