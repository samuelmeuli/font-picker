export type Category = "sans-serif" | "serif" | "display" | "handwriting" | "monospace";

export type SortOption = "alphabet" | "popularity";

export type Script =
	| "arabic"
	| "bengali"
	| "chinese-simplified"
	| "chinese-traditional"
	| "cyrillic"
	| "cyrillic-ext"
	| "devanagari"
	| "greek"
	| "greek-ext"
	| "gujarati"
	| "gurmukhi"
	| "hebrew"
	| "japanese"
	| "kannada"
	| "khmer"
	| "korean"
	| "latin"
	| "latin-ext"
	| "malayalam"
	| "myanmar"
	| "oriya"
	| "sinhala"
	| "tamil"
	| "​telugu"
	| "thai"
	| "vietnamese";

export type Variant =
	| "100"
	| "100italic"
	| "200"
	| "200italic"
	| "300"
	| "300italic"
	| "regular"
	| "italic"
	| "500"
	| "500italic"
	| "600"
	| "600italic"
	| "700"
	| "700italic"
	| "800"
	| "800italic"
	| "900"
	| "900italic";

export interface Font {
	// Fields used by font-picker
	family: string;
	id: string;
	category?: Category;
	scripts?: Script[]; // Called "subsets" in Google Fonts API
	variants?: Variant[];

	// Other fields specified by the API
	kind?: string; // Usually "webfonts#webfont"
	version?: string; // Version number
	lastModified?: string; // Date of last modification (yyyy-MM-dd)
	files?: Record<Variant, string>; // Font file for each variant
}

export type FontList = Map<string, Font>;

export interface Options {
	pickerId?: string;
	families?: string[];
	categories?: Category[];
	scripts?: Script[];
	variants?: Variant[];
	limit?: number;
	sort?: SortOption;
}
