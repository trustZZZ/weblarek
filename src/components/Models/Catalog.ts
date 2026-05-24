import { IProduct } from "../../types";

export class Catalog {
  protected products: Set<IProduct>;
  protected productDetailed: IProduct;
  constructor() {
    this.products = new Set();
    this.productDetailed = {
      id: "",
      description: "",
      image: "",
      title: "",
      category: "",
      price: 0,
    };
  }

  saveProducts(products: IProduct[]): void {
    products.forEach((product) => this.products.add(product));
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
  getProductDetailed(): IProduct {
    return this.productDetailed;
  }
}
