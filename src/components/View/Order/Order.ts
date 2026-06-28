import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

interface IOrder {
  totalPrice: number;
}

export class OrderSuccessful extends Component<IOrder> {
  protected buttonClose: HTMLButtonElement | null;
  protected description: HTMLElement;

  constructor(
    protected events: IEvents,
    protected container: HTMLElement,
  ) {
    super(container);

    this.buttonClose = ensureElement<HTMLButtonElement>(".order-success__close", this.container);
    this.buttonClose?.addEventListener("click", () => {
      events.emit("modal:close");
    });
    this.buttonClose?.addEventListener("click", () => {
      events.emit("modal:close");
    });

    this.description = ensureElement<HTMLButtonElement>(".order-success__description", this.container);
  }

  set totalPrice(value: number) {
    this.description.textContent = `Списано ${value} синапсов`;
  }
}
