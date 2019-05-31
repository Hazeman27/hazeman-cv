class Gallery {

	constructor(container, lightbox) {

		this.container = container;
		this.items = Array.from(container.children);
		this.lightbox = new Lightbox(lightbox);
	}

	init() {

		this.lightbox.init();

		this.container.on('click', '.gallery__item', (event) => {
			this.lightbox.open(event.target);
		});
	}
};

class Lightbox {

	constructor(container) {

		this.container = container;
		this.className = container[0].className;

		this.contentCont = this.container.children('.' + this.className + '__content');
		this.textCont = this.container.children('.' + this.className + '__text');

		this.close = this.contentCont.children('.' + this.className + '__close');
		this.image = this.contentCont.children('.' + this.className + '__image');
		this.title = this.textCont.children('h2');
		this.descr = this.textCont.children('p');
	}

	init() {

		this.close.click(() => {
			this.toggle(0);
		});
	}

	open(item) {

		let className = '.' + item.className;

		let newImage = $(item).children(className + '__thumbnail').clone();
		let newTitle = $(item).children(className + '__title').clone();
		let newDescr = $(item).children(className + '__description').clone();

		this.setClassName(newImage[0], '__image');
		this.setClassName(newImage.children('img')[0], '__image');
		this.setClassName(newTitle[0], '__title');
		this.setClassName(newDescr[0], '__description');

		this.clearContent();

		this.image = newImage;
		this.title = newTitle;
		this.descr = newDescr;

		this.setContent();
		this.toggle(1);
	}

	setClassName(element, sufix) {
		element.className = this.className + sufix;
	}

	setContent() {

		this.image.appendTo(this.contentCont);
		this.title.appendTo(this.textCont);
		this.descr.appendTo(this.textCont);
	}

	clearContent() {

		this.image.remove();
		this.title.remove();
		this.descr.remove();
	}

	toggle(value) {

		value ?

			this.container.css({
				'transform': 'scale(1, '+ value + ')',
				'opacity': value,
				'transition': 'opacity var(--trans-normal) ease-in-out, transform 0ms linear 0ms'
			})

		:	this.container.css({
				'transform': 'scale(1, '+ value + ')',
				'opacity': value,
				'transition': 'opacity var(--trans-normal) ease-in-out, transform 0ms linear var(--trans-normal)'
			})
	}
}

export default Gallery;