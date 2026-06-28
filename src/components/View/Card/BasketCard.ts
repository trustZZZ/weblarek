import { ensureElement } from "../../../utils/utils";
import { Card, ICardActions } from "./Card";


export interface IBasketCard {
  seqNumber: number;
  price: number;
  title: string;
}
export class BasketCard extends Card<IBasketCard> {
  protected seqNumberElement: HTMLElement;
  protected actionButton: HTMLButtonElement;

  constructor(
    protected container: HTMLElement,
    protected actions?: ICardActions,
  ) {
    super(container);
    this.seqNumberElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      this.container,
    );
    this.actionButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      this.container,
    );

    if (actions?.onClick) {
      this.actionButton.addEventListener("click", actions.onClick);
    }
  }

  set seqNumber(value: number) {
    this.seqNumberElement.textContent = String(value);
  }
}