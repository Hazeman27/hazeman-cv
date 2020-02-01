import { setAttribute } from '../utils.js';

export default class NavController {

    constructor(parameters) {
        Object.assign(this, parameters);
    }

    initRouter() {
        this.router.init(this.current, this.content.sections, this.toggle.bind(this));
        return this;
    }

    setAriaHiddenAttribute() {

        if (this.isPastBreakpoint(this.breakpoint)) {    
            setAttribute('aria-hidden', new Map([
                [this.toggleButton, 'true'],
                [this.current, 'true'],
                [this.content.container, 'false']
            ]));
        }

        return this;
    }

    attachEventListeners() {

        this.container.addEventListener('click', (event) => {
            if (event.target === this.container && this.toggled() || this.toggleButton.contains(event.target))
                this.toggle();
        });

        for (const link of this.content.links.children) {
            
            link.addEventListener('click', async (event) => {
                
                event.preventDefault();
                
                await this.router.loadState({
                    view: NavController.getViewName(event.target.href),
                    title: event.target.textContent.trim()
                });
                
                this.toggle();
                event.target.blur();
            });
        }

        return this;
    }
    
    toggle() {

        if (this.isPastBreakpoint(this.breakpoint))
            return;
        
        console.log(this);

        if (this.toggled()) {
            document.body.style.overflowY = 'scroll';
            this.container.classList.remove(this.containerToggleClassName);
            this.content.container.classList.remove(this.contentToggleClassName);
            this.content.container.setAttribute('aria-hidden', 'true');
        } else {
            document.body.style.overflowY = 'hidden';
            this.container.classList.add(this.containerToggleClassName);
            this.content.container.classList.add(this.contentToggleClassName);
            this.content.container.setAttribute('aria-hidden', 'false');
        }
    }
    
    toggled() {
        return this.container.classList.contains(this.containerToggleClassName);
    }

    isPastBreakpoint() {
        return self.innerWidth > this.breakpoint;
    }

    static getViewName(href) {
        return href.match(/[a-zA-Z]*$/)[0];
    }
}