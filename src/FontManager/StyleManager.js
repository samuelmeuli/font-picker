/**
 * Class responsible for adding/removing CSS styles for applying the active font and font previews
 */
export default class StyleManager {
	constructor(pickerName, activeFont, defaultVariant) {
		if (pickerName !== '') {
			this.pickerSelector = `-${pickerName}`;
		} else {
			this.pickerSelector = '';
		}

		this.stylesheet = document.createElement('style');
		this.stylesheet.rel = 'stylesheet';
		this.stylesheet.type = 'text/css';

		// Apply the default active font
		let style = `
			.apply-font${this.pickerSelector} {
				font-family: "${activeFont.family}";
			}
		`;

		// Apply the default font variant to the fonts in the font picker and the .apply-font class
		if (defaultVariant.length === 1) {
			// Either font weight or style is specified (e.g. 'regular, '300', 'italic')
			if (defaultVariant[0] === 'regular') {
				style += `
					.apply-font${this.pickerSelector}, #font-picker > ul > li > a {
						font-weight: 400;
						font-style: normal;
					}
				`;
			}	else if (defaultVariant[0] === 'italic') {
				style += `
					.apply-font${this.pickerSelector}, #font-picker > ul > li > a {
						font-weight: 400;
						font-style: italic;
					}
				`;
			}	else {
				style += `
					.apply-font${this.pickerSelector}, #font-picker > ul > li > a {
						font-weight: ${defaultVariant[0]};
						font-style: normal;
					}
				`;
			}
		}	else if (defaultVariant.length === 2) {
			// Both font weight and style are specified
			style += `
			.apply-font${this.pickerSelector}, #font-picker > ul > li > a {
				font-weight: ${defaultVariant[0]};
				font-style: ${defaultVariant[1]};
			}
		`;
		}

		this.stylesheet.appendChild(document.createTextNode(style));
		document.head.appendChild(this.stylesheet);
	}

	/**
	 * Add CSS selector for applying a preview font
	 */
	applyPreviewStyle(font) {
		const fontId = font.family.replace(/\s+/g, '-').toLowerCase();
		const style = `
			.font-${fontId} {
				font-family: "${font.family}";
			}
		`;
		this.stylesheet.appendChild(document.createTextNode(style));
	}

	/**
	 * Update the CSS selector for applying the active font to the .apply-font class
	 */
	changeActiveStyle(activeFont, previousFont) {
		// Apply font and set fallback fonts
		const fallbackFont = activeFont.category === 'handwriting' ? 'cursive' : activeFont.category;
		const style = `
			.apply-font${this.pickerSelector} {
				font-family: "${activeFont.family}", "${previousFont}", ${fallbackFont};
			}
		`;
		this.stylesheet.replaceChild(document.createTextNode(style), this.stylesheet.childNodes[0]);
	}
}
