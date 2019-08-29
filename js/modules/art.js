import Gallery from './gallery.js';

export const Art = () => {
    
    const galleries = document.querySelectorAll('.gallery[data-lightbox]');
    const lightbox = document.querySelector('.lightbox');

    new Gallery(galleries, lightbox).init();
}
