/**
 * Fetch list of all fonts available on Google Fonts, sorted by popularity
 */
export function fetchList(apiKey) {
	return new Promise((resolve, reject) => {
		const url = `https://www.googleapis.com/webfonts/v1/webfonts?sort=popularity&key=${apiKey}`;
		const request = new XMLHttpRequest();
		request.overrideMimeType('application/json');
		request.open('GET', url, true);
		request.onreadystatechange = () => {
			// Request has completed
			if (request.readyState === 4) {
				// On error
				if (request.status !== 200) {
					reject(new Error(`Response has status code ${request.status}`));
				} else {
					// On success
					const response = JSON.parse(request.responseText);
					resolve(response.items);
				}
			}
		};
		request.send();
	});
}

/**
 * Filter font list according to the specified options
 */
export function filterList(fontList, defaultFont, options) {
	let filteredList = fontList;

	// 'families' parameter (only keep fonts whose names are included in the provided array)
	if (options.families) {
		filteredList = filteredList.filter(font => options.families.includes(font.family));
	}

	// 'categories' parameter (only keep fonts in categories from the provided array)
	if (options.categories) {
		filteredList = filteredList.filter(font => options.categories.includes(font.category));
	}

	// 'variants' parameter (only keep fonts with at least the specified variants)
	if (options.variants) {
		filteredList = filteredList.filter(font => {
			for (let i = 0; i < options.variants.length; i += 1) {
				if (font.variants.indexOf(options.variants[i]) === -1) {
					return false;
				}
			}
			return true;
		});
	}

	// 'limit' parameter (limit font list size)
	if (options.limit) {
		filteredList = filteredList.slice(0, options.limit);
	}

	// Add default font to list if it is not already in it
	if (filteredList.filter(font => font.family === defaultFont.family).length === 0) {
		// Add default font to beginning of list
		filteredList.unshift(defaultFont);
		// Remove least popular font from list if limit parameter is set
		if (options.limit) {
			filteredList.pop();
		}
	}

	// 'sort' parameter (list is already sorted by popularity)
	if (options.sort === 'alphabetical') {
		filteredList = filteredList.sort((fontA, fontB) => fontA.family.localeCompare(fontB.family));
	}

	return filteredList;
}
