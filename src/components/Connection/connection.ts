import { IApi, IOrder, IResponse } from "../../types";
import { Api } from "../base/Api";

export class Connection {
  api: IApi;
  constructor(baseUrl: string) {
    this.api = new Api(baseUrl);
  }

  async get(uri: string): Promise<IResponse> {
    const products: IResponse = await this.api.get(uri);
    return products;
  }

  async post(data: IOrder): Promise<Object> {
    const total = await this.api.post("/order/", data, "POST");
    return total;
  }
}
