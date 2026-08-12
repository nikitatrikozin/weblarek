import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { IProduct } from "../../types";

interface IBasketCard {
    id: string;
    title: string;
    price: number | null;
    index: number;
}

export class BasketCard extends Component<IBasketCard> {
    protected titleElement: HTMLElement;
    protected priceElement: HTMLElement;
    protected indexElement: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        private events: IEvents,
        private product: IProduct,
    ) {
        super(container);

        this.titleElement = ensureElement<HTMLElement>(
            ".card__title",
            this.container,
        );

        this.priceElement = ensureElement<HTMLElement>(
            ".card__price",
            this.container,
        );

        this.indexElement = ensureElement<HTMLElement>(
            ".basket__item-index",
            this.container,
        );

        this.button = ensureElement<HTMLButtonElement>(
            ".card__button",
            this.container,
        );

        this.button.addEventListener("click", () => {
            this.events.emit("basket:remove", {
                id: this.product.id,
            });
        });
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set price(value: number | null) {
        this.priceElement.textContent =
            value === null ? "Бесценно" : `${value} синапсов`;
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}
