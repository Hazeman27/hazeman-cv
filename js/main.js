import Nav from './nav.js';

$(document).ready(() => {

	$('nav').load('../modules/nav.html', () => {

		const navToggle = $('#nav__toggle');
		const navContent = $('#nav__content');

		const nav = new Nav(navToggle, navContent);

		nav.init();
	});

	$('footer').load('../modules/footer.html');
});