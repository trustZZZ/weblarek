import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";
import { IEvents } from "../../base/Events";

interface IModal {
  content: HTMLElement;
}

export class Modal extends Component<IModal> {
  protected closeButton: HTMLButtonElement;
  protected modalContent: HTMLElement;

  constructor(
    protected events: IEvents,
    protected container: HTMLElement,
  ) {
    super(container);
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".modal__close",
      this.container,
    );
    this.closeButton.addEventListener("click", () => {
      this.close();
    });

    this.modalContent = ensureElement<HTMLElement>(
      ".modal__content",
      this.container,
    );
  }

  close(): void {
    this.container.classList.remove("modal_active");
  }

  open(value: HTMLElement): void {
    if (this.modalContent.firstElementChild) {
      this.modalContent.firstElementChild.remove();
    }
    this.modalContent.append(value);
    this.container.classList.add('modal_active');
  }
}
