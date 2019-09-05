export default class Router {

    constructor(params) {

        this.container = params.container;
        this.views = params.views;
        this.defaultState = params.defaultState;

        if (this.currentURLMatchesView())
            this.loadState({
                view: this.currentView(),
                title: this.capitalize(this.currentView()),
                firstLaunch: true
            });
        
        else this.loadState(this.defaultState);

        window.addEventListener('popstate', (event) => {
			this.loadContent(event.state);
		});
    }

    loadState(state) {

        if (!state.firstLaunch && state.view == this.currentView()) {

            this.container.scrollIntoView();
            return;
        }

        history.pushState(state, state.title, state.view);
        this.loadContent(state);
    }

    async loadContent(state) {

        const view = this.views[state.view];

        this.displayLoadingEffect();

        const response = await fetch(view.template);
        const responseText = await response.text();

        this.container.innerHTML = responseText;
        this.container.scrollIntoView();

        this.importViewModule(state.view);
        this.loadViewNavigationSections(state.view);

        this.listenToImagesLoad();

        document.title = state.title;
        this.nav.current.textContent = state.title;       
    }

    async importViewModule(view) {

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

    loadViewNavigationSections(view) {

        if (this.viewHasSections(view)) {

            this.clearNavigationSections();

            const sections = this.views[view].sections;

            const sectionsTitle = this.capitalize(view);
            const sectionsTitleElement = document.createElement('h3');

            sectionsTitleElement.id = 'nav__content__sections__title';
            sectionsTitleElement.textContent = sectionsTitle;

            this.nav.content.sections.appendChild(sectionsTitleElement);

            for (const section of sections) {

                const sectionTarget = document.querySelector(`#${section[0]}`);
                const sectionElement = document.createElement('a');

                sectionElement.className = 'nav__content__sections__link';
                sectionElement.textContent = section[1];

                this.nav.content.sections.appendChild(sectionElement);

                sectionElement.addEventListener('click', () => {

                    this.nav.toggle();
                    sectionTarget.scrollIntoView();
                });
            }
        }

        else {
            this.clearNavigationSections();
        }
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

    viewHasSections(view) {
        return this.views[view].hasOwnProperty('sections');
    }

    clearNavigationSections() {
        this.nav.content.sections.innerHTML = '';
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