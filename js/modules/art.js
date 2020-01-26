import gallery from '../components/gallery.js';
import Lightbox from '../components/lightbox.js';

export const boot = () => {
    gallery(document.querySelectorAll('.gallery[data-lightbox]'), 'gallery__item', new Lightbox({
        container: document.querySelector('.lightbox'),
        className: 'lightbox',
        content: document.querySelector('.lightbox__content'),
        text: document.querySelector('.lightbox__text'),
        closeButton: document.querySelector('.lightbox__close'),
        image: document.querySelector('.lightbox__image'),
        title: document.querySelector('.lightbox__text h2'),
        description: document.querySelector('.lightbox__text p'),
        mappedElements: {
            image: '.gallery__item__thumbnail',
            title: '.gallery__item__title',
            description: '.gallery__item__description'
        },
        transitions: {
            show: 'opacity var(--trans-normal) ease-in-out, transform 0ms linear 0ms',
            hide: 'opacity var(--trans-normal) ease-in-out, transform 0ms linear var(--trans-normal)'
        }
    }));
};
