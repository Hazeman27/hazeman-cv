import Lightbox from './lightbox.js';
export default class Gallery {
    constructor(parameters) {
        Object.assign(this, parameters);
        this.lightbox = new Lightbox(this.lightboxParams);
    }
    init() {
        this.lightbox.init();
        for (const container of this.containers) {
            container.addEventListener('click', (event) => {
                const item = event.composedPath().find(element => {
                    return element.className === this.itemClassName;
                });
                if (item)
                    this.lightbox.open(item);
            });
        }
    }
}
;
