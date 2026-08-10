import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

interface IModal {
    content: HTMLElement;
}

export class Modal extends Component<IModal> {
    protected closeButton: HTMLButtonElement;
    protected content: HTMLElement;

    constructor(
        protected events: IEvents,
        container: HTMLElement,
    ) {
        super(container);

        this.closeButton = ensureElement<HTMLButtonElement>(
            ".modal__close",
            this.container,
        );

        this.content = ensureElement<HTMLElement>(
            ".modal__content",
            this.container,
        );

        this.closeButton.addEventListener("click", () => {
            this.events.emit("modal:close");
        });

        this.container.addEventListener("click", (event) => {
            if (event.target === this.container) {
                this.events.emit("modal:close");
            }
        });
    }

    set contentElement(value: HTMLElement) {
        this.content.replaceChildren(value);
    }

    open(content: HTMLElement): void {
        this.content.replaceChildren(content);
        this.container.classList.add("modal_active");
    }

    close(): void {
        this.container.classList.remove("modal_active");
        this.content.replaceChildren();
    }

    render(data?: Partial<IModal>): HTMLElement {
        if (data?.content) {
            this.contentElement = data.content;
        }

        return this.container;
    }
}
