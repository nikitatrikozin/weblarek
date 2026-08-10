import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { categoryMap, CDN_URL } from "../../utils/constants";

export interface ICard {
    id: string;
    title: string;
    description: string;
    image: string;
    category: string;
    price: number | null;
}

export class Card<T extends ICard> extends Component<T> {
    protected titleElement: HTMLElement;
    protected categoryElement: HTMLElement;
    protected imageElement: HTMLImageElement;
    protected priceElement: HTMLElement;

    constructor(container: HTMLElement) {
        super(container);

        this.titleElement = ensureElement<HTMLElement>(
            ".card__title",
            this.container,
        );

        this.categoryElement = ensureElement<HTMLElement>(
            ".card__category",
            this.container,
        );

        this.imageElement = ensureElement<HTMLImageElement>(
            ".card__image",
            this.container,
        );

        this.priceElement = ensureElement<HTMLElement>(
            ".card__price",
            this.container,
        );
    }

    set title(value: string) {
        this.titleElement.textContent = value;
    }

    set category(value: string) {
        this.categoryElement.textContent = value;

        this.categoryElement.className = `card__category ${categoryMap[value as keyof typeof categoryMap]}`;
    }

    set image(value: string) {
        this.setImage(
            this.imageElement,
            value.startsWith("http") ? value : `${CDN_URL}${value}`,
        );
    }

    set price(value: number | null) {
        this.priceElement.textContent =
            value === null ? "Бесценно" : `${value} синапсов`;
    }
}
