import Gallery from './gallery.js';

$(document).ready(() => {
	
	const galleryCont = $('.gallery[data-lightbox]');
	const lightboxCont = $('.lightbox');

	const gallery = new Gallery(galleryCont, lightboxCont);

	gallery.init();
});