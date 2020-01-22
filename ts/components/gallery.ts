import Lightbox from './lightbox.js';
import { GalleryParams } from '../interfaces';

export default class Gallery {

	private readonly containers: NodeListOf<HTMLElement>;
	private readonly itemClassName: string;
	private readonly lightbox: Lightbox;

	public constructor(params: GalleryParams) {

		this.containers = params.containers;
		this.itemClassName = params.itemClassName;
		this.lightbox = new Lightbox(params.lightboxParams);
	}

	public init() {

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