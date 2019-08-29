export default class Router {

    constructor(params) {

        this.container = params.container;
        this.views = params.views;
        this.modules = params.modules;
        this.defaultState = params.defaultState;

        history.pushState(
            this.defaultState, 
            this.defaultState.title, 
            this.defaultState.view
        );

        this.load();
    }

    async load(state = this.defaultState) {

        const response = await fetch(this.views[state.view]);
        const responseText = await response.text();

        this.container.innerHTML = responseText;
        this.importModule(state);

        document.title = state.title;
    }

    async importModule(state) {

        if (this.modules.hasOwnProperty(state.view)) {

            const module = await import(`./modules/${state.view}.js`);
            module[state.title]();
        }
    }
}