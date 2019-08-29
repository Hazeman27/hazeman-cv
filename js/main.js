import Nav from './modules/nav.js';
import Router from './router.js';

(async () => {

	const components = new Map([
		['nav', './components/nav.html'],
		['footer', './components/footer.html']
	]);

	for (const component of components) {

		const response = await window.fetch(component[1]);
		const responseText = await response.text();

		document.querySelector(component[0]).innerHTML = responseText;
	}

	const navToggle = document.querySelector('#nav__toggle');
	const navContent = document.querySelector('#nav__content');

	const mainContainer = document.querySelector('#main');

	const views = {
		me: './views/me.html',
		art: './views/art.html',
		contact: './views/contact.html'
	}

	const modules = {
		art: './modules/art.js'
	}

	new Nav(
		navToggle, 
		navContent, 
		new Router({
			container: mainContainer, 
			views: views, 
			modules: modules,
			defaultState: { view: 'me', title: 'Me' }
		})
	);
})();
