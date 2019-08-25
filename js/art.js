import Gallery from './gallery.js';

(() => {
    
    const galleries = document.querySelectorAll('.gallery[data-lightbox]');
    const lightbox = document.querySelector('.lightbox');

    new Gallery(galleries, lightbox).init();
})();
