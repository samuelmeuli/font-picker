/**
 * Execute a GET XMLHttpRequest and return the result
 */
export default function get(url: string): Promise<string> {
	return new Promise(
		(resolve, reject): void => {
			const request = new XMLHttpRequest();
			request.overrideMimeType("application/json");
			request.open("GET", url, true);
			request.onreadystatechange = (): void => {
				// Request has completed
				if (request.readyState === 4) {
					if (request.status !== 200) {
						// On error
						reject(new Error(`Response has status code ${request.status}`));
					} else {
						// On success
						resolve(request.responseText);
					}
				}
			};
			request.send();
		},
	);
}
