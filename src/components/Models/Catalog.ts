import { IProduct } from "../../types";

export class Catalog {
  protected products: Array<IProduct>;
  protected productDetailed: IProduct | null;
  constructor() {
    this.products = new Array<IProduct>();
    this.productDetailed = null;
  }

  saveProducts(products: IProduct[]): void {
    this.products.push(...products);
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
  }

  getProductDetailed(): IProduct | null {
    return this.productDetailed;
  }
}
