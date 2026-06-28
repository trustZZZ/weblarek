import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

interface IBasket {
  newCard: HTMLElement;
  totalPrice: number;
  makeOrder: boolean;
}

export class BasketView extends Component<IBasket> {
  protected basketList: HTMLUListElement;
  protected makeOrderButton: HTMLButtonElement;
  protected basketPriceElement: HTMLElement;

  constructor(
    protected events: IEvents,
    protected container: HTMLElement,
  ) {
    super(container);
    this.basketList = ensureElement<HTMLUListElement>(
      ".basket__list",
      this.container,
    );
    this.makeOrderButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      this.container,
    );
    this.makeOrderButton.addEventListener("click", () => {
      events.emit("basket:order", this.basketList);
    });

    this.basketPriceElement = ensureElement<HTMLElement>(
      ".basket__price",
      this.container,
    );
  }

  set newCard(card: HTMLElement) {
    if (!this.basketList.contains(card)) {
      this.basketList.appendChild(card);
    } else {
      this.basketList.replaceChild(card, card);
    }
  }

  set totalPrice(value: number) {
    this.basketPriceElement.textContent = String(`${value} синапсов`);
  }

  deleteItem(card: HTMLElement): void {
    this.basketList.removeChild(card);
  }

  clear(): void {
    this.basketList.replaceChildren();
  }

  set makeOrder(value: boolean) {
    this.makeOrderButton.disabled = !value;
  }
}
