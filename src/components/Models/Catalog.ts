import { IProduct } from "../../types";

export class Catalog {
  protected products: Array<IProduct>;
  protected productDetailed: IProduct | null;
  constructor() {
    this.products = new Array<IProduct>();
    this.productDetailed = null;
  }

  saveProducts(products: IProduct[]): void {
    this.products.concat(products);
  }
  getProducts(): IProduct[] {
    return Array.from(this.products);
  }
  getProductById(id: string): IProduct | undefined {
    const product: IProduct | undefined = Array.from(this.products).find(
      (product) => product.id == id,
    );
    return product;
  }
  saveProductDetailed(product: IProduct): void {
    this.productDetailed = product;
  }
  getProductDetailed(): IProduct | null {
    return this.productDetailed;
  }
}
