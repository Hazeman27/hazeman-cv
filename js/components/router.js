import {
    capitalize,
    clearElementsInnerHTML,
    getCurrentViewName
} from '../utils.js';

export default class Router {
    constructor(parameters) {
        Object.assign(this, parameters)
    }

    async init(navCurrent, navContentSections, navToggle) {
        this.navCurrent = navCurrent;
        this.navContentSections = navContentSections;
        this.navToggle = navToggle;
        
        if (this.getView(getCurrentViewName())) {
            await this.loadState({
                view: getCurrentViewName(),
                title: capitalize(getCurrentViewName()),
                firstLaunch: true
            });
        } else {
            await this.loadState(this.defaultState);
        }

        window.addEventListener('popstate', async (event) => {
            await this.loadContent(event.state);
        });
    }

    async loadState(state) {

        if (!state.firstLaunch && state.view === getCurrentViewName()) {
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

        this.loadViewNavigationSections(view);
        
        document.title = state.title;
        this.navCurrent.textContent = state.title;
    }

    loadViewNavigationSections(view) {
    
        clearElementsInnerHTML(this.navContentSections.container);
    
        if (!view.hasOwnProperty('sections'))
            return;
        
        const sections = view.sections;
        const sectionsTitle = capitalize(view.name);
        const sectionsTitleElement = document.createElement('h3');

        sectionsTitleElement.classList.add(this.navContentSections.titleSelector);
        sectionsTitleElement.textContent = sectionsTitle;

        this.navContentSections.container.appendChild(sectionsTitleElement);

        for (const [id, title] of sections) {

            const sectionTarget = document.querySelector(`#${id}`);
            const sectionLinkElement = document.createElement('a');

            sectionLinkElement.classList.add(this.navContentSections.linkSelector);
            sectionLinkElement.textContent = title;

            this.navContentSections.container.appendChild(sectionLinkElement);

            sectionLinkElement.addEventListener('click', () => {
                this.navToggle();
                sectionTarget.scrollIntoView();
            });
        }
    }

    getView(viewName) {
        return this.views.find(view => view.name === viewName);
    }
}