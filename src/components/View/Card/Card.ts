import { IProduct } from "../../../types";
import { categoryMap } from "../../../utils/constants";
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

type CategoryKey = keyof typeof categoryMap;
export type TCardCatalog = Pick<IProduct, "image" | "category">;

export class CatalogCard extends Card<TCardCatalog> {
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(
    protected container: HTMLElement,
    protected actions?: ICardActions,
  ) {
    super(container);
    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );

    if (actions?.onClick) {
      this.container.addEventListener("click", actions.onClick);
    }
  }

  set category(value: string) {
    this.categoryElement.textContent = String(value);

    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value,
      );
    }
  }

  set image(value: string) {
    this.setImage(this.imageElement, value, this.title);
  }
}

export type IPreviewCard = Pick<IProduct, "description" | "category" | "image">;

export class PreviewCard extends Card<IPreviewCard> {
  protected descriptionElement: HTMLElement;
  protected actionButton: HTMLButtonElement;
  protected categoryElement: HTMLElement;
  protected imageElement: HTMLImageElement;

  constructor(
    protected container: HTMLElement,
    protected actions?: ICardActions,
  ) {
    super(container);
    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      this.container,
    );
    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      this.container,
    );
    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      this.container,
    );
    this.actionButton = ensureElement<HTMLButtonElement>(
      ".card__button",
      this.container,
    );
    if (actions?.onClick) {
      this.actionButton.addEventListener("click", actions.onClick);
    }
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set category(value: string) {
    this.categoryElement.textContent = String(value);

    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(
        categoryMap[key as CategoryKey],
        key === value,
      );
    }
  }

  set image(value: string) {
    this.setImage(this.imageElement, value, this.title);
  }

  set price(value: number) {
    if (value) {
      this.actionButton.textContent = "Купить";
    } else {
      this.actionButton.textContent = "Недоступно";
      this.actionButton.disabled = true;
    }
    super.price = value;
  }
}

export interface IBasketCard {
  seqNumber: number;
  price: number;
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
