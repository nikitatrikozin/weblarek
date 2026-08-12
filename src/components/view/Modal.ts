import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

interface ModalData {
    content: HTMLElement;
}

export class Modal extends Component<ModalData> {
    protected closeButton: HTMLButtonElement;
    protected contentElement: HTMLElement;

    constructor(
        container: HTMLElement,
        private events: IEvents,
    ) {
        super(container);

        this.closeButton = ensureElement<HTMLButtonElement>(
            ".modal__close",
            this.container,
        );

        this.contentElement = ensureElement<HTMLElement>(
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

    set content(value: HTMLElement) {
        this.contentElement.replaceChildren(value);
    }

    open(content: HTMLElement): void {
        this.content = content;
        this.container.classList.add("modal_active");
    }

    close(): void {
        this.container.classList.remove("modal_active");
        this.contentElement.replaceChildren();
    }
}
