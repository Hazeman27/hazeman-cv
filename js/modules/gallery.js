export default class Gallery {

	constructor(galleries, lightbox) {

		this.galleries = galleries;
		this.items = new Array;

		this.galleries.forEach(gallery => this.items.push(
			Array.from(gallery.children)
		));
		
		this.items = this.items.flat();
		this.lightbox = new Lightbox(lightbox);
	}

	init() {

		this.lightbox.init();

		this.galleries.forEach(gallery => gallery.addEventListener('click', (event) => {
			this.lightbox.open(event.target);
		}));
	}
};

// :: Lightbox ::

class Lightbox {

	constructor(container) {

		this.container = container;
		this.name = container.className;

		this.classNames = new Map([
			['content',		`.${this.name}__content`],
			['text', 		`.${this.name}__text`],
			['close', 		`.${this.name}__close`],
			['image', 		`.${this.name}__image`],
			['title', 		`.${this.name}__text h2`],
			['description', `.${this.name}__text p`]
		]);

		this.classNames.forEach((value, key) => {
			this[key] = document.querySelector(value);
		});
	}

	init() {

		this.close.addEventListener('click', () => {
			this.toggle(0);
		});

		document.body.addEventListener('keydown', (event) => {
			
			if (event.key === 'Escape')
				this.toggle(0);
		});
	}

	open(item) {

		const name = item.className;

		const classNames = new Map([
			['image',		`.${name}__thumbnail`],
			['title',		`.${name}__title`],
			['description',	`.${name}__description`],
		]);

		try {

			classNames.forEach((value, key) => {

				const element = item.querySelector(value).cloneNode(true);
				this.setClassName(element, key);

				if (key === 'image') 
					this.setClassName(element.querySelector('img'), key);
				
				this[key].remove();
				this[key] = element;
			});

			this.setContent();
			this.toggle(1);

		} catch (error) {
				
			if (error.message === 'Cannot read property \'cloneNode\' of null')
				console.log('Oops! Seems you have missed that thumbnail. Try hitting inbetween texts...');
		}
	}

	setClassName(element, suffix) {
		element.className = `${this.name}__${suffix}`;
	}

	setContent() {

		this.content.appendChild(this.image);
		this.text.appendChild(this.title);
		this.text.appendChild(this.description);
	}

	toggle(value = 0) {

		this.container.style.transform = `scale(1, ${value})`;
		this.container.style.opacity = value;

		if (value)
			this.container.style.transition = 
				'opacity var(--trans-normal) ease-in-out, transform 0ms linear 0ms';
		
		else
			this.container.style.transition = 
				'opacity var(--trans-normal) ease-in-out, transform 0ms linear var(--trans-normal)';
	}
}