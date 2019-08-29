export default class Router {

    constructor(container, views, defaultState) {

        this.container = container;
        this.views = views;
        this.defaultState = defaultState;

        history.pushState(
            defaultState, 
            defaultState.title, 
            defaultState.view
        );

        this.load();
    }

    async load(state = this.defaultState) {

        const response = await fetch(this.views[state.view]);
        const responseText = await response.text();

        this.container.innerHTML = responseText;
        this.importModule(state);
    }

    async importModule(state) {

        try {

            const Module = await import(`./modules/${state.view}.js`);
            Module[state.title]();

        } catch (error) {
            console.log(error.message);
        }
    }
}