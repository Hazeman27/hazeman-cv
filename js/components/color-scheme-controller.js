export default class ColorSchemeController {
    constructor(selection) {
        this.selection = selection;
        this.currentScheme = ColorSchemeController.getCurrentPreference();
        ColorSchemeController.setScheme(this.currentScheme);
        this.renderSchemeOptions();
        this.attachEventListeners();
    }
    renderSchemeOptions() {
        this.selection.innerHTML = '';
        let optionValues = Object.getOwnPropertyNames(ColorSchemeController.options);
        let current = optionValues
            .find(option => option === this.currentScheme);
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
            this.selection.appendChild(option);
        }
    }
    attachEventListeners() {
        this.handleChange = this.handleChange.bind(this);
        this.handleSystemPreferenceChange =
            this.handleSystemPreferenceChange.bind(this);
        this.selection.addEventListener('change', this.handleChange);
        ColorSchemeController.systemPreference.addEventListener('change', this.handleSystemPreferenceChange);
    }
    handleSystemPreferenceChange() {
        if (this.currentScheme !== ColorSchemeController.options.default.value)
            return;
        ColorSchemeController.setScheme(ColorSchemeController.options.default.value);
    }
    handleChange() {
        const selectedOption = this.selection.options.item(this.selection.options.selectedIndex);
        ColorSchemeController.setScheme(selectedOption.value);
    }
    static getCurrentPreference() {
        return localStorage.getItem('preferred-color-scheme') ||
            ColorSchemeController.options.default.value;
    }
    static systemPreferenceIsDark() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    static preferenceIsDark(preference) {
        return preference === ColorSchemeController.options.dark.value;
    }
    static defaultPreferenceIsDark(preference) {
        return preference === ColorSchemeController.options.default.value &&
            this.systemPreferenceIsDark();
    }
    static setScheme(preference) {
        localStorage.setItem('preferred-color-scheme', preference);
        if (this.preferenceIsDark(preference) || this.defaultPreferenceIsDark(preference))
            document.body.setAttribute('data-theme', ColorSchemeController.options.dark.value);
        else
            document.body.removeAttribute('data-theme');
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
        text: 'System',
        value: 'default'
    }
};
ColorSchemeController.systemPreference = window.matchMedia('(prefers-color-scheme: dark)');
//# sourceMappingURL=color-scheme-controller.js.map