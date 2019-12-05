# Font Picker

**A simple, customizable font picker allowing users to preview, select and use Google Fonts on your website.**

- Simple setup
- No dependencies
- Automatic font download and generation of the required CSS selectors
- Efficient font previews (full fonts are only downloaded on selection)

→ **[Demo](https://font-picker.samuelmeuli.com)**

_If you use React, see [**Font Picker for React**](https://github.com/samuelmeuli/font-picker-react)._

<p align="center">
  <img src=".github/demo.gif" width="700" alt="Font picker demo" />
</p>

## Getting started

To be able to access the API, you'll need to [generate a Google Fonts API key](https://developers.google.com/fonts/docs/developer_api#APIKey).

### 1. Setup

You have the following options for installing/using the package:

- **Using script tags:** Download the `FontPicker.js` file from the [releases page](https://github.com/samuelmeuli/font-picker/releases/latest) and save it in your project. Include the script in your HTML at the end of the document `<body>`:

```html
<script src="path/to/FontPicker.js"></script>
<script>
	const fontPicker = new FontPicker(
		YOUR_API_KEY, // Google API key
		"Open Sans", // Default font
		{ limit: 30 }, // Additional options
	);
</script>
```

- **Using NPM:** If you're using a module bundler like Webpack, you can install the `font-picker` package using NPM and import it in your code:

```sh
npm install font-picker
```

```js
import FontPicker from "font-picker";

const fontPicker = new FontPicker(
	YOUR_API_KEY, // Google API key
	"Open Sans", // Default font
	{ limit: 30 }, // Additional options
);
```

### 2. Displaying the font picker

**Create an empty `<div>` with `id="font-picker"`** in your HTML file. This is where the font picker will be generated.

```html
<div id="font-picker"></div>
```

### 3. Applying the selected font

**Add the class `"apply-font"` to all HTML elements you want to apply the selected font to.**

When the user selects a font, it will automatically be downloaded and applied to all HTML elements with the `"apply-font"` class.

<p align="center">
  <img src=".github/html-element-names.png" width="800" alt="Class names" />
</p>

## Customization

### Parameters

The following parameters can be passed to the constructor of the `FontPicker` class:

```js
const fontPicker = new FontPicker(apiKey, defaultFamily, options, onChange);
```

- **`apiKey` (required)**: Google API key
- **`defaultFamily`**: Font that is selected on initialization. Default: `"Open Sans"`
- **`options`**: Object with additional optional parameters:
  - **`pickerId`**: If you have multiple font pickers on your site, you need to give them unique IDs which must be appended to the pickers' `id` attributes and the `.apply-font` class names. Example: If the options object is `{ pickerId: "main" }`, use `#font-picker-main` and `.apply-font-main`
  - **`families`**: If only specific fonts shall appear in the list, specify their names in an array. Default: All font families
  - **`categories`**: Array of font categories to include in the list. Possible values: `"sans-serif", "serif", "display", "handwriting", "monospace"`. Default: All categories
  - **`scripts`**: Array of scripts which the fonts must include and which will be downloaded on font selection. Default: `["latin"]`. Example: `["latin", "greek", "hebrew"]` (see [all possible values](./src/shared/types.ts))
  - **`variants`**: Array of variants which the fonts must include and which will be downloaded on font selection. Default: `["regular"]`. Example: `["regular", "italic", "700", "700italic"]` (see [all possible values](./src/shared/types.ts))
  - **`filter`**: Function which must evaluate to `true` for a font to be included in the list. Default: `font => true`. Example: If `font => font.family.toLowerCase().startsWith("m")`, only fonts whose names begin with "M" will be in the list
  - **`limit`**: Maximum number of fonts to display in the list (the least popular fonts will be omitted). Default: `50`
  - **`sort`**: Sorting attribute for the font list. Possible values: `"alphabet", "popularity"`. Default: `"alphabet"`
- **`onChange`**: Function to execute whenever the active font is changed

### Functions

The `FontPicker` class exposes the following functions:

- **`getFonts()`**: Returns a map of all font names/objects
- **`addFont(fontFamily: string, index?: number)`**: Adds the specified font to the font list (at the given index)
- **`removeFont(fontFamily: string)`**: Removes the specified font from the font list
- **`getActiveFont()`**: Returns the font object of the currently active font
- **`setActiveFont(fontFamily: string)`**: Sets the provided font as the active font
- **`setOnChange(onChange: (font: Font) => void)`**: Update the `onChange` function after the font picker has been initialized

## Development

Requirements: Node.js, Yarn

1. Clone this repository: `git clone REPO_URL`
2. Install all dependencies: `yarn`
3. Generate the library bundle: `yarn start`
4. View the rendered component on `localhost:3000`

Suggestions and contributions are always welcome! Please discuss larger changes via issue before submitting a pull request.
