import { BasketCard } from "../components/View/Card/BasketCard";

export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

export interface IImage {
  imageSrc: string | null;
}

export interface IBuyer {
  payment: TPayment | null;
  email: string;
  phone: string;
  address: string;
}

export type TPayment = "card" | "cash";

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

interface IResponse {
  total: number;
}

export interface IAdress {
  address: string | null;
}

export interface IPostResponse extends IResponse {
  id: string;
}

export interface IGetResponse extends IResponse {
  items: IProduct[];
}

export interface IOrder extends IBuyer, IResponse {
  items: string[];
}

export interface IDelete {
  product: IProduct,
  card: BasketCard;
}

export interface IPaymentCheck {
  payment: TPayment | null;
}

export interface IContacts {
  phone: string,
  email: string
}