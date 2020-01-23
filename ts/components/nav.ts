import Router from './router.js';
import {
	NavParamContent,
	NavParamContentSections,
	NavParams
} from '../interfaces';

export default class Nav {

	private readonly container: HTMLElement;
	private readonly logo: HTMLAnchorElement;
	private readonly toggleContainerClassName: string;
	private readonly toggleContentClassName: string;
	private readonly breakpoint: number;
	private readonly toggleButton: HTMLButtonElement;
	private readonly content: NavParamContent;
	private readonly current: HTMLElement;
	private readonly router: Router;

	private toggled: Boolean;

	public constructor(params: NavParams) {
		
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

	public getContentSections(): NavParamContentSections {
		return this.content.sections;
	}

	public setCurrentTitle(title: string): void {
		this.current.textContent = title;
	}

	public attachEventListeners(): void {

		this.handleClick = this.handleClick.bind(this);
		this.switchView = this.switchView.bind(this);

		this.container.addEventListener('click', this.handleClick);

		for (const link of this.content.links.children)
			link.addEventListener('click', this.switchView);
	}

	public async initRouter(): Promise<void> {
		return this.router.init();
	}

	public setAriaHiddenAttribute() {

		if (this.onDesktop()) {

			this.logo.setAttribute('aria-hidden', 'false');
			this.toggleButton.setAttribute('aria-hidden', 'true');
			this.current.setAttribute('aria-hidden', 'true');
			this.content.container.setAttribute('aria-hidden', 'false');
		}
	}

	private handleClick(event: Event): void {

		if (event.target === this.container && this.toggled ||
			this.toggleButton.contains(event.target as HTMLElement))
			this.toggle();
	}

	public toggle(): void {

		if (this.onDesktop())
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

	private async switchView(event): Promise<void> {
		
		event.preventDefault();
		
		await this.router.loadState({
			view: Nav.getViewName(event.target.href),
			title: event.target.textContent
		});

		this.toggle();
		event.target.blur();
	}

	private onDesktop(): Boolean {
		return window.innerWidth > this.breakpoint;
	}

	private static getViewName(href): string {
		return href.match(/[a-zA-Z]*$/)[0];
	}
}