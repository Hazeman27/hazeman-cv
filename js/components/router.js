import { capitalize } from '../utils.js';

export default class Router {
    
    constructor(parameters, nav) {
        this.container = parameters.container;
        this.views = parameters.views;
        this.defaultState = parameters.defaultState;
        this.nav = nav;
    }
    
    static currentView() {
        return window.location.href.match(/[a-zA-Z]*$/)[0];
    }
    
    async init() {
        
        if (this.getView(Router.currentView())) {
            await this.loadState({
                view: Router.currentView(),
                title: capitalize(Router.currentView()),
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
        
        if (!state.firstLaunch && state.view === Router.currentView()) {
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
        
        this.importViewModule(state.view);
        this.loadViewNavigationSections(state.view);
        
        document.title = state.title;
        this.nav.setCurrentTitle(state.title);
    }
    
    async importViewModule(view) {
        if (this.viewHasModule(view)) {
            const module = await import(this.getView(view).module);
            module.boot();
        }
    }
    
    loadViewNavigationSections(view) {
        
        this.clearNavigationSections();
        
        if (!this.viewHasSections(view))
            return;
        
        const sections = this.getView(view).sections;
        const sectionsTitle = capitalize(view);
        const sectionsTitleElement = document.createElement('h3');
        
        sectionsTitleElement.classList.add(this.nav.getContentSections().titleSelector);
        sectionsTitleElement.textContent = sectionsTitle;
        
        this.nav.getContentSections()
            .container
            .appendChild(sectionsTitleElement);
        
        for (const [id, title] of sections) {
            
            const sectionTarget = document.querySelector(`#${id}`);
            const sectionLinkElement = document.createElement('a');
            
            sectionLinkElement.classList.add(this.nav.getContentSections().linkSelector);
            sectionLinkElement.textContent = title;
            
            this.nav.getContentSections()
                .container
                .appendChild(sectionLinkElement);
            
            sectionLinkElement.addEventListener('click', () => {
                this.nav.toggle();
                sectionTarget.scrollIntoView();
            });
        }
    }
    
    getView(viewName) {
        return this.views.find(view => view.name === viewName);
    }
    
    viewHasModule(view) {
        return this.getView(view).hasOwnProperty('module');
    }
    
    viewHasSections(view) {
        return this.getView(view).hasOwnProperty('sections');
    }
    
    clearNavigationSections() {
        this.nav.getContentSections().container.innerHTML = '';
    }
}