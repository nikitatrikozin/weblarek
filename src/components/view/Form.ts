import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export interface IForm {
    valid: boolean;
    errors: string;
}

export abstract class Form<T extends IForm> extends Component<T> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(
        container: HTMLFormElement,
        protected events: IEvents,
    ) {
        super(container);

        this.submitButton = ensureElement<HTMLButtonElement>(
            'button[type="submit"]',
            this.container,
        );

        this.errorsElement = ensureElement<HTMLElement>(
            ".form__errors",
            this.container,
        );

        this.container.addEventListener("submit", (event) => {
            event.preventDefault();

            if (!this.submitButton.disabled) {
                this.onSubmit();
            }
        });
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errors(value: string) {
        this.errorsElement.textContent = value;
    }

    protected abstract onSubmit(): void;
}
