import { LightboxParameterMappedElements, LightboxParameters, LightboxParameterTransitions } from '../interfaces';

export default class Lightbox {
	
	private readonly container: HTMLElement;
	private readonly transitions: LightboxParameterTransitions;
	private readonly className: string;
	private readonly mappedElements: LightboxParameterMappedElements;
	
	private content: HTMLElement;
	private text: HTMLElement;
	private closeButton: HTMLButtonElement;
	private image: HTMLPictureElement;
	private title: HTMLHeadingElement;
	private description: HTMLParagraphElement;
	
	public constructor(parameters: LightboxParameters) {
		Object.assign(this, parameters);
	}
	
	public init(): void {
		
		this.closeButton.addEventListener('click', () => {
			this.toggle(0);
		});
		
		document.body.addEventListener('keydown', (event: KeyboardEvent) => {
			if (event.key === 'Escape')
				this.toggle(0);
		});
		
		document.body.addEventListener('click', (event: Event) => {
			if (event.target === this.container)
				this.toggle();
		});
	}
	
	public open(item: HTMLElement): void {
		
		this.clearContent();
		
		this.image = item.querySelector(this.mappedElements.image)
		                 .cloneNode(true) as HTMLPictureElement;
		
		this.setClassName(this.image, 'image');
		this.setClassName(this.image.querySelector('img'), 'image');
		
		this.title = item.querySelector(this.mappedElements.title)
		                 .cloneNode(true) as HTMLHeadingElement;
		
		this.setClassName(this.title, 'title');
		
		this.description = item.querySelector(this.mappedElements.description)
		                       .cloneNode(true) as HTMLParagraphElement;
		
		this.setClassName(this.description, 'description');
		
		this.setContent();
		this.toggle(1);
	}
	
	private setClassName(element, suffix): void {
		element.className = `${this.className}__${suffix}`;
	}
	
	private clearContent(): void {
		
		this.image.innerHTML = '';
		this.title.innerHTML = '';
		this.description.innerHTML = '';
	}
	
	private setContent(): void {
		
		this.content.appendChild(this.image);
		this.text.appendChild(this.title);
		this.text.appendChild(this.description);
	}
	
	private toggle(value: number = 0): void {
		
		this.container.style.transform = `scale(1, ${value})`;
		this.container.style.opacity = value.toString();
		
		if (value)
			this.container.style.transition = this.transitions.show;
		
		else
			this.container.style.transition = this.transitions.hide;
	}
}