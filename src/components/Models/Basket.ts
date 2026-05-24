import { IProduct } from "../../types";

export class Basket {
  wishedProducts: IProduct[];
  constructor() {
    this.wishedProducts = new Array<IProduct>();
  }

  addToBasket(product: IProduct): void {
    this.wishedProducts.push(product);
  }

  getBasketProducts(): IProduct[] {
    return this.wishedProducts;
  }

  deleteFromBasket(product: IProduct): void {
    let index: number = this.wishedProducts.indexOf(product);
    if (index >= 0) {
      this.wishedProducts.splice(index, 1);
    }
  }

  clearBasket(): void {
    this.wishedProducts = new Array<IProduct>();
  }
  getTotalPrice(): number {
    let totalPrice = 0;
    this.wishedProducts.forEach((product) => {
      if (product.price) {
        totalPrice += product.price;
      }
    });
    return totalPrice;
  }
  countBasketProducts(): number {
    return this.wishedProducts.length;
  }
  isInBasketById(id: string): boolean {
    if (this.wishedProducts.filter((product) => product.id == id).length) {
      return true;
    } else return false;
  }
}
