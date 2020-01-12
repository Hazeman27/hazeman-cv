export default class Gallery {

	constructor(params) {

		this.containers = params.containers;
		this.itemClassName = params.itemClassName;

		this.lightbox = new Lightbox(params.lightboxParams);
	}

	init() {

		this.lightbox.init();

		for (const container of this.containers) {

			container.addEventListener('click', (event) => {
				
				const item = event.composedPath().find(element => {
					return element.className === this.itemClassName;
				});

				if (item) this.lightbox.open(item);
			});
		}
	}
};

// :: Lightbox ::

class Lightbox {

	constructor(params) {

		this.container = params.container;
		this.transitions = params.transitions;

		this.className = params.className;

		this.elements = params.elements;
		this.mappedElements = params.mappedElements;

		for (const [key, value] of this.elements)
			this[key] = document.querySelector(value);
	}

	init() {

		this.close.addEventListener('click', () => {
			this.toggle(0);
		});

		document.body.addEventListener('keydown', (event) => {
			
			if (event.key === 'Escape')
				this.toggle(0);
		});

		document.body.addEventListener('click', (event) => {

			if (event.target === this.container)
				this.toggle();
		});
	}

	open(item) {

		for (const [key, value] of this.mappedElements) {
		
			const element = item.querySelector(value).cloneNode(true);
			this.setClassName(element, key);

			if (key === 'image') 
				this.setClassName(element.querySelector('img'), key);
		
			this[key].innerHTML = element.innerHTML;
		}

		this.setContent();
		this.toggle(1);
	}

	setClassName(element, suffix) {
		element.className = `${this.className}__${suffix}`;
	}

	setContent() {

		this.content.appendChild(this.image);
		this.text.appendChild(this.title);
		this.text.appendChild(this.description);
	}

	toggle(value = 0) {

		this.container.style.transform = `scale(1, ${value})`;
		this.container.style.opacity = value.toString();

		if (value)
			this.container.style.transition = this.transitions.show;
		
		else
			this.container.style.transition = this.transitions.hide;
	}
}