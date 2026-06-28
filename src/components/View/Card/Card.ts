import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";

export interface ICardActions {
  onClick: (event: MouseEvent) => void;
}

export class Card<T> extends Component<T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(protected container: HTMLElement) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>(
      ".card__title",
      this.container,
    );
    this.priceElement = ensureElement<HTMLElement>(
      ".card__price",
      this.container,
    );
  }

  set price(value: number) {
    if (value) {
      this.priceElement.textContent = String(value).concat(" синпсов");
    } else this.priceElement.textContent = "Бесценно";
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }
}
