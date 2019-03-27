const PREVIEW_ATTRIBUTE_NAME = "data-is-preview";

/**
 * Generate font stylesheet ID from fontId
 */
function getStylesheetId(fontId: string): string {
	return `font-${fontId}`;
}

/**
 * Check whether a font stylesheet (preview or full) already exists in the document head
 */
export function stylesheetExists(fontId: string, isPreview: boolean): boolean {
	const stylesheetNode = document.getElementById(getStylesheetId(fontId));
	return (
		stylesheetNode && stylesheetNode.getAttribute(PREVIEW_ATTRIBUTE_NAME) === isPreview.toString()
	);
}

/**
 * Attach a new font stylesheet to the document head using the provided content
 */
export function createStylesheet(fontId: string, content: string, isPreview: boolean): void {
	const stylesheetNode = document.createElement("style");
	stylesheetNode.textContent = content;
	stylesheetNode.id = getStylesheetId(fontId);
	stylesheetNode.setAttribute(PREVIEW_ATTRIBUTE_NAME, isPreview.toString()); // Indicates if preview
	document.head.appendChild(stylesheetNode);
}

/**
 * Remove the font stylesheet corresponding to the provided fontId from the document head
 */
export function deleteStylesheet(fontId: string): void {
	const stylesheetNode = document.getElementById(getStylesheetId(fontId));
	if (stylesheetNode && stylesheetNode.parentNode) {
		stylesheetNode.parentNode.removeChild(stylesheetNode);
	}
}
