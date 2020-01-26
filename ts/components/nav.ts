import Router from './router.js';
import { NavParameterContent, NavParameterContentSections, NavParameters, RouterParameters } from '../interfaces';

export default class Nav {
	
	private readonly container: HTMLElement;
	private readonly logo: HTMLAnchorElement;
	private readonly toggleContainerClassName: string;
	private readonly toggleContentClassName: string;
	private readonly breakpoint: number;
	private readonly toggleButton: HTMLButtonElement;
	private readonly content: NavParameterContent;
	private readonly current: HTMLElement;
	private readonly routerParams: RouterParameters;
	private readonly router: Router;
	
	private toggled: Boolean;
	
	public constructor(parameters: NavParameters) {
		Object.assign(this, parameters);
		this.router = new Router(this.routerParams, this);
	}
	
	private static overBreakpoint(breakpoint: number): Boolean {
		return window.innerWidth > breakpoint;
	}
	
	private static getViewName(href): string {
		return href.match(/[a-zA-Z]*$/)[0];
	}
	
	public getContentSections(): NavParameterContentSections {
		return this.content.sections;
	}
	
	public setCurrentTitle(title: string): void {
		this.current.textContent = title;
	}
	
	public attachEventListeners(): Nav {
		
		this.handleClick = this.handleClick.bind(this);
		this.switchView = this.switchView.bind(this);
		
		this.container.addEventListener('click', this.handleClick);
		
		for (const link of this.content.links.children)
			link.addEventListener('click', this.switchView);
		
		return this;
	}
	
	public async initRouter(): Promise<Nav> {
		await this.router.init();
		return this;
	}
	
	public setAriaHiddenAttribute(): Nav {
		
		if (Nav.overBreakpoint(this.breakpoint)) {
			
			this.logo.setAttribute('aria-hidden', 'false');
			this.toggleButton.setAttribute('aria-hidden', 'true');
			this.current.setAttribute('aria-hidden', 'true');
			this.content.container.setAttribute('aria-hidden', 'false');
		}
		
		return this;
	}
	
	public toggle(): void {
		
		if (Nav.overBreakpoint(this.breakpoint))
			return;
		
		if (this.toggled) {
			
			document.body.style.overflowY = 'scroll';
			this.container.classList.remove(this.toggleContainerClassName);
			
			this.content.container.classList.remove(
				this.toggleContentClassName
			);
			
			this.content.container.setAttribute('aria-hidden', 'true');
			this.toggled = false;
			
		} else {
			
			document.body.style.overflowY = 'hidden';
			this.container.classList.add(this.toggleContainerClassName);
			
			this.content.container.classList.add(
				this.toggleContentClassName
			);
			
			this.content.container.setAttribute('aria-hidden', 'false');
			this.toggled = true;
		}
	}
	
	private clickedAway(event: Event): Boolean {
		return event.target === this.container && this.toggled;
	}
	
	private toggleButtonClicked(event: Event): Boolean {
		return this.toggleButton.contains(event.target as HTMLElement);
	}
	
	private handleClick(event: Event): void {
		
		if (this.clickedAway(event) || this.toggleButtonClicked(event))
			this.toggle();
	}
	
	private async switchView(event): Promise<void> {
		
		event.preventDefault();
		
		await this.router.loadState({
			view: Nav.getViewName(event.target.href),
			title: event.target.textContent.trim()
		});
		
		this.toggle();
		event.target.blur();
	}
}