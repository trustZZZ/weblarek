import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Basket {
  protected wishedProducts: IProduct[];
  constructor(protected events: IEvents) {
    this.wishedProducts = new Array<IProduct>();
  }

  addToBasket(product: IProduct): void {
    this.wishedProducts.push(product);
    this.events.emit("basket:productAdded", product);
  }

  getBasketProducts(): IProduct[] {
    return this.wishedProducts;
  }

  deleteFromBasket(product: IProduct): void {
    const index: number = this.wishedProducts.indexOf(product);
    if (index >= 0) {
      this.wishedProducts.splice(index, 1);
    }
  }

  clearBasket(): void {
    this.wishedProducts = new Array<IProduct>();
  }
  getTotalPrice(): number {
    return this.wishedProducts.reduce(
      (total, item) => total + (item.price || 0),
      0,
    );
  }
  countBasketProducts(): number {
    return this.wishedProducts.length;
  }
  isInBasketById(id: string): boolean {
    return this.wishedProducts.some((item) => item.id === id);
  }
}
