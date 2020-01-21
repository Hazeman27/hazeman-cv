import Nav from './nav.js';
import {
    State,
    View,
    ViewModule,
    ViewModuleData
} from '../interfaces';

export default class Router {

    private readonly views: Array<View>;
    private readonly defaultState: State;

    private container: HTMLElement;
    private nav: Nav;

    public constructor(params, nav) {

        this.container = params.container;
        this.views = params.views;
        this.defaultState = params.defaultState;
        this.nav = nav;
    }

    public async init(): Promise<void> {

        if (this.getView(Router.currentView())) {

            await this.loadState({
                view: Router.currentView(),
                title: Router.capitalize(Router.currentView()),
                firstLaunch: true
            });
        }

        else await this.loadState(this.defaultState);

        window.addEventListener('popstate', (event) => {
            this.loadContent(event.state);
        });
    }

    public async loadState(state: State): Promise<void> {

        if (!state.firstLaunch && state.view === Router.currentView()) {

            this.container.scrollIntoView();
            return;
        }

        history.pushState(state, state.title, state.view);
        this.loadContent(state);
    }

    private async loadContent(state): Promise<void> {

        const view = this.getView(state.view);
        Router.displayLoadingEffect();

        const response = await fetch(view.template);

        this.container.innerHTML = await response.text();
        this.container.scrollIntoView();

        this.importViewModule(state.view);
        this.loadViewNavigationSections(state.view);
        this.listenToImagesLoad();

        document.title = state.title;
        this.nav.setCurrentTitle(state.title);
    }

    private async importViewModule(view): Promise<void> {

        if (this.viewHasModule(view)) {

            const data: ViewModuleData = this.getView(view).module;
            const importObject: ViewModule = await import(data.path);

            importObject.module.boot();
        }
    }

    private listenToImagesLoad(): void {

        const images: NodeListOf<HTMLImageElement> =
            document.querySelectorAll('img');

        let imagesLoaded: number = 0;

        for (const image of images) {

            image.addEventListener('load', () => {

                imagesLoaded++;

                if (imagesLoaded === images.length)
                    Router.hideLoadingEffect();
            });
        }
    }

    private loadViewNavigationSections(view): void {

        this.clearNavigationSections();

        if (!this.viewHasSections(view)) {
            return;
        }

        const sections: Map<string, string> =  this.getView(view).sections;
        const sectionsTitle: string = Router.capitalize(view);

        const sectionsTitleElement: HTMLHeadingElement =
            document.createElement('h3');

        sectionsTitleElement.id = this.nav.getContentSections().titleSelector;
        sectionsTitleElement.textContent = sectionsTitle;

        this.nav.getContentSections()
            .container
            .appendChild(sectionsTitleElement);

        for (const [id, title] of sections) {

            const sectionTarget: HTMLElement =
                document.querySelector(`#${id}`);

            const sectionLinkElement: HTMLAnchorElement =
                document.createElement('a');

            sectionLinkElement.className =
                this.nav.getContentSections().linkSelector;

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

    private getView(viewName: string): View {
        return this.views.find(view => view.name === viewName);
    }

    private viewHasModule(view): Boolean {
        return this.getView(view).hasOwnProperty('module');
    }

    private viewHasSections(view): Boolean {
        return this.getView(view).hasOwnProperty('sections');
    }

    private clearNavigationSections(): void {
        this.nav.getContentSections().container.innerHTML = '';
    }

    private static currentView(): string {
        return window.location.href.match(/[a-zA-Z]*$/)[0];
    }

    private static capitalize(string): string {
        return `${string[0].toUpperCase()}${string.slice(1)}`;
    }

    private static displayLoadingEffect(): void {

        document.body.setAttribute('data-loading', '');
        document.body.style.overflowY = 'hidden';
        document.body.style.cursor = 'wait';
    }

    private static hideLoadingEffect(): void {

        document.body.removeAttribute('data-loading');
        document.body.style.overflowY = 'scroll';
        document.body.style.cursor = 'default';
    }
}