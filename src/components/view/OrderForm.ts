import { Form, IForm } from "./Form";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export interface IOrderForm extends IForm {
    payment: "card" | "cash" | null;
    address: string;
}

export class OrderForm extends Form<IOrderForm> {
    protected cardButton: HTMLButtonElement;
    protected cashButton: HTMLButtonElement;
    protected addressInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this.cardButton = ensureElement<HTMLButtonElement>(
            'button[name="card"]',
            this.container,
        );

        this.cashButton = ensureElement<HTMLButtonElement>(
            'button[name="cash"]',
            this.container,
        );

        this.addressInput = ensureElement<HTMLInputElement>(
            'input[name="address"]',
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

        this.addressInput.addEventListener("input", () => {
            this.events.emit("order:change", {
                address: this.addressInput.value,
            });
        });
    }

    set payment(value: "card" | "cash" | null) {
        this.cardButton.classList.toggle("button_alt-active", value === "card");

        this.cashButton.classList.toggle("button_alt-active", value === "cash");
    }

    set address(value: string) {
        this.addressInput.value = value;
    }

    protected onSubmit(): void {
        this.events.emit("order:submit");
    }
}
