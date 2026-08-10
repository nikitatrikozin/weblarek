import { Component } from '../base/Component';
import { IEvents } from '../base/Events';
import { ensureElement } from '../../utils/utils';

export interface IForm {
    valid: boolean;
    errors: string;
}

export class Form<T> extends Component<T> {
    protected submitButton: HTMLButtonElement;
    protected errorsElement: HTMLElement;

    constructor(
        protected events: IEvents,
        container: HTMLFormElement
    ) {
        super(container);

        this.submitButton = ensureElement<HTMLButtonElement>(
            'button[type="submit"]',
            container
        );

        this.errorsElement = ensureElement<HTMLElement>(
            '.form__errors',
            container
        );

        container.addEventListener('submit', (event) => {
            event.preventDefault();

            this.events.emit(`${container.name}:submit`, {
                ...this.getFormData()
            });
        });

        container.addEventListener('input', () => {
            this.events.emit(`${container.name}:change`, {
                ...this.getFormData()
            });
        });
    }

    protected getFormData(): Record<string, string> {
        const formData = new FormData(
            this.container as HTMLFormElement
        );

        return Object.fromEntries(
            formData.entries()
        ) as Record<string, string>;
    }

    set valid(value: boolean) {
        this.submitButton.disabled = !value;
    }

    set errors(value: string) {
        this.errorsElement.textContent = value;
    }
}