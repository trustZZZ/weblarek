import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { Card, ICardActions } from "./Card";
import { categoryMap } from "../../../utils/constants";
import { CategoryKey } from "./CatalogCard";

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

  set buttonText(text: string) {
    this.actionButton.textContent = text;
  }

  set buttonActive(active: boolean) {
    this.actionButton.disabled = !active;
  }
}
