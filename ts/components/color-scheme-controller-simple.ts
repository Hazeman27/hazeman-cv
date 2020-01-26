export function colorSchemeController(selectElement: HTMLSelectElement): void {
	
	renderOptions(selectElement, setScheme(getCurrentPreference()));
	attachEventListeners(selectElement);
}

function attachEventListeners(selectElement: HTMLSelectElement): void {
	
	selectElement.addEventListener('change', () => {
		setScheme(selectElement.options.item(
			selectElement.options.selectedIndex
		).value);
	});
	
	window.matchMedia('(prefers-color-scheme: dark)')
	      .addEventListener('change', () => {
		      if (getCurrentPreference() === 'system')
			      setScheme('system');
	      });
}

function renderOptions(selectElement: HTMLSelectElement, currentScheme: string): void {
	
	selectElement.appendChild(createSchemeOption(currentScheme));
	
	for (const schemeOption of generateSchemeOptions(currentScheme))
		selectElement.appendChild(createSchemeOption(schemeOption));
}

function createSchemeOption(scheme: string): HTMLOptionElement {
	
	const option = document.createElement('option');
	
	option.textContent = scheme;
	option.value = scheme;
	
	return option;
}

function *generateSchemeOptions(currentScheme: string): Iterable<string> {
	
	if (currentScheme === 'system')
		yield *['dark', 'light'];
	
	else if (currentScheme === 'dark')
		yield *['light', 'system'];
	
	else yield *['dark', 'system'];
}

function setScheme(scheme: string): string {
	
	if (scheme === 'system') {
		document.body.setAttribute('data-theme', getSystemPreference());
	} else {
		document.body.setAttribute('data-theme', scheme);
	}
	
	localStorage.setItem('preferred-color-scheme', scheme);
	return scheme;
}

function getSystemPreference(): string {
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getCurrentPreference(): string {
	return localStorage.getItem('preferred-color-scheme') || 'system';
}