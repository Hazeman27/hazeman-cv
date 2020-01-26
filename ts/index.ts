import Nav from './components/nav.js';
import ColorSchemeController from './components/color-scheme-controller.js';
import { View } from './interfaces';

(async (): Promise<void> => {
	
	const partials: Map<HTMLElement, string> = new Map([
		[document.querySelector('nav'), './partials/nav.html'],
		[document.querySelector('footer'), './partials/footer.html']
	]);
	
	const views: Array<View> = [{
		name: 'me',
		template: './views/me.html'
	}, {
		name: 'art',
		template: './views/art.html',
		sections: new Map([
			['drawings', 'drawings'],
			['designs', '99designs'],
			['more', 'more'],
			['codepens', 'codepens'],
			['music', 'music']
		]),
		module: '../modules/art.js'
	}, {
		name: 'contact',
		template: './views/contact.html'
	}];
	
	for (const [element, path] of partials) {
		
		const response: Response = await window.fetch(path);
		element.innerHTML = await response.text();
	}
	
	await new Nav({
		container: document.querySelector('nav'),
		logo: document.querySelector('.nav__logo'),
		toggleButton: document.querySelector('#nav__toggle'),
		current: document.querySelector('.nav__current'),
		
		toggleContainerClassName: 'nav--content-visible',
		toggleContentClassName: 'nav__content--visible',
		breakpoint: 800,
		
		content: {
			container: document.querySelector('.nav__content'),
			links: document.querySelector('.nav__content__links'),
			sections: {
				container: document.querySelector('.nav__content__sections'),
				titleSelector: 'nav__content__sections__title',
				linkSelector: 'nav__content__sections__link'
			}
		},
		
		routerParams: {
			container: document.querySelector('main'),
			views: views,
			defaultState: { view: 'me', title: 'Me' }
		}
	}).attachEventListeners().setAriaHiddenAttribute().initRouter();
	
	new ColorSchemeController(document.querySelector('#color-scheme-selector'));
	
	/* :: Service Worker... */
	if ('serviceWorker' in navigator) {

		try {
			await navigator.serviceWorker.register('./service-worker.js');
		} catch (error) {
			console.log('Service Worker registration failed: ', error);
		}
	}
})();
