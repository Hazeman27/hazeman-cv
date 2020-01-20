export interface ViewModuleInfo {
    name: string,
    path: string
}

export interface View {
    name: string,
    template: string,
    sections?: Map<string, string>,
    module?: ViewModuleInfo
}

export interface NavParamContentSections {
    container: HTMLElement,
    titleSelector: string,
    linkSelector: string
}

export interface NavParamContent {
    container: HTMLElement,
    links: HTMLElement,
    sections: NavParamContentSections
}

export interface NavParams {
    container: HTMLElement,
    toggleButton: HTMLButtonElement,
    toggleClassName: string,
    breakpoint: number,
    content: NavParamContent,
    current: HTMLElement,
    routerParams: RouterParams
}

export interface State {
    view: string,
    title: string,
    firstLaunch?: Boolean
}

export interface RouterParams {
    container: HTMLElement,
    views: Array<View>,
    defaultState: State
}

export interface GalleryParams {
    containers: NodeListOf<HTMLElement>,
    itemClassName: string,
    lightboxParams: LightboxParams
}

export interface LightboxParamTransitions {
    show: string,
    hide: string
}

export interface LightboxParamMappedElements {
    image: string,
    title: string,
    description: string
}

export interface LightboxParams {
    container: HTMLElement,
    className: string,
    content: HTMLElement,
    text: HTMLElement,
    closeButton: HTMLButtonElement,
    image: HTMLPictureElement,
    title: HTMLHeadingElement,
    description: HTMLParagraphElement,
    mappedElements: LightboxParamMappedElements
    transitions: LightboxParamTransitions
}