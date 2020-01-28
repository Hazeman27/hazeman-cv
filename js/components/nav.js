import { getViewName, isPastBreakpoint, setAttribute } from '../utils.js';

export default function nav(
    container,
    toggleButton,
    current,
    toggleContainerClassName,
    toggleContentClassName,
    breakpoint,
    content,
    router
) {
    router.init(current, content.sections, toggle);
    
    setAttribute('aria-hidden', breakpoint, new Map([
        [toggleButton, 'true'],
        [current, 'true'],
        [content.container, 'false']
    ]));
    
    container.addEventListener('click', (event) => {
        if (event.target === container && toggled() || toggleButton.contains(event.target))
            toggle();
    });
    
    for (const link of content.links.children)
        link.addEventListener('click', async (event) => {
            event.preventDefault();
            await router.loadState({
                view: getViewName(event.target.href),
                title: event.target.textContent.trim()
            });
            toggle();
            event.target.blur();
        });
    
    function toggle() {
        if (isPastBreakpoint(breakpoint))
            return;
        
        if (toggled()) {
            document.body.style.overflowY = 'scroll';
            container.classList.remove(toggleContainerClassName);
            content.container.classList.remove(toggleContentClassName);
            content.container.setAttribute('aria-hidden', 'true');
        } else {
            document.body.style.overflowY = 'hidden';
            container.classList.add(toggleContainerClassName);
            content.container.classList.add(toggleContentClassName);
            content.container.setAttribute('aria-hidden', 'false');
        }
    }
    
    function toggled() {
        return container.classList.contains(toggleContainerClassName);
    }
}