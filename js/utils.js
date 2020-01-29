export function capitalize(string) {
    return `${string[0].toUpperCase()}${string.slice(1)}`;
}

export function getViewName(href) {
    return href.match(/[a-zA-Z]*$/)[0];
}

export function getCurrentViewName() {
    return self.location.href.match(/[a-zA-Z]*$/)[0];
}

export function isPastBreakpoint(breakpoint) {
    return self.innerWidth > breakpoint;
}

export function setAttribute(attributeName, elements) {
    for (const [element, attributeValue] of elements)
        element.setAttribute(attributeName, attributeValue);
}

export function clearElementsInnerHTML() {
    for (const argument of arguments)
        argument.innerHTML = '';
}