import Nav from './nav.js';
import Gallery from './gallery.js';

$(document).ready(() => {

	const mainCont = $('#main');
	const galleryCont = $('.gallery');
	const lightboxCont = $('.lightbox');

	const navToggle = $('#nav__toggle');
	const navContent = $('#nav__content');
	const navBackground = $('#nav__background');

	const nav = new Nav(mainCont, navToggle, navContent, navBackground);
	const gallery = new Gallery(galleryCont, lightboxCont);

	nav.init();
	gallery.init();
});