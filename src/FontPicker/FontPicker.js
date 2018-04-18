import FontManager from '../FontManager/FontManager';
import './style/style.scss';


/**
 * User interface for the font picker
 * @see FontManager parameters
 */
export default class FontPicker {
	constructor(apiKey, defaultFont, options, onChange) {
		// Function bindings
		this.closeEventListener = this.closeEventListener.bind(this);

		// Set font picker name
		if (options.name) {
			this.pickerSelector = `font-picker-${options.name}`;
		} else {
			this.pickerSelector = 'font-picker';
		}

		// Initialize FontManager and FontPicker UI
		this.fontManager = new FontManager(apiKey, defaultFont, options, onChange);
		this.generateUI();
	}

	/**
	 * Download list of available fonts and generate the font picker UI
	 */
	generateUI() {
		this.expanded = false;

		const fontPickerDiv = document.getElementById(this.pickerSelector);
		if (!fontPickerDiv) {
			throw Error(`Missing div with id="${this.pickerSelector}"`);
		}

		// HTML for dropdown button (name of active font and dropdown arrow)
		this.dropdownButton = document.createElement('button');
		this.dropdownButton.classList.add('dropdown-button');
		this.dropdownButton.onclick = () => this.toggleExpanded();
		this.dropdownButton.onkeypress = () => this.toggleExpanded();
		fontPickerDiv.appendChild(this.dropdownButton);
		// Name of selected font
		this.dropdownFont = document.createElement('p');
		this.dropdownFont.innerHTML = this.fontManager.activeFont.family;
		this.dropdownFont.classList.add('dropdown-font-name');
		this.dropdownButton.append(this.dropdownFont);
		// Dropdown icon (possible classes/states: 'loading', 'finished', 'error')
		const dropdownIcon = document.createElement('p');
		dropdownIcon.classList.add('dropdown-icon', 'loading');
		this.dropdownButton.append(dropdownIcon);

		// HTML for font list
		this.ul = document.createElement('ul');

		// Fetch font list, display dropdown arrow if successful
		this.fontManager.init()
			.then(() => {
				dropdownIcon.classList.remove('loading');
				dropdownIcon.classList.add('finished');

				// HTML for font list entries
				this.ul.onscroll = () => this.onScroll(); // download font previews on scroll
				for (let i = 0; i < this.fontManager.fonts.length; i += 1) {
					const li = document.createElement('li');
					const a = document.createElement('button');

					// Write font name in the corresponding font, set onclick listener
					a.innerHTML = this.fontManager.fonts[i].family;
					a.classList.add(`font-${this.fontManager.fonts[i].family.replace(/\s+/g, '-').toLowerCase()}`);
					a.onclick = () => {
						this.toggleExpanded(); // collapse font list
						this.setActiveFont(this.fontManager.fonts[i].family);
					};
					a.onkeypress = () => {
						this.toggleExpanded(); // collapse font list
						this.setActiveFont(this.fontManager.fonts[i].family);
					};
					li.appendChild(a);

					// If active font: highlight it and save reference
					if (this.fontManager.fonts[i].family === this.fontManager.activeFont.family) {
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
	 * EventListener for closing the font picker when clicking anywhere outside it
	 */
	closeEventListener(e) {
		let targetElement = e.target; // clicked element

		do {
			if (targetElement === document.getElementById(this.pickerSelector)) {
				// Click inside font picker
				return;
			}
			// Move up the DOM
			targetElement = targetElement.parentNode;
		} while (targetElement);

		// Click outside font picker
		this.toggleExpanded();
	}

	/**
	 * Return the object of the currently selected font
	 */
	getActiveFont() {
		return this.fontManager.activeFont;
	}

	/**
	 * Download the font previews for all visible font entries and the five after them
	 */
	onScroll() {
		const elementHeight = this.ul.scrollHeight / this.fontManager.fonts.length;
		const downloadIndex = Math.ceil((this.ul.scrollTop + this.ul.clientHeight) / elementHeight);
		this.fontManager.downloadPreviews(downloadIndex + 5);
	}

	/**
	 * Set the font with the given font list index as the active one and highlight it in the list
	 */
	setActiveFont(fontFamily) {
		const listIndex = this.fontManager.setActiveFont(fontFamily);
		if (listIndex >= 0) {
			// On success: Write new font name in dropdown button and highlight it in the font list
			this.dropdownFont.innerHTML = fontFamily;
			this.activeFontA.classList.remove('active-font');
			this.activeFontA = this.ul.getElementsByTagName('li')[listIndex].firstChild;
			this.activeFontA.classList.add('active-font');
		}
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
		}	else {
			this.expanded = true;
			this.dropdownButton.classList.add('expanded');
			this.ul.classList.add('expanded');
			document.addEventListener('click', this.closeEventListener);
		}
	}
}
