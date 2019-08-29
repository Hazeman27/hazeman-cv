export default class Nav {

	constructor(button, content, router) {
	
		this.button = button;
		this.content = content;
		this.links = this.content.querySelectorAll('a');

		this.router = router;

		this.rectangles = Array.from(
			this.button.firstElementChild.children
		);

		this.toggle = this.toggle.bind(this);
		this.switchView = this.switchView.bind(this);

		this.button.addEventListener('click', this.toggle);
		
		for (const link of this.links)
			link.addEventListener('click', this.switchView);

		window.addEventListener('popstate', (event) => {
			this.router.load(event.state);
		});
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

		const state = {
			view: this.getViewName(event.target.href), 
			title: event.target.textContent
		};

		history.pushState(state, state.title, state.view);
		this.router.load(state);

		event.preventDefault();
		event.target.blur();
	}

	getViewName(href) {
        return href.match(/[a-zA-Z]*$/)[0];
    }
}