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

        // this.animateContent(responseText);
    }

    async importModule() {

        try {

            const Module = await import(`./modules/${this.state.view}.js`);
            Module[this.state.title]();

        } catch (error) {
            console.log(error.message);
        }
    }

    animateContent(responseText, containerOpacityModifier = 5) {

        let opacity = 100;

        let fadeOutAnimationRequest = null;
        let fadeInAnimationRequest = null;

        const modifyContainerOpacity = (modifier) => {

            this.container.style.opacity = opacity / 100;
            opacity += modifier;
        }

        const fadeOut = () => {

            if (opacity <= 0) {
                
                this.updateContent(responseText);
                cancelAnimationFrame(fadeOutAnimationRequest);

                fadeInAnimationRequest = requestAnimationFrame(fadeIn);
                return;
            }

            modifyContainerOpacity(containerOpacityModifier * -1);
            requestAnimationFrame(fadeOut);
        };
    
        const fadeIn = () => {
            
            if (opacity >= 100 + containerOpacityModifier) {

                cancelAnimationFrame(fadeInAnimationRequest);
                return;
            }

            modifyContainerOpacity(containerOpacityModifier);
            requestAnimationFrame(fadeIn);
        };

        fadeOutAnimationRequest = requestAnimationFrame(fadeOut);
    }

    updateContent(responseText) {

        this.container.innerHTML = responseText;
        this.importModule();
    }
}