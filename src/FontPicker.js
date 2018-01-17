import { generateFontList } from './font-list';


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
		this.currentFont = defaultFont;
		this.options = options;
	}

	display(divId) {
		// TODO always add default font to list
		generateFontList(this.apiKey, this.options)
			.then((fontList) => {
				const fontPicker = document.getElementById(divId);
				const ul = document.createElement('ul');
				for (let i = 0; i < fontList.length; i += 1) {
					const li = document.createElement('li');
					li.appendChild(document.createTextNode(fontList[i].family));
					ul.appendChild(li);
				}
				fontPicker.appendChild(ul);
			})
			.catch((err) => {
				console.error(err);
				// TODO display error in font picker
			});
	}
}