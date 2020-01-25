class ColorScheme {
	
	private readonly _textContent: string;
	private readonly _value: string;
	
	constructor(textContent: string, value: string) {
		this._textContent = textContent;
		this._value = value;
	}
	
	get textContent(): string {
		return this._textContent;
	}
	
	get value(): string {
		return this._value;
	}
}

class ColorSchemeOptions {
	
	private readonly _colorSchemes: Array<ColorScheme>;
	private _current: ColorScheme;
	
	constructor(colorSchemes: Array<ColorScheme>) {
		this._colorSchemes = colorSchemes;
	}
	
	get colorSchemes(): Array<ColorScheme> {
		return this._colorSchemes;
	}
	
	set current(colorScheme: ColorScheme) {
		
		if (this._colorSchemes.includes(colorScheme))
			this._current = colorScheme;
	}
	
	*[Symbol.iterator]() {
		
		if (this._current)
			yield this._current;
		
		for (const scheme of this._colorSchemes) {
			
			if (scheme !== this._current)
				yield scheme;
		}
	}
}

export default class ColorSchemeController {
	
	private static readonly defaultScheme = new ColorScheme('System', 'default');
	private static readonly darkScheme = new ColorScheme('Dark', 'dark');
	private static readonly lightScheme = new ColorScheme('Light', 'light');
	
	private static readonly options = new ColorSchemeOptions([
		ColorSchemeController.defaultScheme,
		ColorSchemeController.darkScheme,
		ColorSchemeController.lightScheme
	]);
	
	private static readonly systemScheme: MediaQueryList =
		window.matchMedia('(prefers-color-scheme: dark)');
	
	private readonly selection: HTMLSelectElement;
	private readonly currentScheme: ColorScheme;
	
	constructor(selection: HTMLSelectElement) {
		
		this.selection = selection;
		this.currentScheme = ColorSchemeController.getCurrentScheme();
		
		ColorSchemeController.setScheme(this.currentScheme);
		
		this.renderSchemeOptions();
		this.attachEventListeners();
	}
	
	private renderSchemeOptions(): void {
		
		this.selection.innerHTML = '';
		ColorSchemeController.options.current = this.currentScheme;
		
		for (const schemeOption of ColorSchemeController.options) {
			
			const option: HTMLOptionElement = document.createElement('option');
			
			option.textContent = schemeOption.textContent;
			option.value = schemeOption.value;
			
			this.selection.appendChild(option);
		}
	}
	
	private attachEventListeners(): void {
		
		this.handleChange = this.handleChange.bind(this);
		this.handleSystemSchemeChange = this.handleSystemSchemeChange.bind(this);
		
		this.selection.addEventListener('change', this.handleChange);
		
		ColorSchemeController.systemScheme.addEventListener('change',
			this.handleSystemSchemeChange
		);
	}
	
	private handleSystemSchemeChange(): void {
		
		if (ColorSchemeController.isDefaultScheme(this.currentScheme))
			ColorSchemeController.setScheme(ColorSchemeController.defaultScheme);
	}
	
	private handleChange(): void {
		
		const selectedOption: HTMLOptionElement = this.selection.options.item(
			this.selection.options.selectedIndex
		);
		
		ColorSchemeController.setScheme(
			ColorSchemeController.getSchemeByValue(selectedOption.value)
		);
	}
	
	private static getSchemeByValue(value: string): ColorScheme {
		return ColorSchemeController.options.colorSchemes.find(
			scheme => scheme.value === value
		);
	}
	
	private static getCurrentScheme(): ColorScheme {
		return ColorSchemeController.getSchemeByValue(
			localStorage.getItem('preferred-color-scheme')
		) || ColorSchemeController.defaultScheme;
	}
	
	private static isDefaultScheme(scheme: ColorScheme): Boolean {
		return scheme === ColorSchemeController.defaultScheme;
	}
	
	private static isDarkScheme(scheme: ColorScheme) {
		return scheme === ColorSchemeController.darkScheme;
	}
	
	private static systemSchemeIsDark(): Boolean {
		return window.matchMedia('(prefers-color-scheme: dark)').matches;
	}
	
	private static defaultSchemeIsDark(scheme: ColorScheme) {
		return this.isDefaultScheme(scheme) && this.systemSchemeIsDark();
	}
	
	private static setScheme(scheme: ColorScheme): void {
		
		localStorage.setItem('preferred-color-scheme', scheme.value);
		
		if (this.isDarkScheme(scheme) || this.defaultSchemeIsDark(scheme))
			
			document.body.setAttribute('data-theme',
				ColorSchemeController.darkScheme.value
			);
		
		else
			document.body.setAttribute('data-theme', scheme.value);
	}
}