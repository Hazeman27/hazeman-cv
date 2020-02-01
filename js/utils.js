export function capitalize(string) {
    return `${string[0].toUpperCase()}${string.slice(1)}`;
}

export function setAttribute(attributeName, elements) {
    for (const [element, attributeValue] of elements)
        element.setAttribute(attributeName, attributeValue);
}

export function clearElementsInnerHTML() {
    for (const argument of arguments)
        argument.innerHTML = '';
}