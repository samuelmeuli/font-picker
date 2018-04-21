/**
 * Class responsible for adding/removing CSS styles for applying the active font and font previews
 */
export default class StyleManager {
	constructor(pickerName, activeFont, variants) {
		if (pickerName !== '') {
			this.pickerSelector = `-${pickerName}`;
		} else {
			this.pickerSelector = '';
		}

		this.stylesheet = document.createElement('style');
		this.stylesheet.rel = 'stylesheet';
		this.stylesheet.type = 'text/css';

		// Font weight/style for previews: split number and text in font variant parameter
		const defaultVariant = variants[0].split(/(\d+)/).filter(Boolean);

		// Apply the default font variant to the fonts in the font picker and the .apply-font class
		if (defaultVariant.length === 1) {
			// Either font weight or style is specified (e.g. 'regular, '300', 'italic')
			if (defaultVariant[0] === 'regular' || defaultVariant[0] === 'italic') {
				// Font style is specified
				[this.fontStyle] = defaultVariant;
				this.fontWeight = '400';
			}	else {
				// Font weight is specified
				this.fontStyle = 'regular';
				[this.fontWeight] = defaultVariant;
			}
		}	else if (defaultVariant.length === 2) {
			// Both font weight and style are specified
			[this.fontWeight, this.fontStyle] = defaultVariant;
		}

		// Apply the default active font
		const style = `
			.apply-font${this.pickerSelector} {
				font-family: "${activeFont.family}";
				font-style: ${this.fontStyle};
				font-weight: ${this.fontWeight};
			}
		`;
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
				font-style: ${this.fontStyle};
				font-weight: ${this.fontWeight};
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
				font-style: ${this.fontStyle};
				font-weight: ${this.fontWeight};
			}
		`;
		this.stylesheet.replaceChild(document.createTextNode(style), this.stylesheet.childNodes[0]);
	}
}
