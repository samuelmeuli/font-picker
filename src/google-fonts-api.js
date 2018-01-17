const baseURL = 'https://www.googleapis.com/webfonts/v1/webfonts?';


export async function fetchFontList(apiKey) {
	const response = await window.fetch(`${baseURL}sort=popularity&key=${apiKey}`);
	const json = await response.json();
	return json.items;
}