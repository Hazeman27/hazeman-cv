export default class Nav {

	constructor(button, content) {
	
		this.button = button;
		this.content = content;
		this.rectangles = Array.from(
			this.button.firstElementChild.children
		);
	}

	init() {
		
		this.toggle = this.toggle.bind(this);
		this.button.addEventListener('click', this.toggle);
	}

	toggle() {

		if (this.toggled) {

			for (const rectangle of this.rectangles)
				rectangle.style.transform = 'initial';

			this.content.style.transform = 'scale(1, 0)';
			this.content.style.color = 'transparent';
		
			this.toggled = false;
		}

		else {

			this.rectangles[0].style.transform = 'translateX(10px)';
			this.rectangles[1].style.transform = 'translateX(-10px)';
			this.rectangles[2].style.transform = 'translateX(10px)';

			this.content.style.transform = 'scale(1, 1)';
			this.content.style.color = 'inherit';
		
			this.toggled = true;
		}
	}
}