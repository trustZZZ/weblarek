import { TPayment } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

class Form<T> extends Component<T> {
  protected modalActionButtonElement: HTMLElement;
  protected buttonActionElement: HTMLButtonElement;

  constructor(
    protected events: IEvents,
    protected container: HTMLElement,
  ) {
    super(container);
    this.modalActionButtonElement = ensureElement<HTMLElement>(
      ".modal__actions",
      this.container,
    );
    this.buttonActionElement = ensureElement<HTMLButtonElement>(
      ".button",
      this.modalActionButtonElement,
    );
  }

  set active(value: boolean) {
    this.buttonActionElement.disabled = !value;
  }
}

export interface IFormSelectionButton {
  select: TPayment;
  active: boolean;
}

export class OrderForm extends Form<IFormSelectionButton> {
  protected cardButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;
  protected addressElement: HTMLInputElement;

  constructor(
    protected events: IEvents,
    protected container: HTMLElement,
  ) {
    super(events, container);

    this.cardButton = ensureElement<HTMLButtonElement>(
      '[name="card"]',
      this.container,
    );
    this.cardButton.addEventListener("click", () =>
      events.emit("form:paymentSelected", {
        payment: "card",
      }),
    );

    this.cashButton = ensureElement<HTMLButtonElement>(
      '[name="cash"]',
      this.container,
    );
    this.cashButton.addEventListener("click", () =>
      events.emit("form:paymentSelected", {
        payment: "cash",
      }),
    );

    this.addressElement = ensureElement<HTMLInputElement>(
      '[name="address"]',
      this.container,
    );
    this.addressElement.addEventListener("focusout", () =>
      events.emit("form:address", { address: this.addressElement.value }),
    );

    this.buttonActionElement.addEventListener("click", (event) => {
      event.preventDefault();
      events.emit("form:next", this.container);
    });
  }

  set payment(payment: TPayment | null) {
    if (payment == "card") {
      this.cardButton.classList.toggle("button_alt-active");
      if(this.cashButton.classList.contains("button_alt-active")) {
        this.cashButton.classList.toggle("button_alt-active");
      }
    } else if (payment == "cash") {
      this.cashButton.classList.toggle("button_alt-active");
      if(this.cardButton.classList.contains("button_alt-active")) {
        this.cardButton.classList.toggle("button_alt-active");
      }
    } else {
      if(this.cashButton.classList.contains("button_alt-active")) {
        this.cashButton.classList.toggle("button_alt-active");
      }
      if(this.cardButton.classList.contains("button_alt-active")) {
        this.cardButton.classList.toggle("button_alt-active");
      }
    }
  }
}

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
    this.emailElement.addEventListener("focusout", () =>
      events.emit("form:contacts", { email: this.emailElement.value }),
    );

    this.phoneElement = ensureElement<HTMLInputElement>(
      '[name="phone"]',
      this.container,
    );
    this.phoneElement.addEventListener("focusout", () =>
      events.emit("form:contacts", { phone: this.phoneElement.value }),
    );

    this.modalActionButtonElement.addEventListener("click", (event) => {
      event.preventDefault();
      events.emit("form:pay");
    });
  }
}
