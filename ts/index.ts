import Nav from './components/nav.js';
import { View } from './interfaces';

export default (async (): Promise<void> => {

	const components: Map<HTMLElement, string> = new Map([
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
		module: {
			name: 'Art',
			path: '../modules/art.js'
		}
	}, {
		name: 'contact',
		template: './views/contact.html'
	}];

	for (const [element, componentPath] of components) {

		const response = await window.fetch(componentPath);
		element.innerHTML = await response.text();
	}

	const nav: Nav = new Nav({

		container: document.querySelector('#nav'),
		toggleButton: document.querySelector('#nav__toggle'),
		current: document.querySelector('#nav__current'),

		toggleClassName: 'nav__content--visible',
		breakpoint: 800,

		content: {
			container: document.querySelector('#nav__content'),
			links: document.querySelector('#nav__content__links'),
			sections: {
				container: document.querySelector('#nav__content__sections'),
				titleSelector: 'nav__content__sections__title',
				linkSelector: 'nav__content__sections__link'
			},
		},

		routerParams: {
			container: document.querySelector('#main'),
			views: views,
			defaultState: { view: 'me', title: 'Me' }
		}
	});

	nav.attachEventListeners();
	await nav.initRouter();

	/* :: Service Worker... */
	if ('serviceWorker' in navigator) {

		try {
			const registration = await navigator.serviceWorker.register('./serviceWorker.js');
			console.log('Service Worker registration successful with scope: ', registration.scope);

		} catch (error) {
			console.log('Service Worker registration failed: ', error);
		}
	}
})();
