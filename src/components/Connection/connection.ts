import { IApi, IResponse } from "../../types";
import { Api } from "../base/Api";

export class Connection {
  api: IApi;
  constructor(baseUrl: string) {
    this.api = new Api(baseUrl);
  }

  async get(uri: string): Promise<IResponse> {
    const products = await this.api.get(uri) as IResponse;
    return products;
  }

  async post(data: Object): Promise<Object> {
    const total = await this.api.post('/order/', data, "POST")
    return total;
  }
}
