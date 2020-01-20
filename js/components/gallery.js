import Lightbox from './lightbox.js';
export default class Gallery {
    constructor(params) {
        this.containers = params.containers;
        this.itemClassName = params.itemClassName;
        this.lightbox = new Lightbox(params.lightboxParams);
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
//# sourceMappingURL=gallery.js.map