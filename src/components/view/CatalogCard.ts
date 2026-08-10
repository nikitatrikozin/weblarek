import { IEvents } from "../base/Events";
import { Card, ICard } from "./Card";

export class CatalogCard extends Card<ICard> {
    constructor(
        protected events: IEvents,
        container: HTMLElement,
        private product: ICard,
    ) {
        super(container);

        this.container.addEventListener("click", () => {
            this.events.emit("card:select", {
                product: this.product,
            });
        });
    }
}
