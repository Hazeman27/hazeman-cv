export default class ColorSchemeController {
    constructor(selectElement) {
        this.selectElement = selectElement;
        this.currentPreference = ColorSchemeController.getCurrentPreference();
        ColorSchemeController.setPreference(this.currentPreference);
        this.renderOptions();
        this.attachEventListeners();
    }
    renderOptions() {
        this.selectElement.innerHTML = '';
        let optionValues = Object.getOwnPropertyNames(ColorSchemeController.options);
        let current = optionValues
            .find(option => option === this.currentPreference);
        if (current === undefined)
            current = ColorSchemeController.options.default.value;
        const second = optionValues
            .find(option => option !== current);
        const third = optionValues
            .find(option => option !== second && option !== current);
        const currentOptions = {
            current: ColorSchemeController.options[current],
            second: ColorSchemeController.options[second],
            third: ColorSchemeController.options[third]
        };
        for (const entry of Object.getOwnPropertyNames(currentOptions)) {
            const option = document.createElement('option');
            option.textContent = currentOptions[entry].text;
            option.value = currentOptions[entry].value;
            this.selectElement.appendChild(option);
        }
    }
    attachEventListeners() {
        this.handleChange = this.handleChange.bind(this);
        this.handleSystemPreferenceChange =
            this.handleSystemPreferenceChange.bind(this);
        this.selectElement.addEventListener('change', this.handleChange);
        ColorSchemeController.systemPreference.addEventListener('change', this.handleSystemPreferenceChange);
    }
    handleSystemPreferenceChange() {
        if (this.currentPreference !== ColorSchemeController.options.default.value)
            return;
        ColorSchemeController.setPreference();
    }
    handleChange() {
        const selectedOption = this.selectElement.options.item(this.selectElement.options.selectedIndex);
        ColorSchemeController.setPreference(selectedOption.value);
    }
    static getCurrentPreference() {
        return localStorage.getItem('preferred-color-scheme') ||
            ColorSchemeController.options.default.value;
    }
    static systemPreferenceIsDark() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    static setPreference(preference = ColorSchemeController.options.default.value) {
        localStorage.setItem('preferred-color-scheme', preference);
        if (preference === ColorSchemeController.options.dark.value ||
            (preference === ColorSchemeController.options.default.value && this.systemPreferenceIsDark()))
            document.body.setAttribute('data-theme', ColorSchemeController.options.dark.value);
        else
            document.body.setAttribute('data-theme', ColorSchemeController.options.light.value);
    }
}
ColorSchemeController.options = {
    dark: {
        text: 'Dark',
        value: 'dark'
    },
    light: {
        text: 'Light',
        value: 'light'
    },
    default: {
        text: 'System default',
        value: 'default'
    }
};
ColorSchemeController.systemPreference = window.matchMedia('(prefers-color-scheme: dark)');
//# sourceMappingURL=prefers-color-scheme.js.map