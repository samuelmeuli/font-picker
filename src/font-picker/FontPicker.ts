import FontManager from "../font-manager/FontManager";
import "./style/style.scss";

/**
 * Return the fontId based on the provided font family
 */
function getFontId(fontFamily: string): string {
	return fontFamily.replace(/\s+/g, "-").toLowerCase();
}

/**
 * Font picker user interface
 */
export default class FontPicker {
	// Button in the font list which contains and highlights the currently active font
	private activeFontButton: HTMLButtonElement;

	// Font picker button
	private dropdownButton: HTMLButtonElement;

	// <p> element in the dropdownButton containing the name of the currently active font
	private dropdownFamily: HTMLParagraphElement;

	// State of the font picker (expanded or collapsed)
	private expanded: boolean = false;

	// Instance of the FontManager class used for managing, downloading and applying fonts
	private fontManager: FontManager;

	// Font list which is shown below the dropdownButton if expanded === true
	private ul: HTMLUListElement;

	/**
	 * Instantiate a FontManager object and generate the font picker HTML
	 */
	constructor(
		apiKey: string,
		defaultFamily: string = "Open Sans",
		{
			pickerId = "",
			families = [],
			categories = [],
			scripts = ["latin"],
			variants = ["regular"],
			limit = 50,
			sort = "alphabet",
		}: Options,
		onChange: (font: Font) => void = () => {},
	) {
		// Initialize FontManager and FontPicker UI
		const options = {
			pickerId,
			families,
			categories,
			scripts,
			variants,
			limit,
		};
		this.fontManager = new FontManager(apiKey, defaultFamily, options, onChange);
		this.generateUI(sort);

		// Function bindings
		this.closeEventListener = this.closeEventListener.bind(this);
	}

	/**
	 * Download list of available fonts and generate the font picker HTML
	 */
	private generateUI(sort: SortOption): void {
		const { selectorSuffix } = this.fontManager;
		const pickerId = `font-picker${selectorSuffix}`;
		const activeFontFamily = this.fontManager.getActiveFont().family;

		// Locate <div> where font picker should be rendered
		const fontPickerDiv = document.getElementById(pickerId) as HTMLDivElement;
		if (!fontPickerDiv) {
			throw Error(`Missing div with id="${pickerId}"`);
		}

		// Generate HTML for dropdown button (contains family of active font and dropdown icon)
		this.dropdownButton = document.createElement("button");
		this.dropdownButton.classList.add("dropdown-button");
		this.dropdownButton.onclick = () => this.toggleExpanded();
		this.dropdownButton.onkeypress = () => this.toggleExpanded();
		this.dropdownButton.type = "button";
		fontPickerDiv.appendChild(this.dropdownButton);
		// Font family of active font
		this.dropdownFamily = document.createElement("p");
		this.dropdownFamily.textContent = activeFontFamily;
		this.dropdownFamily.classList.add("dropdown-font-name");
		this.dropdownButton.appendChild(this.dropdownFamily);
		// Dropdown icon (possible classes/states: "loading", "finished", "error")
		const dropdownIcon = document.createElement("p");
		dropdownIcon.classList.add("dropdown-icon", "loading");
		this.dropdownButton.appendChild(dropdownIcon);

		// Fetch and render font list
		this.fontManager
			.init()
			.then((fonts: Font[]) => {
				if (sort === "alphabet") {
					fonts.sort((font1, font2) => font1.family.localeCompare(font2.family));
				}
				this.generateFontList(fonts, activeFontFamily, fontPickerDiv, selectorSuffix);
				dropdownIcon.classList.replace("loading", "finished");
			})
			.catch((err: Error) => {
				// On error: Log error message
				dropdownIcon.classList.replace("loading", "error");
				console.error("Error trying to fetch the list of available fonts");
				console.error(err);
			});
	}

	/**
	 * Generate <ul> with all font families below downloadButton
	 */
	private generateFontList(
		fonts: Font[],
		activeFontFamily: string,
		fontPickerDiv: HTMLDivElement,
		selectorSuffix: string,
	): void {
		// Generate HTML for font list below dropdown button
		this.ul = document.createElement("ul");

		// Generate HTML for font list entries
		fonts.forEach(font => {
			const fontId = getFontId(font.family);
			const li = document.createElement("li");
			const fontButton = document.createElement("button");
			fontButton.type = "button";
			fontButton.id = `font-button-${fontId}${selectorSuffix}`;
			fontButton.textContent = font.family;
			// Update active font when font button is clicked
			const onActivate = (): void => {
				this.toggleExpanded();
				this.setActiveFont(font.family);
			};
			fontButton.onclick = onActivate;
			fontButton.onkeypress = onActivate;
			li.appendChild(fontButton);
			// Highlight font if active
			if (font.family === activeFontFamily) {
				fontButton.classList.add("active-font");
				this.activeFontButton = fontButton; // Save reference to button
			}
			this.ul.appendChild(li);
		});
		fontPickerDiv.appendChild(this.ul);
	}

	/**
	 * EventListener for closing the font picker when clicking anywhere outside it
	 */
	private closeEventListener(e: CloseEvent): void {
		let targetElement = e.target as Node; // Clicked element

		do {
			if (
				targetElement === document.getElementById(`font-picker${this.fontManager.selectorSuffix}`)
			) {
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
	 * Expand/collapse the picker's font list
	 */
	private toggleExpanded(): void {
		if (this.expanded) {
			this.expanded = false;
			this.dropdownButton.classList.remove("expanded");
			this.ul.classList.remove("expanded");
			document.removeEventListener("click", this.closeEventListener as EventListener);
		} else {
			this.expanded = true;
			this.dropdownButton.classList.add("expanded");
			this.ul.classList.add("expanded");
			document.addEventListener("click", this.closeEventListener as EventListener);
		}
	}

	/**
	 * @see FontManager
	 */
	public getFonts(): Font[] {
		return this.fontManager.getFonts();
	}

	/**
	 * @see FontManager
	 */
	public addFont(fontFamily: string, downloadPreview: boolean = true): void {
		// TODO add to UI
		this.fontManager.addFont(fontFamily, downloadPreview);
	}

	/**
	 * @see FontManager
	 */
	public removeFont(fontFamily: string): void {
		// TODO remove from UI
		this.fontManager.removeFont(fontFamily);
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
		this.activeFontButton.classList.remove("active-font");
		this.activeFontButton = document.getElementById(
			`font-button-${fontId}${this.fontManager.selectorSuffix}`,
		) as HTMLButtonElement;
		this.activeFontButton.classList.add("active-font");
	}
}

// Attach FontPicker class to window to make it accessible in <script> tags
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).FontPicker = FontPicker;
