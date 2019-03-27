/**
 * Execute the provided regex on the string and return all matched groups
 */
export default function getMatches(regex: RegExp, str: string): string[] {
	const matches: string[] = [];
	let match;
	do {
		match = regex.exec(str);
		if (match) {
			matches.push(match[1]);
		}
	} while (match);
	return matches;
}
