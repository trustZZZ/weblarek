import { IBuyer, TPayment } from "../../types";
import { IEvents } from "../base/Events";

export class Buyer {
  protected payment: TPayment | null;
  protected address: string;
  protected phone: string;
  protected email: string;
  constructor(protected events: IEvents) {
    this.payment = null;
    this.address = "";
    this.phone = "";
    this.email = "";
  }

  saveData<T>(data: Record<string, T>): void {
    Object.assign(this, data);
    this.events.emit("user:dataChanged");
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      address: this.address,
      phone: this.phone,
      email: this.email,
    };
  }
  clearData(): void {
    this.payment = null;
    this.address = "";
    this.phone = "";
    this.email = "";
    this.events.emit("user:dataChanged");
  }

  validateData(): Record<string, string> {
    const errors: Record<string, string> = {};

    // Проверяем адрес, учитываем возможность null/undefined
    if (!this.address?.trim()) {
      errors.address = "неверно задан адрес";
    }

    // Проверяем способ оплаты
    if (!this.payment?.trim()) {
      errors.payment = "неверно указан способ оплаты";
    }

    // Проверяем телефон
    if (!this.phone?.trim()) {
      errors.phone = "не указан номер телефона";
    }

    // Проверяем email
    if (!this.email?.trim()) {
      errors.email = "неверно указан адрес электронной почты";
    }

    return errors;
  }
}
