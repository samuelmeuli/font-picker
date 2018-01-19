/**
 * Checks if a font is available to be used on a web page.
 * Source: https://www.samclarke.com/javascript-is-font-available/
 *
 * @param {String} fontName The name of the font to check
 * @return {Boolean}
 * @license MIT
 * @copyright Sam Clarke 2013
 * @author Sam Clarke <sam@samclarke.com>
 */

var width;
var body = document.body;

var container = document.createElement('span');
container.innerHTML = Array(100).join('wi');
container.style.cssText = [
	'position:absolute',
	'width:auto',
	'font-size:128px',
	'left:-99999px'
].join(' !important;');

var getWidth = function (fontFamily) {
	container.style.fontFamily = fontFamily;

	body.appendChild(container);
	width = container.clientWidth;
	body.removeChild(container);

	return width;
};

// Pre compute the widths of monospace, serif & sans-serif
// to improve performance.
var monoWidth  = getWidth('monospace');
var serifWidth = getWidth('serif');
var sansWidth  = getWidth('sans-serif');

export default function isFontAvailable(font) {
	return monoWidth !== getWidth(font + ',monospace') ||
		sansWidth !== getWidth(font + ',sans-serif') ||
		serifWidth !== getWidth(font + ',serif');
}