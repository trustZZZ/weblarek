export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

export interface IBuyer {
  payment: IPaymentType;
  email: string;
  phone: string;
  address: string;
}

export type IPaymentType = "card" | "cash" | null;

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export interface IResponse {
  total: number;
  items: IProduct[];
}

export interface IOrder extends IBuyer {
  items: string[];
  total: number;
}
