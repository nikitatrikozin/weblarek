import { Component } from "../base/Component";

interface IGallery {
    catalog: HTMLElement[];
}

export class Gallery extends Component<IGallery> {
    set catalog(items: HTMLElement[]) {
        this.container.replaceChildren(...items);
    }
}
