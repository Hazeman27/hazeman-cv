import Nav from './modules/nav.js';

(async () => {

	const components = new Map([
		['nav', './components/nav.html'],
		['footer', './components/footer.html']
	]);

	const views = {
		me: {
			template: './views/me.html'
		},

		art: {
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
				path: './modules/art.js'
			}
		},

		contact: {
			template: './views/contact.html'
		}
	};

	for (const component of components) {

		const response = await window.fetch(component[1]);
		document.querySelector(component[0]).innerHTML = await response.text();
	}

	new Nav({
		
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

	// :: Service Worker...

	(async () => {
		
		if ('serviceWorker' in navigator) {

			try {

				const registration = await navigator.serviceWorker.register('./serviceWorker.js');
				console.log('Service Worker registration successful with scope: ', registration.scope);

			} catch (error) {
				console.log('Service Worker registration failed: ', error);
			}
		}
	})();
})();
