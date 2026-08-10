import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { Card, ICard } from "./Card";

export class PreviewCard extends Card<ICard> {
    protected descriptionElement: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(
        protected events: IEvents,
        container: HTMLElement,
        private product: ICard,
    ) {
        super(container);

        this.descriptionElement = ensureElement<HTMLElement>(
            ".card__text",
            this.container,
        );

        this.button = ensureElement<HTMLButtonElement>(
            ".card__button",
            this.container,
        );

        this.button.addEventListener("click", () => {
            this.events.emit("card:buy", {
                product: this.product,
            });
        });
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }
}
