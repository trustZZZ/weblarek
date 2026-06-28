import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

export class Form<T> extends Component<T> {
  protected modalActionButtonElement: HTMLElement;
  protected buttonActionElement: HTMLButtonElement;
  protected errorElement: HTMLElement;

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
    this.errorElement = ensureElement<HTMLElement>(
      ".form__errors",
      this.container,
    );
  }

  set active(value: boolean) {
    this.buttonActionElement.disabled = !value;
  }

  set error(text: string) {
    this.errorElement.textContent = text;
  }
}
