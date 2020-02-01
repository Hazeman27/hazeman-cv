import { capitalize, clearElementsInnerHTML } from '../utils.js';

export default class Router {
    constructor(parameters) {
        Object.assign(this, parameters)
    }

    async init(navCurrent, navSections, navToggle) {

        this.navCurrent = navCurrent;
        this.navSections = navSections;
        this.navToggle = navToggle;
        
        if (this.getView(Router.getCurrentViewName())) {

            await this.loadState({
                view: Router.getCurrentViewName(),
                title: capitalize(Router.getCurrentViewName()),
                firstLaunch: true
            });

        } else {
            await this.loadState(this.defaultState);
        }

        self.addEventListener('popstate', async (event) => {
            await this.loadContent(event.state);
        });
    }

    async loadState(state) {

        if (!state.firstLaunch && state.view === Router.getCurrentViewName()) {
            this.container.scrollIntoView();
            return;
        }

        history.pushState(state, state.title, state.view);
        await this.loadContent(state);
    }

    async loadContent(state) {

        const view = this.getView(state.view);
        const response = await fetch(view.template);

        this.container.innerHTML = await response.text();
        this.container.scrollIntoView();

        if (view.hasOwnProperty('module')) {
            const module = await import(view.module);
            module.default();
        }

        this.loadViewNavSections(view);
        
        document.title = state.title;
        this.navCurrent.textContent = state.title;
    }

    loadViewNavSections(view) {
    
        clearElementsInnerHTML(this.navSections.container);
    
        if (!view.hasOwnProperty('sections'))
            return;
        
        this.navSections.container.appendChild(Object.assign(
            document.createElement('h3'), {
                className: this.navSections.titleSelector,
                textContent: capitalize(view.name)
            }
        ));
    
        for (const [id, title] of view.sections) {
    
            this.navSections.container.appendChild(Object.assign(
                document.createElement('a'), {
                    className: this.navSections.linkSelector,
                    textContent: title,
                    onclick: () => {
                        this.navToggle();
                        document.querySelector(id).scrollIntoView();
                    }
                }
            ));
        }
    }

    getView(viewName) {
        return this.views.find(view => view.name === viewName);
    }

    static getCurrentViewName() {
        return self.location.href.match(/[a-zA-Z]*$/)[0];
    }
}