class ColorScheme {
    constructor(textContent, value) {
        this._textContent = textContent;
        this._value = value;
    }
    get textContent() {
        return this._textContent;
    }
    get value() {
        return this._value;
    }
}
class ColorSchemeOptions {
    constructor(colorSchemes) {
        this._colorSchemes = colorSchemes;
    }
    get colorSchemes() {
        return this._colorSchemes;
    }
    set current(colorScheme) {
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
    constructor(selection) {
        this.selection = selection;
        this.currentScheme = ColorSchemeController.getCurrentScheme();
        ColorSchemeController.setScheme(this.currentScheme);
        this.renderSchemeOptions();
        this.attachEventListeners();
    }
    renderSchemeOptions() {
        this.selection.innerHTML = '';
        ColorSchemeController.options.current = this.currentScheme;
        for (const schemeOption of ColorSchemeController.options) {
            const option = document.createElement('option');
            option.textContent = schemeOption.textContent;
            option.value = schemeOption.value;
            this.selection.appendChild(option);
        }
    }
    attachEventListeners() {
        this.handleChange = this.handleChange.bind(this);
        this.handleSystemSchemeChange = this.handleSystemSchemeChange.bind(this);
        this.selection.addEventListener('change', this.handleChange);
        ColorSchemeController.systemScheme.addEventListener('change', this.handleSystemSchemeChange);
    }
    handleSystemSchemeChange() {
        if (ColorSchemeController.isDefaultScheme(this.currentScheme))
            ColorSchemeController.setScheme(ColorSchemeController.defaultScheme);
    }
    handleChange() {
        const selectedOption = this.selection.options.item(this.selection.options.selectedIndex);
        ColorSchemeController.setScheme(ColorSchemeController.getSchemeByValue(selectedOption.value));
    }
    static getSchemeByValue(value) {
        return ColorSchemeController.options.colorSchemes.find(scheme => scheme.value === value);
    }
    static getCurrentScheme() {
        return ColorSchemeController.getSchemeByValue(localStorage.getItem('preferred-color-scheme')) || ColorSchemeController.defaultScheme;
    }
    static isDefaultScheme(scheme) {
        return scheme === ColorSchemeController.defaultScheme;
    }
    static isDarkScheme(scheme) {
        return scheme === ColorSchemeController.darkScheme;
    }
    static systemSchemeIsDark() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    static defaultSchemeIsDark(scheme) {
        return this.isDefaultScheme(scheme) && this.systemSchemeIsDark();
    }
    static setScheme(scheme) {
        localStorage.setItem('preferred-color-scheme', scheme.value);
        if (this.isDarkScheme(scheme) || this.defaultSchemeIsDark(scheme))
            document.body.setAttribute('data-theme', ColorSchemeController.darkScheme.value);
        else
            document.body.setAttribute('data-theme', scheme.value);
    }
}
ColorSchemeController.defaultScheme = new ColorScheme('System', 'default');
ColorSchemeController.darkScheme = new ColorScheme('Dark', 'dark');
ColorSchemeController.lightScheme = new ColorScheme('Light', 'light');
ColorSchemeController.options = new ColorSchemeOptions([
    ColorSchemeController.defaultScheme,
    ColorSchemeController.darkScheme,
    ColorSchemeController.lightScheme
]);
ColorSchemeController.systemScheme = window.matchMedia('(prefers-color-scheme: dark)');
//# sourceMappingURL=color-scheme-controller.js.map