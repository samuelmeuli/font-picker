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
 *   @param minStyles: minimum number of available styles for the fonts in the list (default: 0)
 *   @param limit: maximum number of fonts to be displayed in the list (most popular fonts will be
 * 				  selected, default: no limit)
 *   @param sort: sorting attribute for the font list
 *          - 'alphabetical' (default)
 *          - 'popularity'
 */
export default class FontPicker {

	constructor(apiKey, defaultFont, options) {
		this.fontHandler = new FontHandler(apiKey, defaultFont, options);
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

		const dropdownArrow = document.createElement('p');
		dropdownArrow.innerHTML = '▾';

		this.dropdownButton.append(this.dropdownFont);
		this.dropdownButton.append(dropdownArrow);
		fontPickerDiv.appendChild(this.dropdownButton);

		// fetch and filter/sort list of fonts
		await this.fontHandler.init();

		// HTML for font list
		this.ul = document.createElement('ul');
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
		}
		else {
			this.expanded = true;
			this.dropdownButton.classList.add('expanded');
			this.ul.classList.add('expanded');
		}
	}

	/**
	 * Download the font previews for all visible font entries and the five after them
	 */
	onScroll() {
		const elementHeight = this.ul.scrollHeight / this.fontHandler.fonts.length;
		const downloadIndex = Math.ceil((this.ul.scrollTop + this.ul.clientHeight) / elementHeight);
		this.fontHandler.downloadPreviews(downloadIndex + 5);
	}
}