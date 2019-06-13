const PREVIEW_ATTRIBUTE_NAME = "data-is-preview";

/**
 * Generate font stylesheet ID from fontId
 */
function getStylesheetId(fontId: string): string {
	return `font-${fontId}`;
}

/**
 * Check whether a font stylesheet already exists in the document head
 */
export function stylesheetExists(fontId: string, isPreview?: boolean): boolean {
	const stylesheetNode = document.getElementById(getStylesheetId(fontId));
	const stylesheetNodeExists = stylesheetNode !== null;
	if (isPreview === null || isPreview === undefined) {
		return stylesheetNodeExists;
	}
	return (
		stylesheetNodeExists &&
		stylesheetNode.getAttribute(PREVIEW_ATTRIBUTE_NAME) === isPreview.toString()
	);
}

/**
 * Attach a new font stylesheet to the document head using the provided content
 */
export function createStylesheet(fontId: string, isPreview: boolean): void {
	const stylesheetNode = document.createElement("style");
	stylesheetNode.id = getStylesheetId(fontId);
	stylesheetNode.setAttribute(PREVIEW_ATTRIBUTE_NAME, isPreview.toString());
	document.head.appendChild(stylesheetNode);
}

/**
 * Insert the provided styles in the font's <style> element (existing styles are replaced)
 */
export function fillStylesheet(fontId: string, styles: string): void {
	const stylesheetId = getStylesheetId(fontId);
	const stylesheetNode = document.getElementById(stylesheetId);
	if (stylesheetNode) {
		stylesheetNode.textContent = styles;
	} else {
		console.error(`Could not fill stylesheet: Stylesheet with ID "${stylesheetId}" not found`);
	}
}

/**
 * Update the value of a stylesheet's "data-is-preview" attribute
 */
export function setStylesheetType(fontId: string, isPreview: boolean): void {
	const stylesheetId = getStylesheetId(fontId);
	const stylesheetNode = document.getElementById(stylesheetId);
	if (stylesheetNode) {
		stylesheetNode.setAttribute(PREVIEW_ATTRIBUTE_NAME, isPreview.toString());
	} else {
		console.error(
			`Could not change stylesheet type: Stylesheet with ID "${stylesheetId}" not found`,
		);
	}
}
