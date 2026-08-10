import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface ISuccess {
    total: number;
}

export class Success extends Component<ISuccess> {
    protected totalElement: HTMLElement;
    protected closeButton: HTMLButtonElement;

    constructor(
        protected events: IEvents,
        container: HTMLElement,
    ) {
        super(container);

        this.totalElement = ensureElement<HTMLElement>(
            ".order-success__description",
            this.container,
        );

        this.closeButton = ensureElement<HTMLButtonElement>(
            ".order-success__close",
            this.container,
        );

        this.closeButton.addEventListener("click", () => {
            this.events.emit("success:close");
        });
    }

    set total(value: number) {
        this.totalElement.textContent = `Списано ${value} синапсов`;
    }
}
