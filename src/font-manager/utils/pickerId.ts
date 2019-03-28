/**
 * Throw an error if the provided pickerId doesn't consist only of letters and digits
 */
export default function validatePickerId(pickerId: string): void {
	if (pickerId.match(/[^0-9a-z]/i)) {
		throw Error("The `pickerId` parameter may only contain letters and digits");
	}
}
