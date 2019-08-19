import {
	Font,
	FontList,
	FontManager,
	FONT_FAMILY_DEFAULT,
	getFontId,
	Options,
	OPTIONS_DEFAULTS,
	SortOption,
} from "@samuelmeuli/font-manager";

/**
 * Font picker user interface
 */
export default class FontPicker {
	// Button in the font list which contains and highlights the currently active font
	private activeFontButton: HTMLButtonElement;

	// <p> element in the dropdownButton containing the name of the currently active font
	private dropdownFamily: HTMLParagraphElement;

	// State of the font picker (expanded or collapsed)
	private expanded: boolean = false;

	// Instance of the FontManager class used for managing, downloading and applying fonts
	private fontManager: FontManager;

	// <div> element in which the font picker is rendered
	private fontPickerDiv: HTMLDivElement;

	// Font list which is shown below the dropdownButton if expanded === true
	private ul: HTMLUListElement;

	/**
	 * Instantiate a FontManager object and generate the font picker HTML
	 */
	constructor(
		apiKey: string,
		defaultFamily: string = FONT_FAMILY_DEFAULT,
		{
			pickerId = OPTIONS_DEFAULTS.pickerId,
			families = OPTIONS_DEFAULTS.families,
			categories = OPTIONS_DEFAULTS.categories,
			scripts = OPTIONS_DEFAULTS.scripts,
			variants = OPTIONS_DEFAULTS.variants,
			limit = OPTIONS_DEFAULTS.limit,
			sort = OPTIONS_DEFAULTS.sort,
		}: Options,
		onChange: (font: Font) => void = (): void => {},
	) {
		// Function bindings
		this.closeEventListener = this.closeEventListener.bind(this);
		this.toggleExpanded = this.toggleExpanded.bind(this);

		// Initialize FontManager and FontPicker UI
		const options = {
			pickerId,
			families,
			categories,
			scripts,
			variants,
			limit,
			sort,
		};
		this.fontManager = new FontManager(apiKey, defaultFamily, options, onChange);
		this.generateUI(sort);
	}

	/**
	 * Download list of available fonts and generate the font picker HTML
	 */
	private generateUI(sort: SortOption): void {
		const { selectorSuffix } = this.fontManager;
		const pickerId = `font-picker${selectorSuffix}`;

		// Locate <div> where font picker should be rendered
		this.fontPickerDiv = document.getElementById(pickerId) as HTMLDivElement;
		if (!this.fontPickerDiv) {
			throw Error(`Missing div with id="${pickerId}"`);
		}

		// Generate HTML for dropdown button (contains family of active font and dropdown icon)
		const dropdownButton = document.createElement("button");
		dropdownButton.classList.add("dropdown-button");
		dropdownButton.onclick = this.toggleExpanded;
		dropdownButton.onkeypress = this.toggleExpanded;
		dropdownButton.type = "button";
		this.fontPickerDiv.appendChild(dropdownButton);
		// Font family of active font
		this.dropdownFamily = document.createElement("p");
		this.dropdownFamily.textContent = this.fontManager.getActiveFont().family;
		this.dropdownFamily.classList.add("dropdown-font-family");
		dropdownButton.appendChild(this.dropdownFamily);
		// Dropdown icon (possible classes/states: "loading", "finished", "error")
		const dropdownIcon = document.createElement("p");
		dropdownIcon.classList.add("dropdown-icon", "loading");
		dropdownButton.appendChild(dropdownIcon);

		// Fetch and render font list
		this.fontManager
			.init()
			.then((fontMap: FontList): void => {
				const fonts = Array.from(fontMap.values());
				if (sort === "alphabet") {
					fonts.sort((font1: Font, font2: Font): number =>
						font1.family.localeCompare(font2.family),
					);
				}
				this.generateFontList(fonts);
				dropdownIcon.classList.replace("loading", "finished");
			})
			.catch((err: Error): void => {
				// On error: Log error message
				dropdownIcon.classList.replace("loading", "error");
				console.error("Error trying to fetch the list of available fonts");
				console.error(err);
			});
	}

	/**
	 * Generate <ul> with all font families below downloadButton
	 */
	private generateFontList(fonts: Font[]): void {
		// Generate HTML for font list below dropdown button
		this.ul = document.createElement("ul");
		this.ul.classList.add("font-list");

		// Generate HTML for font list entries
		fonts.forEach((font): void => {
			this.addFontLi(font);
		});
		this.fontPickerDiv.appendChild(this.ul);

		// Highlight active font and save reference to the corresponding HTML element
		const activeFontFamily = this.fontManager.getActiveFont().family;
		const activeFontId = getFontId(activeFontFamily);
		const fontButtonId = `font-button-${activeFontId}${this.fontManager.selectorSuffix}`;
		this.activeFontButton = document.getElementById(fontButtonId) as HTMLButtonElement;
		if (this.activeFontButton) {
			this.activeFontButton.classList.add("active-font");
		} else {
			console.error(`Could not find font button with ID (${fontButtonId})`);
		}
	}

