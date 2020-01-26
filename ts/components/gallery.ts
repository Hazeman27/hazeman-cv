import Lightbox from './lightbox.js';

export default function gallery(
	entries: NodeListOf<HTMLElement>,
	itemClassName: string,
	lightbox: Lightbox
) {
	
	lightbox.init();
	
	for (const entry of entries) {
		
		entry.addEventListener('click', (event: Event) => {
			
			const item: EventTarget = event.composedPath().find(e => {
				return (e as HTMLElement).className === itemClassName
			});
			
			if (item)
				lightbox.open(item as HTMLElement);
		});
	}
}