import Router from './router.js';
export default class Nav {
    constructor(params) {
        this.container = params.container;
        this.logo = params.logo;
        this.toggleButton = params.toggleButton;
        this.toggleContainerClassName = params.toggleContainerClassName;
        this.toggleContentClassName = params.toggleContentClassName;
        this.breakpoint = params.breakpoint;
        this.content = params.content;
        this.current = params.current;
        this.router = new Router(params.routerParams, this);
    }
    getContentSections() {
        return this.content.sections;
    }
    setCurrentTitle(title) {
        this.current.textContent = title;
    }
    attachEventListeners() {
        this.handleClick = this.handleClick.bind(this);
        this.switchView = this.switchView.bind(this);
        this.container.addEventListener('click', this.handleClick);
        for (const link of this.content.links.children)
            link.addEventListener('click', this.switchView);
        return this;
    }
    async initRouter() {
        await this.router.init();
        return this;
    }
    setAriaHiddenAttribute() {
        if (Nav.overBreakpoint(this.breakpoint)) {
            this.logo.setAttribute('aria-hidden', 'false');
            this.toggleButton.setAttribute('aria-hidden', 'true');
            this.current.setAttribute('aria-hidden', 'true');
            this.content.container.setAttribute('aria-hidden', 'false');
        }
        return this;
    }
    clickedAway(event) {
        return event.target === this.container && this.toggled;
    }
    toggleButtonClicked(event) {
        return this.toggleButton.contains(event.target);
    }
    handleClick(event) {
        if (this.clickedAway(event) || this.toggleButtonClicked(event))
            this.toggle();
    }
    toggle() {
        if (Nav.overBreakpoint(this.breakpoint))
            return;
        if (this.toggled) {
            document.body.style.overflowY = 'scroll';
            this.container.classList.remove(this.toggleContainerClassName);
            this.content.container.classList.remove(this.toggleContentClassName);
            this.content.container.setAttribute('aria-hidden', 'true');
            this.toggled = false;
        }
        else {
            document.body.style.overflowY = 'hidden';
            this.container.classList.add(this.toggleContainerClassName);
            this.content.container.classList.add(this.toggleContentClassName);
            this.content.container.setAttribute('aria-hidden', 'false');
            this.toggled = true;
        }
    }
    async switchView(event) {
        event.preventDefault();
        await this.router.loadState({
            view: Nav.getViewName(event.target.href),
            title: event.target.textContent
        });
        this.toggle();
        event.target.blur();
    }
    static overBreakpoint(breakpoint) {
        return window.innerWidth > breakpoint;
    }
    static getViewName(href) {
        return href.match(/[a-zA-Z]*$/)[0];
    }
}
//# sourceMappingURL=nav.js.map