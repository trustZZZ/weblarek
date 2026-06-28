import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Form } from "./Forms";
import { IFormSelectionButton } from "./OrderForm";

export class ContactsForm extends Form<IFormSelectionButton> {
  protected emailElement: HTMLInputElement;
  protected phoneElement: HTMLInputElement;

  constructor(
    protected events: IEvents,
    protected container: HTMLElement,
  ) {
    super(events, container);

    this.emailElement = ensureElement<HTMLInputElement>(
      '[name="email"]',
      this.container,
    );
    this.emailElement.addEventListener("input", () =>
      events.emit("contacts-form:email", { email: this.emailElement.value }),
    );

    this.phoneElement = ensureElement<HTMLInputElement>(
      '[name="phone"]',
      this.container,
    );
    this.phoneElement.addEventListener("input", () =>
      events.emit("contacts-form:phone", { phone: this.phoneElement.value }),
    );

    this.modalActionButtonElement.addEventListener("click", (event) => {
      event.preventDefault();
      events.emit("form:pay");
    });
  }

  set emailText(value: string) {
    this.emailElement.value = value;
  }
  
  set phoneText(value: string) {
    this.phoneElement.value = value;
  }
}
