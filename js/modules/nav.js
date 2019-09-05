export default class Nav {

	constructor(params) {
		
		this.container = params.container;
		this.toggleButton = params.toggleButton;
		this.breakpoint = params.breakpoint;

		this.content = params.content;
		this.current = params.current;

		this.sidenav = this.content.container;
		this.sidenavFullSlideDistance = this.sidenav.clientWidth + 12;

		this.router = params.router;
		this.router.nav = this;

		this.sidenavTouchHandler =  new SidenavTouchHandler({
			nav: this,
			container: this.sidenav,
			fullSlideDistance: this.sidenavFullSlideDistance,
			currentTransformDistance: -this.sidenavFullSlideDistance
		});

		// :: Events

		this.handleClick = this.handleClick.bind(this);
		this.switchView = this.switchView.bind(this);

		this.container.addEventListener('click', this.handleClick);

		for (const link of this.content.links.children)
			link.addEventListener('click', this.switchView);
	}

	handleClick(event) {

		if (event.target === this.container) {

			if (this.toggled)
				this.toggle();

			return;
		}

		if (this.toggleButton.contains(event.target))
			this.toggle();
	}

	toggle() {

		console.log('toggle');

		if (this.onMobile()) {
		
			if (this.toggled) {

				this.container.classList.remove('nav__content--visible');

				this.sidenavTouchHandler.currentTransformDistance = -this.sidenavFullSlideDistance;
				this.toggled = false;
			}

			else {

				this.container.classList.add('nav__content--visible');

				this.sidenavTouchHandler.currentTransformDistance = 0;
				this.toggled = true;
			}
		}
	}

	switchView(event) {

		this.router.loadState({
			view: this.getViewName(event.target.href), 
			title: event.target.textContent
		});

		this.toggle();

		event.preventDefault();
		event.target.blur();
	}

	getViewName(href) {
        return href.match(/[a-zA-Z]*$/)[0];
	}

	onMobile() {
		return window.innerWidth <= this.breakpoint;
	}
}

class SidenavTouchHandler {

	constructor(params) {
		
		this.nav = params.nav;
		this.container = params.container;

		this.fullSlideDistance = params.fullSlideDistance;
		this.currentTransformDistance = params.currentTransformDistance;

		this.toggle = params.toggle;
		this.initialTransition = this.container.style.transition;

		this.handleStart = this.handleStart.bind(this);
		this.handleMove = this.handleMove.bind(this);
		this.handleEnd = this.handleEnd.bind(this);

		this.updateTransform = this.updateTransform.bind(this);

		document.body.addEventListener('touchstart', this.handleStart);
		document.body.addEventListener('touchmove', this.handleMove);
		document.body.addEventListener('touchend', this.handleEnd);
	}

	handleStart(event) {
		
		this.touchStartX = event.touches[0].clientX;
		this.touchStartY = event.touches[0].clientY;

		this.container.style.transition = 'none';
	}

	handleMove(event) {

		this.touchDeltaX = this.touchStartX - event.touches[0].clientX;
		this.touchDeltaY = this.touchStartY - event.touches[0].clientY;

		requestAnimationFrame(this.updateTransform);
	}

	updateTransform() {

		if (Math.abs(this.touchDeltaY) <= 20)

			this.container.style.transform = `translateX(${
				Math.min(0, this.currentTransformDistance - this.touchDeltaX)
			}px)`;
		
		else this.reset();
	}

	handleEnd() {

		this.container.style = this.initialTransition;

		if (this.openSlide() || this.closeSlide())
			this.nav.toggle();

		this.touchDeltaX = 0;
	}

	reset() {
		this.container.style = this.initialTransition;
		this.touchDeltaX = 0;
	}

	openSlide() {
		return !this.nav.toggled && this.touchDeltaX < 0 && this.crossedThreshold(Math.abs(this.touchDeltaX));
	}

	closeSlide() {
		return this.nav.toggled && this.crossedThreshold(this.touchDeltaX);
	}

	crossedThreshold(value) {
		return value >= this.container.clientWidth / 4;
	}
}