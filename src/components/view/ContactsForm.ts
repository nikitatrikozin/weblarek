import { Form } from "./Form";
import { IEvents } from "../base/Events";

export interface IContactsForm {
    email: string;
    phone: string;
}

export class ContactsForm extends Form<IContactsForm> {
    constructor(events: IEvents, container: HTMLFormElement) {
        super(events, container);

        this.container.addEventListener("input", () => {
            const data = this.getFormData();

            this.events.emit("contacts:change", {
                email: data.email,
                phone: data.phone,
            });
        });
    }
}
