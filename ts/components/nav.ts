import Router from './router.js';
import {
	NavParamContent,
	NavParamContentSections,
	NavParams
} from '../interfaces';

export default class Nav {

	private readonly container: HTMLElement;
	private readonly toggleClassName: string;
	private readonly breakpoint: number;

	private toggleButton: HTMLButtonElement;
	private content: NavParamContent;
	private current: HTMLElement;
	private router: Router;
	private toggled: Boolean;

	public constructor(params: NavParams) {
		
		this.container = params.container;
		this.toggleButton = params.toggleButton;

		this.toggleClassName = params.toggleClassName;
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

	public async initRouter(): Promise<void> {
		return this.router.init();
	}

	public attachEventListeners(): void {

		this.handleClick = this.handleClick.bind(this);
		this.switchView = this.switchView.bind(this);

		this.container.addEventListener('click', this.handleClick);

		for (const link of this.content.links.children)
			link.addEventListener('click', this.switchView);
	}

	private handleClick(event: Event): void {

		if (event.target === this.container && this.toggled ||
			this.toggleButton.contains(event.target as HTMLElement))
			this.toggle();
	}

	public toggle(): void {

		if (this.onMobile()) {
		
			if (this.toggled) {

				document.body.style.overflowY = 'scroll';
				this.container.classList.remove(this.toggleClassName);
				this.toggled = false;

			} else {

				document.body.style.overflowY = 'hidden';
				this.container.classList.add(this.toggleClassName);
				this.toggled = true;
			}
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

	private onMobile(): Boolean {
		return window.innerWidth <= this.breakpoint;
	}

	private static getViewName(href): string {
		return href.match(/[a-zA-Z]*$/)[0];
	}
}