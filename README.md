# Font Picker

[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/smeuli/font-picker/blob/master/LICENSE)
[![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/smeuli/font-picker/pulls)

**A simple, customizable font selector allowing users to preview, choose, and use Google Fonts on your website.**

* automatic font download and generation of the required CSS styles
* efficient font previews (previews in the list are loaded dynamically; the full font is only downloaded on selection)
* no dependencies

→ **[Demo](https://smeuli.github.io/font-picker)**

_If you use React, see [**Font Picker for React**](https://github.com/smeuli/font-picker-react)._

<p align="center">
  <img src=".github/demo.gif" width=800 alt="Demo">
</p>


## Getting started

### Setup

* **Using script tags:** Download the [latest release](https://github.com/smeuli/font-picker/releases/latest) and include the `lib/index.js` file in your HTML:

```html
<script type="text/javascript" src="./path/to/dist/index.js"></script>
<script type="text/javascript">
    const fontPicker = new FontPicker(
        'YOUR_API_KEY', // Google API key
        'Open Sans', // default font
        { limit: 50 } // additional options
    );
    fontPicker.init();
</script>
```


* **Using NPM:** Install the `font-picker` package from NPM and require it in a JavaScript file:

```
npm install font-picker
```

```js
const FontPicker = require('font-picker');

const fontPicker = new FontPicker(
    'YOUR_API_KEY', // Google API key
    'Open Sans', // default font
    { limit: 50 } // additional options
);
fontPicker.init();
```


### Displaying the font picker

**Create an empty `<div>` with the ID `"font-picker"`** in your HTML file. This is where the font picker will be generated.

```html
<div id="font-picker"></div>
```


### Applying the selected font

**Add the class `"apply-font"` to all HTML elements you want to apply the selected font to.**

When the user selects a font using the font picker, it will automatically be downloaded (added as a `<link>` to the document's head) and applied to all HTML elements of the `"apply-font"` class.


<p align="center">
  <img src=".github/html-element-names.png" width=800 alt="Class names">
</p>


See [`demo/index.html`](demo/index.html) for an example.


## Customization

### Parameters

The following parameters can be passed to the constructor of the `FontPicker` class:

* **`apiKey` (required)**: Google API key (can be generated [here](https://developers.google.com/fonts/docs/developer_api#APIKey))
* **`defaultFont`**: Font that is selected on initialization (default: `'Open Sans'`)
* **`options`**: Object with additional (optional) parameters:
  * **`name`**: If you have multiple font pickers on your site, you need to give them unique names (which may only consist of letters and digits). These names must also be appended to the font picker's ID and the `.apply-font` class name; e.g. if `{ name: 'main' }`, then use `#font-picker-main` and `.apply-font-main`
  * **`families`**: If only specific fonts shall appear in the list, specify their names in an array (default: all font families)
  * **`categories`**: Array of font categories – possible values: `'sans-serif', 'serif', 'display', handwriting', 'monospace'` (default: all categories)
  * **`variants`**: Array of variants which the fonts must include and which will be downloaded; the first variant in the array will become the default variant (and will be used in the font picker and the `.apply-font` class); e.g. `['regular', 'italic', '700', '700italic']` (default: `['regular']`)
  * **`limit`**: Maximum number of fonts to be displayed in the list (the least popular fonts will be omitted; default: `100`)
  * **`sort`**: Sorting attribute for the font list – possible values: `'alphabetical'` (default), `'popularity'`
* **`onChange`**: Function which is executed whenever the user changes the active font and its stylesheet finishes downloading


### Functions

The `FontPicker` class has the following functions:

* **`init()`**: Generates and displays the font picker inside the `div` with `id="font-picker"`
* **`getActiveFont()`**: Returns an object with information about the currently selected font


## Build Process

* `git clone`
* `npm install`
* `npm start` to generate the library bundle using [Rollup](https://github.com/rollup/rollup) (in the `lib` directory)
* See the font picker in action by opening the [`demo/index.html`](demo/index.html) file