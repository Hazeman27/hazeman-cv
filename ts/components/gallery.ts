import Lightbox from './lightbox.js';
import { GalleryParameters, LightboxParameters } from '../interfaces';

export default class Gallery {
	
	private readonly containers: NodeListOf<HTMLElement>;
	private readonly itemClassName: string;
	private readonly lightboxParams: LightboxParameters;
	private readonly lightbox: Lightbox;
	
	public constructor(parameters: GalleryParameters) {
		Object.assign(this, parameters);
		this.lightbox = new Lightbox(this.lightboxParams);
	}
	
	public init(): void {
		
		this.lightbox.init();
		
		for (const container of this.containers) {
			
			container.addEventListener('click', (event: Event) => {
				
				const item: EventTarget = event.composedPath().find(element => {
					return (element as HTMLElement).className === this.itemClassName;
				});
				
				if (item)
					this.lightbox.open(item as HTMLElement);
			});
		}
	}
};