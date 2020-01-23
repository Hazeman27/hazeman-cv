import { colorSchemeOptions, currentColorSchemeOptions } from '../interfaces';

export default class ColorSchemeController {

    private static readonly options: colorSchemeOptions = {
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
    
    private static readonly systemPreference: MediaQueryList =
        window.matchMedia('(prefers-color-scheme: dark)');
    
    private readonly selection: HTMLSelectElement;
    private readonly currentScheme: string;

    constructor(selection: HTMLSelectElement) {

        this.selection = selection;
        this.currentScheme = ColorSchemeController.getCurrentPreference();

        ColorSchemeController.setScheme(this.currentScheme);
        
        this.renderSchemeOptions();
        this.attachEventListeners();
    }

    private renderSchemeOptions(): void {

        this.selection.innerHTML = '';
        
        let optionValues = Object.getOwnPropertyNames(
            ColorSchemeController.options
        );
        
        let current: string = optionValues
            .find(option => option === this.currentScheme);
        
        if (current === undefined)
            current = ColorSchemeController.options.default.value;
        
        const second: string = optionValues
            .find(option => option !== current);
        
        const third: string = optionValues
            .find(option => option !== second && option !== current);
        
        const currentOptions: currentColorSchemeOptions = {
            current: ColorSchemeController.options[current],
            second: ColorSchemeController.options[second],
            third: ColorSchemeController.options[third]
        };

        for (const entry of Object.getOwnPropertyNames(currentOptions)) {

            const option: HTMLOptionElement = document.createElement('option');

            option.textContent = currentOptions[entry].text;
            option.value = currentOptions[entry].value;

            this.selection.appendChild(option);
        }
    }

    private attachEventListeners(): void {

        this.handleChange = this.handleChange.bind(this);
        this.handleSystemPreferenceChange =
            this.handleSystemPreferenceChange.bind(this);

        this.selection.addEventListener('change', this.handleChange);
        
        ColorSchemeController.systemPreference.addEventListener('change',
            this.handleSystemPreferenceChange
        );
    }

    private handleSystemPreferenceChange(): void {

        if (this.currentScheme !== ColorSchemeController.options.default.value)
            return;

        ColorSchemeController.setScheme(
            ColorSchemeController.options.default.value
        );
    }

    private handleChange(): void {

        const selectedOption: HTMLOptionElement = this.selection.options.item(
            this.selection.options.selectedIndex
        );

        ColorSchemeController.setScheme(selectedOption.value);
    }

    private static getCurrentPreference(): string {
        return localStorage.getItem('preferred-color-scheme') ||
            ColorSchemeController.options.default.value;
    }

    private static systemPreferenceIsDark(): Boolean {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    private static preferenceIsDark(preference: string) {
        return preference === ColorSchemeController.options.dark.value;
    }
    
    private static defaultPreferenceIsDark(preference: string) {
        return preference === ColorSchemeController.options.default.value &&
            this.systemPreferenceIsDark();
    }

    private static setScheme(preference: string): void {

        localStorage.setItem('preferred-color-scheme', preference);
        
        if (this.preferenceIsDark(preference) || this.defaultPreferenceIsDark(preference)) {
            
            document.body.setAttribute('data-theme',
                ColorSchemeController.options.dark.value
            );
            
        } else {
            
            document.body.setAttribute('data-theme',
                ColorSchemeController.options.light.value
            );
        }
    }
}