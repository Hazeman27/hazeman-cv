export default class Router {

    constructor(params) {

        this.container = params.container;
        this.views = params.views;
        this.defaultState = params.defaultState;

        if (this.currentURLMatchesView())
            this.loadState({
                view: this.currentView(),
                title: this.capitalize(this.currentView())
            });
        
        else this.loadState(this.defaultState);

        window.addEventListener('popstate', (event) => {
			this.loadContent(event.state);
		});
    }

    loadState(state) {

        history.pushState(state, state.title, state.view);
        this.loadContent(state);
    }

    async loadContent(state) {

        const view = this.views[state.view];
        this.displayLoadingEffect();

        const response = await fetch(view.template);
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

    currentURLMatchesView() {
        return this.views.hasOwnProperty(
            this.currentView()    
        );
    }

    currentView() {
        return window.location.href.match(/[a-zA-Z]*$/)[0];
    }

    capitalize(string) {
        return `${string.charAt(0).toUpperCase()}${string.slice(1)}`;
    }
}