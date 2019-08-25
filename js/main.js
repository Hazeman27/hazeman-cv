import Nav from './nav.js';

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

	new Nav(navToggle, navContent).init();
})();
