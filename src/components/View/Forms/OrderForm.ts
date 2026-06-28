import { TPayment } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { Form } from "./Forms";

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
    this.addressElement.addEventListener("input", () =>
      events.emit("form:address", { address: this.addressElement.value }),
    );

    this.buttonActionElement.addEventListener("click", (event) => {
      event.preventDefault();
      events.emit("form:next", this.container);
    });
  }

  set payment(payment: TPayment | null) {
    this.cardButton.classList.toggle("button_alt-active", payment == "card");
    this.cashButton.classList.toggle("button_alt-active", payment == "cash");
  }

  set addressText(value: string) {
    this.addressElement.value = value;
  }
}
