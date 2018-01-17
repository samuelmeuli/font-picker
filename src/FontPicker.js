import { generateFontList } from './font-list';

// stylesheet
import './styles.scss';


/**
 * @param apiKey (required): Google API key (https://developers.google.com/fonts/docs/developer_api)
 * @param defaultFont (required): font that is selected when the font picker is initialized
 * @param families: if only specific fonts shall appear in the list, specify their names in an
 *        array (default: all font families)
 * @param categories: array of font categories (default: all categories)
 *        - 'sans-serif'
 *        - 'serif'
 *        - 'display'
 *        - 'handwriting'
 *        - 'monospace'
 * @param minStyles: minimum number of available styles for the fonts in the list (default: 0)
 * @param limit: maximum number of fonts to be displayed in the list (most popular fonts will be
 * 				selected, default: no limit)
 * @param sort: sorting attribute for the font list
 *        - 'alphabetical' (default)
 *        - 'popularity'
 */
export default class FontPicker {

	constructor(apiKey, defaultFont, options) {
		// TODO parameter validation

		this.apiKey = apiKey;
		this.activeFont = defaultFont;
		this.options = options;
		this.expanded = false;
	}

	async init() {
		this.fontList = await generateFontList(this.apiKey, this.options);
		// TODO add default font to list if necessary
	}

	async display() {
		const fontPicker = document.getElementById('font-picker');

		// HTML for dropdown button (name of active font and dropdown arrow)
		this.dropdownButton = document.createElement('a');
		this.dropdownButton.id = 'dropdown-button';
		this.dropdownButton.href = '#';
		this.dropdownButton.onclick = () => this.toggleExpanded();

		this.dropdownFont = document.createElement('p');
		this.dropdownFont.innerHTML = this.activeFont;

		const dropdownArrow = document.createElement('p');
		dropdownArrow.innerHTML = '▾';

		this.dropdownButton.append(this.dropdownFont);
		this.dropdownButton.append(dropdownArrow);
		fontPicker.appendChild(this.dropdownButton);

		// fetch and filter/sort list of fonts
		await this.init();

		// HTML for font list
		this.ul = document.createElement('ul');
		for (let i = 0; i < this.fontList.length; i += 1) {
			const li = document.createElement('li');
			const a = document.createElement('a');
			a.innerHTML = this.fontList[i].family;
			a.href = '#';
			a.onclick = () => this.selectFont(i);
			li.appendChild(a);

			// if active font: highlight it and save reference
			if (this.fontList[i].family === this.activeFont) {
				li.classList.add('active-font');
				this.activeFontA = li;
			}

			this.ul.appendChild(li);
		}
		fontPicker.appendChild(this.ul);
	}

	selectFont(index) {
		this.toggleExpanded(); // collapse font list

		// highlight new active font
		this.activeFontA.classList.remove('active-font');
		this.activeFontA = this.ul.getElementsByTagName('li')[index];
		this.activeFontA.classList.add('active-font');

		// set as active font and display its name in dropdown button
		this.activeFont = this.fontList[index].family;
		this.dropdownFont.innerHTML = this.activeFont;

		// TODO download and apply font
	}

	toggleExpanded() {
		if (this.expanded) {
			this.expanded = false;
			this.ul.classList.remove('expanded');
		}
		else {
			this.expanded = true;
			this.ul.classList.add('expanded');
		}
	}
}