import Gallery from './gallery.js';

export const Art = () => {
 
    new Gallery({
            
        containers: document.querySelectorAll('.gallery[data-lightbox]'),
        itemClassName: 'gallery__item',

        lightboxParams: {

            container: document.querySelector('.lightbox'),
            className: 'lightbox',

            elements: new Map([
                ['content',		'.lightbox__content'],
                ['text', 		'.lightbox__text'],
                ['close', 		'.lightbox__close'],
                ['image', 		'.lightbox__image'],
                ['title', 		'.lightbox__text h2'],
                ['description', '.lightbox__text p']
            ]),

            mappedElements: new Map([
                ['image',		'.gallery__item__thumbnail'],
                ['title',		'.gallery__item__title'],
                ['description',	'.gallery__item__description'],
            ]),

            transitions: {
                show: 'opacity var(--trans-normal) ease-in-out, transform 0ms linear 0ms',
                hide: 'opacity var(--trans-normal) ease-in-out, transform 0ms linear var(--trans-normal)'
            }
        }
    }).init();
};
