import { Form } from "./Form";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
export interface IOrderForm {
    payment: "card" | "cash" | null;
    address: string;
}
export class OrderForm extends Form<IOrderForm> {
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;
    constructor(events: IEvents, container: HTMLFormElement) {
        super(events, container);
        this.cardButton = ensureElement<HTMLButtonElement>(
            'button[name="card"]',
            this.container,
        );
        this.cashButton = ensureElement<HTMLButtonElement>(
            'button[name="cash"]',
            this.container,
        );
        this.cardButton.addEventListener("click", () => {
            this.events.emit("payment:change", {
                payment: "card",
            });
        });
        this.cashButton.addEventListener("click", () => {
            this.events.emit("payment:change", {
                payment: "cash",
            });
        });
    }
    set payment(value: "card" | "cash" | null) {
        this.cardButton.classList.toggle("button_alt-active", value === "card");
        this.cashButton.classList.toggle("button_alt-active", value === "cash");
    }
}
