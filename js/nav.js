class Nav {

	constructor(button, content) {
	
		this.button = button;
		this.content = content;
		this.rectangles = Array.from($(this.button).children('svg').children());
	}

	init() {

		this.button.click(() => {
			this.toggle();
		});
	}

	toggle() {

		this.toggled ? (

			$(this.rectangles).css({
				'transform': 'initial' 
			}),

			$(this.content).css({
				'transform': 'scale(1, 0)',
				'color': 'transparent'
			}),
		
			this.toggled = false
		)

		: (

			$(this.rectangles[0]).add(this.rectangles[2]).css({
				'transform': 'translateX(10px)' 
			}),

			$(this.rectangles[1]).css({
				'transform': 'translateX(-10px)' 
			}),

			$(this.content).css({
				'transform': 'scale(1, 1)',
				'color': 'inherit'
			}),
		
			this.toggled = true
		)
	}
};

export default Nav;