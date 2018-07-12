/**
 * Class responsible for adding/removing CSS styles for applying the active font and font previews
 */
export default class StyleManager {
	constructor(pickerName, activeFont, variants) {
		if (pickerName !== '') {
			this.pickerSuffix = `-${pickerName}`;
		} else {
			this.pickerSuffix = '';
		}
		this.stylesheetId = `font-selectors${this.pickerSuffix}`;

		this.determineFontVariants(variants);

		// If stylesheet for applying font styles was created earlier, continue using it, otherwise
		// create new one
		const existingStylesheet = document.getElementById(this.stylesheetId);
		if (existingStylesheet) {
			this.stylesheet = existingStylesheet;
		} else {
			this.initStylesheet(activeFont);
		}
	}

	/**
	 * Determine the specified font variants (style and weight) and save them in the corresponding
	 * object variables
	 */
	determineFontVariants(variants) {
		// Font weight/style for previews: split number and text in font variant parameter
		const defaultVariant = variants[0].split(/(\d+)/).filter(Boolean);

		// Determine font variants which will be applied to the fonts in the font picker and to elements
		// of the .apply-font class
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
	}

	/**
	 * Generate the selector for the default font, set up the font picker's stylesheet and add it to
	 * the document head
	 */
	initStylesheet(activeFont) {
		this.stylesheet = document.createElement('style');
		this.stylesheet.id = this.stylesheetId;
		this.stylesheet.rel = 'stylesheet';
		this.stylesheet.type = 'text/css';

		// Apply the default active font
		const style = `
			.apply-font${this.pickerSuffix} {
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
			.font-${fontId}${this.pickerSuffix} {
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
			.apply-font${this.pickerSuffix} {
				font-family: "${activeFont.family}", "${previousFont}", ${fallbackFont};
				font-style: ${this.fontStyle};
				font-weight: ${this.fontWeight};
			}
		`;
		this.stylesheet.replaceChild(document.createTextNode(style), this.stylesheet.childNodes[0]);
	}
}
