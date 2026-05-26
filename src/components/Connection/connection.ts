import { IApi, IGetResponse, IOrder, IPostResponse } from "../../types";

export class Connection {
  protected api: IApi;
  constructor(api: IApi) {
    this.api = api;
  }

  async getProductsFromServer(): Promise<IGetResponse> {
    return this.api.get<IGetResponse>("/product/");
  }

  async postOrderData(data: IOrder): Promise<IPostResponse> {
    return this.api.post<IPostResponse>("/order/", data, "POST");
  }
}
