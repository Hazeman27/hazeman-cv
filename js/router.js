export default class Router {

    constructor(container, views, state) {

        this.container = container;
        this.views = views;
        this.state = state;

        this.load();
    }

    async load() {

        history.pushState(this.state, this.state.title, this.state.view);

        const response = await fetch(this.views[this.state.view]);
        const responseText = await response.text();

        this.container.innerHTML = responseText;
        this.importModule();
    }

    async importModule() {

        try {

            const Module = await import(`./modules/${this.state.view}.js`);
            Module[this.state.title]();

        } catch (error) {
            console.log(error.message);
        }
    }
}