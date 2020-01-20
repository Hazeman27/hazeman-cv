export default class Lightbox {
    constructor(params) {
        this.container = params.container;
        this.transitions = params.transitions;
        this.className = params.className;
        this.content = params.content;
        this.text = params.text;
        this.closeButton = params.closeButton;
        this.image = params.closeButton;
        this.title = params.title;
        this.description = params.description;
        this.mappedElements = params.mappedElements;
    }
    init() {
        this.closeButton.addEventListener('click', () => {
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
        this.clearContent();
        this.image = item.querySelector(this.mappedElements.image)
            .cloneNode(true);
        this.setClassName(this.image, 'image');
        this.setClassName(this.image.querySelector('img'), 'image');
        this.title = item.querySelector(this.mappedElements.title)
            .cloneNode(true);
        this.setClassName(this.title, 'title');
        this.description = item.querySelector(this.mappedElements.description)
            .cloneNode(true);
        this.setClassName(this.description, 'description');
        this.setContent();
        this.toggle(1);
    }
    setClassName(element, suffix) {
        element.className = `${this.className}__${suffix}`;
    }
    clearContent() {
        this.image.innerHTML = '';
        this.title.innerHTML = '';
        this.description.innerHTML = '';
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
//# sourceMappingURL=lightbox.js.map