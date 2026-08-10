import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

interface IBasket {
    items: HTMLElement[];
    total: number;
}

export class Basket extends Component<IBasket> {
    protected listElement: HTMLElement;
    protected totalElement: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(
        protected events: IEvents,
        container: HTMLElement,
    ) {
        super(container);

        this.listElement = ensureElement<HTMLElement>(
            ".basket__list",
            this.container,
        );

        this.totalElement = ensureElement<HTMLElement>(
            ".basket__price",
            this.container,
        );

        this.button = ensureElement<HTMLButtonElement>(
            ".basket__button",
            this.container,
        );

        this.button.addEventListener("click", () => {
            this.events.emit("order:open");
        });
    }

    set items(value: HTMLElement[]) {
        this.listElement.replaceChildren(...value);
    }

    set total(value: number) {
        this.totalElement.textContent = `${value} синапсов`;
    }
}
