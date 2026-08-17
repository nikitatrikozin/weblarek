import { Card, ICard } from "./Card";
import { ensureElement } from "../../utils/utils";
import { categoryMap } from "../../utils/constants";

export class CatalogCard extends Card<ICard> {
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;

    constructor(container: HTMLElement, onClick: () => void) {
        super(container);

        this.categoryElement = ensureElement<HTMLElement>(
            ".card__category",
            this.container,
        );

        this.imageElement = ensureElement<HTMLImageElement>(
            ".card__image",
            this.container,
        );

        this.container.addEventListener("click", onClick);
    }

    set category(value: string) {
        this.categoryElement.textContent = value;

        this.categoryElement.className = `card__category ${categoryMap[value as keyof typeof categoryMap]
            }`;
    }

    set image(value: string) {
        this.setImage(this.imageElement, value);
    }
}