	/**
	 * Generate list entry in font picker UI for the provided font. Highlight it if it's the active
	 * font
	 */
	private addFontLi(font: Font, listIndex?: number): void {
		const fontId = getFontId(font.family);
		const li = document.createElement("li");
		li.classList.add("font-list-item");
		const fontButton = document.createElement("button");
		fontButton.type = "button";
		fontButton.id = `font-button-${fontId}${this.fontManager.selectorSuffix}`;
		fontButton.classList.add("font-button");
		fontButton.textContent = font.family;

		// Update active font when font button is clicked
		const onActivate = (): void => {
			this.toggleExpanded();
			this.setActiveFont(font.family);
		};
		fontButton.onclick = onActivate;
		fontButton.onkeypress = onActivate;
		li.appendChild(fontButton);

		// Insert font button at the specified index. If not specified, append to the end of the list
		if (listIndex) {
			this.ul.insertBefore(li, this.ul.children[listIndex]);
		} else {
			this.ul.appendChild(li);
		}
	}

	/**
	 * EventListener for closing the font picker when clicking anywhere outside it
	 */
	private closeEventListener(e: MouseEvent): void {
		let targetEl = e.target as Node; // Clicked element
		const fontPickerEl = document.getElementById(`font-picker${this.fontManager.selectorSuffix}`);

		// eslint-disable-next-line no-constant-condition
		while (true) {
			if (targetEl === fontPickerEl) {
				// Click inside font picker: Exit
				return;
			}
			if (targetEl.parentNode) {
				// Click outside font picker: Move up the DOM
				targetEl = targetEl.parentNode;
			} else {
				// DOM root is reached: Toggle picker, exit
				this.toggleExpanded();
				return;
			}
		}
	}

	/**
	 * Expand/collapse the picker's font list
	 */
	private toggleExpanded(): void {
		if (this.expanded) {
			this.expanded = false;
			this.fontPickerDiv.classList.remove("expanded");
			document.removeEventListener("click", this.closeEventListener as EventListener);
		} else {
			this.expanded = true;
			this.fontPickerDiv.classList.add("expanded");
			document.addEventListener("click", this.closeEventListener as EventListener);
		}
	}

	/**
	 * @see FontManager
	 */
	public getFonts(): FontList {
		return this.fontManager.getFonts();
	}

	/**
	 * Add font to font picker and font map
	 */
	public addFont(fontFamily: string, index?: number): void {
		if (Array.from(this.fontManager.getFonts().keys()).includes(fontFamily)) {
			throw Error(
				`Did not add font to font picker: Font family "${fontFamily}" is already in the list`,
			);
		}

		// Add font to font map in FontManager
		this.fontManager.addFont(fontFamily, true);

		// Add font to list in font picker
		const font = this.fontManager.getFonts().get(fontFamily);
		if (font) {
			this.addFontLi(font, index);
		} else {
			console.error(`Font "${fontFamily}" is missing in font list`);
		}
	}

	/**
	 * Remove font from font picker and font map
	 */
	public removeFont(fontFamily: string): void {
		// Remove font from font map in FontManager
		this.fontManager.removeFont(fontFamily);

		// Remove font from list in font picker
		const fontId = getFontId(fontFamily);
		const fontButton = document.getElementById(
			`font-button-${fontId}${this.fontManager.selectorSuffix}`,
		);
		if (fontButton) {
			const fontLi = fontButton.parentElement;
			fontButton.remove();
			if (fontLi) {
				fontLi.remove();
			}
		} else {
			throw Error(
				`Could not remove font from font picker: Font family "${fontFamily}" is not in the list`,
			);
		}
	}

	/**
	 * @see FontManager
	 */
	public getActiveFont(): Font {
		return this.fontManager.getActiveFont();
	}

	/**
	 * Set the specified font as the active font, download it and highlight it in the font list
	 */
	public setActiveFont(fontFamily: string): void {
		this.fontManager.setActiveFont(fontFamily);
		const fontId = getFontId(fontFamily);

		// Write new font family in dropdown button and highlight font entry in the list
		this.dropdownFamily.textContent = fontFamily;
		if (this.activeFontButton) {
			this.activeFontButton.classList.remove("active-font");
			this.activeFontButton = document.getElementById(
				`font-button-${fontId}${this.fontManager.selectorSuffix}`,
			) as HTMLButtonElement;
			this.activeFontButton.classList.add("active-font");
		} else {
			console.error("`activeFontButton` is undefined");
		}
	}

	/**
	 * Update the onChange function (executed when changing the active font)
	 */
	public setOnChange(onChange: (font: Font) => void): void {
		this.fontManager.setOnChange(onChange);
	}
}
