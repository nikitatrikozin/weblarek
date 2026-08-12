import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { Card, ICard } from "./Card";

export class PreviewCard extends Card<ICard> {
    protected descriptionElement: HTMLElement;
    protected button: HTMLButtonElement;

    constructor(
        container: HTMLElement,
        private events: IEvents,
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
            const id = this.container.dataset.id;

            if (!id) {
                return;
            }

            this.events.emit("card:buy", {
                id,
            });
        });
    }

    set description(value: string) {
        this.descriptionElement.textContent = value;
    }
}
