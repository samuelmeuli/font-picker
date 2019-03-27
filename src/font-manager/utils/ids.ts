/**
 * Return the fontId based on the provided font family
 */
export function getFontId(fontFamily: string): string {
	return fontFamily.replace(/\s+/g, "-").toLowerCase();
}

/**
 * Throw an error if the provided pickerId doesn't consist only of letters and digits
 */
export function validatePickerId(pickerId: string): void {
	if (pickerId.match(/[^0-9a-z]/i)) {
		throw Error("The `pickerId` parameter may only contain letters and digits");
	}
}
