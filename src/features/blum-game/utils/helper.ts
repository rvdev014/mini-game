export function getCustomProperty(element: any, prop: string) {
    return parseFloat(getComputedStyle(element).getPropertyValue(prop)) || 0;
}

export function setCustomProperty(element: any, prop: string, value: number|string) {
    element.style.setProperty(prop, value);
}

export function incrementCustomProperty(element: any, prop: string, incrementValue: number) {
    setCustomProperty(
        element,
        prop,
        getCustomProperty(element, prop) + incrementValue
    );
}
