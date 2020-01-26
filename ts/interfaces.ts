export interface View {
	name: string;
	template: string;
	sections?: Map<string, string>;
	module?: string;
}

export interface ViewModule {
	boot(): void;
}

export interface NavParameterContentSections {
	container: HTMLElement;
	titleSelector: string;
	linkSelector: string;
}

export interface NavParameterContent {
	container: HTMLElement;
	links: HTMLElement;
	sections: NavParameterContentSections;
}

export interface NavParameters {
	container: HTMLElement;
	logo: HTMLAnchorElement;
	toggleButton: HTMLButtonElement;
	toggleContainerClassName: string;
	toggleContentClassName: string,
	breakpoint: number;
	content: NavParameterContent;
	current: HTMLElement;
	routerParams: RouterParameters;
}

export interface State {
	view: string;
	title: string;
	firstLaunch?: Boolean;
}

export interface RouterParameters {
	container: HTMLElement;
	views: Array<View>;
	defaultState: State;
}

export interface LightboxParameterTransitions {
	show: string;
	hide: string;
}

export interface LightboxParameterMappedElements {
	image: string;
	title: string;
	description: string;
}

export interface LightboxParameters {
	container: HTMLElement;
	className: string;
	content: HTMLElement;
	text: HTMLElement;
	closeButton: HTMLButtonElement;
	image: HTMLPictureElement;
	title: HTMLHeadingElement;
	description: HTMLParagraphElement;
	mappedElements: LightboxParameterMappedElements;
	transitions: LightboxParameterTransitions;
}