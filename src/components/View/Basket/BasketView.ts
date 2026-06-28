import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

interface IBasket {
  items: HTMLElement[];
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
    this.makeOrderButton.disabled = true;
    this.makeOrderButton.addEventListener("click", () => {
      events.emit("basket:order", this.basketList);
    });

    this.basketPriceElement = ensureElement<HTMLElement>(
      ".basket__price",
      this.container,
    );
  }

  set items(items: HTMLLIElement[]) {
    this.basketList.replaceChildren();
    items.forEach((item) => {
      this.basketList.appendChild(item);
    });
  }

  set totalPrice(value: number) {
    this.basketPriceElement.textContent = String(`${value} синапсов`);
  }

  set orederButtonActive(value: boolean) {
    this.makeOrderButton.disabled = !value;
  }
}
