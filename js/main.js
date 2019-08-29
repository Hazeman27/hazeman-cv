import Nav from './modules/nav.js';
import Router from './router.js';

(async () => {

	const modules = new Map([
		['nav', './modules/nav.html'],
		['footer', './modules/footer.html']
	]);

	for (const module of modules) {

		const response = await window.fetch(module[1]);
		const responseText = await response.text();

		document.querySelector(module[0]).innerHTML = responseText;
	}

	const navToggle = document.querySelector('#nav__toggle');
	const navContent = document.querySelector('#nav__content');

	const mainContainer = document.querySelector('#main');

	const views = {
		me: './views/me.html',
		art: './views/art.html',
		contact: './views/contact.html'
	}

	new Nav(
		navToggle, 
		navContent, 
		new Router(
			mainContainer, 
			views, 
			{ view: 'me', title: 'Me' }
		)
	);
})();
