import { getFontId } from "../utils/ids";

const activeFontStylesheet = document.createElement("style");
const previewFontsStylesheet = document.createElement("style");
document.head.appendChild(activeFontStylesheet);
document.head.appendChild(previewFontsStylesheet);

/**
 * Add declaration for applying the specified preview font
 */
export function applyFontPreview(previewFont: Font, selectorSuffix: string): void {
	const fontId = getFontId(previewFont.family);
	const style = `
			#font-button-${fontId}${selectorSuffix} {
				font-family: "${previewFont.family}";
			}
		`;
	previewFontsStylesheet.appendChild(document.createTextNode(style));
}

/**
 * Add/update declaration for applying the current active font
 */
export function applyActiveFont(activeFont: Font, selectorSuffix: string): void {
	const style = `
		.apply-font${selectorSuffix} {
			font-family: "${activeFont.family}";
		}
	`;
	const styleNode = document.createTextNode(style);
	if (activeFontStylesheet.childNodes.length === 0) {
		activeFontStylesheet.appendChild(styleNode);
	} else {
		activeFontStylesheet.replaceChild(styleNode, activeFontStylesheet.childNodes[0]);
	}
}
