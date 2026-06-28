import { IProduct } from "../../types";
import { IEvents } from "../base/Events";

export class Catalog {
  protected products: Array<IProduct>;
  protected productDetailed: IProduct | null;
  constructor(protected events: IEvents) {
    this.products = new Array<IProduct>();
    this.productDetailed = null;
  }

  saveProducts(products: IProduct[]): void {
    this.products.push(...products);
    this.events.emit("gallery:changed");
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    const product: IProduct | undefined = this.products.find(
      (product) => product.id == id,
    );
    return product;
  }

  saveProductDetailed(product: IProduct): void {
    this.productDetailed = product;
    this.events.emit("catalog:cardDetailedChanged", product);
  }

  getProductDetailed(): IProduct | null {
    return this.productDetailed;
  }
}
