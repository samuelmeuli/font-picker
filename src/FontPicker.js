import FontHandler from './js/FontHandler';
import './scss/style.scss';


/**
 * Font picker interface
 * @param {string} apiKey (required) - Google API key (can be generated at
 * 				https://developers.google.com/fonts/docs/developer_api)
 * @param {string} defaultFont - Font that is selected on initialization (default: 'Open Sans')
 * @param {Object} options - Object with additional (optional) parameters:
 *   @param {string} name - If you have multiple font pickers on your site, you need to give them
 *          unique names (which may only consist of letters and digits). These names must also be
 *          appended to the font picker's ID and the .apply-font class name.
 *          Example: if { name: 'main' }, then use #font-picker-main and .apply-font-main
 * 	 @param {string[]} families - If only specific fonts shall appear in the list, specify their
 * 	 				names in an array
 * 	 @param {string[]} categories - Array of font categories
 * 	 				Possible values: 'sans-serif', 'serif', 'display', 'handwriting', 'monospace' (default:
 * 	 				all categories)
 *   @param {string[]} variants - Array of variants which the fonts must include and which will be
 *   				downloaded; the first variant in the array will become the default variant (and will be
 *   				used in the font picker and the .apply-font class)
 *   				Example: ['regular', 'italic', '700', '700italic'] (default: ['regular'])
 *   @param {number} limit - Maximum number of fonts to be displayed in the list (the least popular
 *   				fonts will be omitted; default: 100)
 *   @param {string} sort - Sorting attribute for the font list
 *          Possible values: 'alphabetical' (default), 'popularity'
 * @param {function} onChange - Function which is executed whenever the user changes the active
 * 				font and its stylesheet finishes downloading
 */
export default class FontPicker {

	constructor(apiKey, defaultFont, options = {}, onChange) {
		// parameter validation
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

		// default parameters
		const newDefaultFont = defaultFont || 'Open Sans';
		const newOptions = options;
		if (options.name) {
			this.name = `-${options.name}`;
		}
		else {
			this.name = '';
		}
		newOptions.name = this.name;
		if (!options.limit) {
			newOptions.limit = 100;
		}
		if (!options.variants) {
			newOptions.variants = ['regular'];
		}
		if (!options.sort) {
			newOptions.sort = 'alphabetical';
		}

		// initialize FontHandler
		this.fontHandler = new FontHandler(apiKey, newDefaultFont, newOptions, onChange);

		// function bindings
		this.closeEventListener = this.closeEventListener.bind(this);
	}

	/**
	 * Download list of available fonts and generate the font picker UI
	 */
	init() {
		this.expanded = false;

		const fontPickerDiv = document.getElementById(`font-picker${this.name}`);
		if (!fontPickerDiv) {
			throw Error(`Missing div with id="font-picker${this.name}"`);
		}

		// HTML for dropdown button (name of active font and dropdown arrow)
		this.dropdownButton = document.createElement('a');
		this.dropdownButton.classList.add('dropdown-button');
		this.dropdownButton.role = 'button';
		this.dropdownButton.tabIndex = 0;
		this.dropdownButton.onclick = () => this.toggleExpanded();
		this.dropdownButton.onkeypress = () => this.toggleExpanded();

		this.dropdownFont = document.createElement('p');
		this.dropdownFont.innerHTML = this.fontHandler.activeFont.family;

		this.dropdownButton.append(this.dropdownFont);
		fontPickerDiv.appendChild(this.dropdownButton);
		const dropdownIcon = document.createElement('p');
		dropdownIcon.classList.add('dropdown-icon', 'loading');
		this.dropdownButton.append(dropdownIcon);

		// HTML for font list
		this.ul = document.createElement('ul');

		// fetch font list, display dropdown arrow if successful
		this.fontHandler.init()
			.then(() => {
				dropdownIcon.classList.remove('loading');
				dropdownIcon.classList.add('finished');

				// HTML for font list entries
				this.ul.onscroll = () => this.onScroll(); // download font previews on scroll
				for (let i = 0; i < this.fontHandler.fonts.length; i += 1) {
					const li = document.createElement('li');
					const a = document.createElement('a');

					// write font name in the corresponding font, set onclick listener
					a.innerHTML = this.fontHandler.fonts[i].family;
					a.classList.add(`font-${this.fontHandler.fonts[i].family.replace(/\s+/g, '-').toLowerCase()}`);
					a.role = 'button';
					a.tabIndex = 0;
					a.onclick = () => {
						this.toggleExpanded(); // collapse font list
						this.selectFont(i); // make font with index i active
					};
					a.onkeypress = () => {
						this.toggleExpanded(); // collapse font list
						this.selectFont(i); // make font with index i active
					};
					li.appendChild(a);

					// if active font: highlight it and save reference
					if (this.fontHandler.fonts[i].family === this.fontHandler.activeFont.family) {
						a.classList.add('active-font');
						this.activeFontA = a;
					}

					this.ul.appendChild(li);
				}
				fontPickerDiv.appendChild(this.ul);
			})
			.catch((err) => {
				dropdownIcon.classList.remove('loading');
				dropdownIcon.classList.add('error');
				const errMessage = 'Error trying to fetch the list of available fonts';
				console.error(errMessage);
				console.error(err);
				fontPickerDiv.title = errMessage;
			});
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
			if (targetElement === document.getElementById(`font-picker${this.name}`)) {
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
		this.activeFontA = this.ul.getElementsByTagName('li')[index].firstChild;
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