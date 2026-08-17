import { Card, ICard } from "./Card";
import { ensureElement } from "../../utils/utils";

export class PreviewCard extends Card<ICard> {
    protected descriptionElement: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(container: HTMLElement, onBuy: () => void) {
        super(container);

        this.descriptionElement = ensureElement<HTMLElement>(
            ".card__text",
            this.container,
        );

        this.button = ensureElement<HTMLButtonElement>(
            ".card__button",
            this.container,
        );

        this.button.addEventListener("click", onBuy);
    }

    set buttonText(value: string) {
        this.button.textContent = value;
    }

    set buttonDisabled(value: boolean) {
        this.button.disabled = value;
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }
}
