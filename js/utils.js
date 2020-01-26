export function capitalize(string) {
    return `${string[0].toUpperCase()}${string.slice(1)}`;
}

export function getViewName(href) {
    return href.match(/[a-zA-Z]*$/)[0];
}

export function getCurrentViewName() {
    return window.location.href.match(/[a-zA-Z]*$/)[0];
}

export function isPastBreakpoint(breakpoint) {
    return window.innerWidth > breakpoint;
}

export function setAttribute(attributeName, breakpoint, elements) {
    if (isPastBreakpoint(breakpoint))
        for (const [element, attributeValue] of elements)
            element.setAttribute(attributeName, attributeValue);
}

export function clearElementsInnerHTML() {
    for (const argument of arguments)
        argument.innerHTML = '';
}
