import { capitalize } from '../utils.js';

export default function colorSchemeController(selectElement) {
    renderOptions(selectElement, setScheme(getCurrentPreference()));
    attachEventListeners(selectElement);
}

function attachEventListeners(selectElement) {
    
    selectElement.addEventListener('change', () => {
        setScheme(selectElement.options.item(selectElement.options.selectedIndex).value);
    });
    
    self.matchMedia('(prefers-color-scheme: dark)')
          .addEventListener('change', () => {
              if (getCurrentPreference() === 'system')
                  setScheme('system');
          });
}

function renderOptions(selectElement, currentScheme) {
    
    selectElement.appendChild(createSchemeOption(currentScheme));
    
    for (const schemeOption of generateSchemeOptions(currentScheme))
        selectElement.appendChild(createSchemeOption(schemeOption));
}

function createSchemeOption(scheme) {
    return Object.assign(document.createElement('option'), {
        textContent: capitalize(scheme),
        value: scheme
    });
}

function *generateSchemeOptions(currentScheme) {
    
    if (currentScheme === 'system')
        yield *['dark', 'light'];
    
    else if (currentScheme === 'dark')
        yield *['light', 'system'];
    
    else
        yield *['dark', 'system'];
}

function setScheme(scheme) {
    
    if (scheme === 'system') {
        document.body.setAttribute('data-theme', getSystemPreference());
    } else {
        document.body.setAttribute('data-theme', scheme);
    }
    
    localStorage.setItem('preferred-color-scheme', scheme);
    return scheme;
}

function getSystemPreference() {
    return self.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getCurrentPreference() {
    return localStorage.getItem('preferred-color-scheme') || 'system';
}