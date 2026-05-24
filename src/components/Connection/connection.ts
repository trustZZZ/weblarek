import { IApi, IOrder, IResponse } from "../../types";

export class Connection {
  api: IApi;
  constructor(API: IApi) {
    this.api = API;
  }

  async getProductsFromServer(): Promise<IResponse> {
    return this.api.get<IResponse>("/product/");
  }

  async postOrderData(data: IOrder): Promise<IOrder> {
    return this.api.post<IOrder>("/order/", data, "POST");
  }
}
