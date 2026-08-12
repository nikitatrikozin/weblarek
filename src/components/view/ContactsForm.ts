import { Form, IForm } from "./Form";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export interface IContactsForm extends IForm {
    email: string;
    phone: string;
}

export class ContactsForm extends Form<IContactsForm> {
    protected emailInput: HTMLInputElement;
    protected phoneInput: HTMLInputElement;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this.emailInput = ensureElement<HTMLInputElement>(
            'input[name="email"]',
            this.container,
        );

        this.phoneInput = ensureElement<HTMLInputElement>(
            'input[name="phone"]',
            this.container,
        );

        this.emailInput.addEventListener("input", () => {
            this.events.emit("contacts:change", {
                email: this.emailInput.value,
            });
        });

        this.phoneInput.addEventListener("input", () => {
            this.events.emit("contacts:change", {
                phone: this.phoneInput.value,
            });
        });
    }

    set email(value: string) {
        this.emailInput.value = value;
    }

    set phone(value: string) {
        this.phoneInput.value = value;
    }

    protected onSubmit(): void {
        this.events.emit("contacts:submit");
    }
}
