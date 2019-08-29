export default class Router {

    constructor(params) {

        this.container = params.container;
        this.views = params.views;
        this.defaultState = params.defaultState;

        history.pushState(
            this.defaultState, 
            this.defaultState.title, 
            this.defaultState.view
        );

        this.load();
    }

    async load(state = this.defaultState) {

        this.displayLoadingEffect();

        const response = await fetch(this.views[state.view].template);
        const responseText = await response.text();

        this.container.innerHTML = responseText;
        this.importModule(state.view);

        this.listenToImagesLoad();
        document.title = state.title;
    }

    async importModule(view) {

        if (this.viewHasModule(view)) {

            const data = this.views[view].module;
            const module = await import(data.path);
            
            module[data.name]();
        }
    }

    listenToImagesLoad() {

        const images = document.querySelectorAll('img');
        let imagesLoaded = 0;

        for (const image of images)

            image.addEventListener('load', () => {

                imagesLoaded++;

                if (imagesLoaded == images.length) {
                    
                    this.hideLoadingEffect();
                    imagesLoaded = 0;
                }
            });
    }

    displayLoadingEffect() {

        document.body.setAttribute('data-loading', '');

        document.body.style.overflowY = 'hidden';
        document.body.style.cursor = 'wait';
    }

    hideLoadingEffect() {

        document.body.removeAttribute('data-loading');

        document.body.style.overflowY = 'scroll';
        document.body.style.cursor = 'default';
    }

    viewHasModule(view) {
        return this.views[view].hasOwnProperty('module');
    }
}