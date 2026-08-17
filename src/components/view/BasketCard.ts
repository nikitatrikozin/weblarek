import { Card, ICard } from "./Card";
import { ensureElement } from "../../utils/utils";

interface IBasketCard extends ICard {
    index: number;
}

export class BasketCard extends Card<IBasketCard> {
    protected indexElement: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(container: HTMLElement, onRemove: () => void) {
        super(container);

        this.indexElement = ensureElement<HTMLElement>(
            ".basket__item-index",
            this.container,
        );

        this.button = ensureElement<HTMLButtonElement>(
            ".card__button",
            this.container,
        );

        this.button.addEventListener("click", onRemove);
    }

    set index(value: number) {
        this.indexElement.textContent = String(value);
    }
}
