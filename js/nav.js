class Nav {

	constructor(container, button, content, background) {

		this.container = container;
		this.button = button;
		this.content = content;
		this.background = background;
		this.firstSection = $('.section-wrapper:first-of-type').attr('id');
	}

	init() {

		this.button.click(() => {
			this.toggle();
		});

		this.content.parent().on('click', 'a', event => {

			if (event.target.getAttribute('href') != window.location.hash)
				this.scroll(event);
		});

		this.setHash(this.firstSection);
	}

	toggle() {

		if (this.toggled) {

			$(this.button).css({
				'transform': 'skewX(0deg)'
			});

			$(this.content).css({
				'transform': 'scale(1, 0)',
				'color': 'transparent'
			});
		
			this.toggled = false;
		}

		else {

			$(this.button).css({
				'transform': 'skewX(-12deg)'
			});

			$(this.content).css({
				'transform': 'scale(1, 1)',
				'color': 'inherit'
			});
		
			this.toggled = true;
		}
	}

	scroll(event) {

		event.preventDefault();

		const target = event.target.getAttribute('href');
		const current = window.location.hash;
		const offset = $(target).offset().left;
		
		this.setScrollbar('.section-wrapper', 'hidden');

		$(current).scrollTop() > 0 ?

			$(current).animate({ scrollTop: 0 }, 'slow', () => {
				this.slide(offset, target);
			})

		: this.slide(offset, target);
	}

	slide(offset, target) {

		this.toggleFooter(0);

		this.container.animate({
			scrollLeft: '+=' + offset
		}, 'slow', () => {

			console.log(this.container.scrollLeft());
			this.setHash(target);
			this.setScrollbar(target, 'scroll');
			this.appendFooter(target);
			this.toggleFooter(1);
		});
	}

	setScrollbar(selector, value) {
		$(selector).css('overflow-y', value);
	}

	setHash(hash) {
		window.location.hash = hash;	
	}

	appendFooter(section) {
		$('footer').appendTo($(section));
	}

	toggleFooter(opacity) {
		$('footer').animate({ opacity: opacity, height: 'toggle' });
	}
};

export default Nav;