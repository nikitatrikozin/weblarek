import { IEvents } from "../base/Events";
import { Card, ICard } from "./Card";

export class CatalogCard extends Card<ICard> {
    constructor(
        container: HTMLElement,
        private events: IEvents,
    ) {
        super(container);

        this.container.addEventListener("click", () => {
            const id = this.container.dataset.id;

            if (!id) {
                return;
            }

            this.events.emit("card:select", {
                id,
            });
        });
    }
}
