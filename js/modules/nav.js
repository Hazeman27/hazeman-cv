export default class Nav {

	constructor(params) {
	
		this.toggleButton = params.toggleButton;
		this.content = params.content;
		this.links = this.content.querySelectorAll('a');

		this.router = params.router;

		this.rectangles = Array.from(
			this.toggleButton.firstElementChild.children
		);

		this.toggle = this.toggle.bind(this);
		this.switchView = this.switchView.bind(this);

		this.toggleButton.addEventListener('click', this.toggle);
		
		for (const link of this.links)
			link.addEventListener('click', this.switchView);
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

	switchView(event) {

		this.router.loadState({
			view: this.getViewName(event.target.href), 
			title: event.target.textContent
		});

		event.preventDefault();
		event.target.blur();
	}

	getViewName(href) {
        return href.match(/[a-zA-Z]*$/)[0];
    }
}