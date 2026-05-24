import { IBuyer, IPaymentType } from "../../types";

export class Buyer {
  protected payment: IPaymentType;
  protected address: string;
  protected phone: string;
  protected email: string;
  constructor() {
    this.payment = null;
    this.address = "";
    this.phone = "";
    this.email = "";
  }

  saveData<T>(data: Record<string, T>): void {
    Object.assign(this, data);
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
  }
  validateData(data: IBuyer): Record<string, string> | null {
    const errors: Record<string, string> = {};

    // Проверяем адрес, учитываем возможность null/undefined
    if (!data.address || data.address.trim().length === 0) {
      errors.address = "неверно задан адрес";
    }

    // Проверяем способ оплаты
    if (!data.payment || data.payment.trim().length === 0) {
      errors.payment = "неверно указан способ оплаты";
    }

    // Проверяем телефон
    if (!data.phone || data.phone.trim().length === 0) {
      errors.phone = "не указан номер телефона";
    }

    // Проверяем email
    if (!data.email || data.email.trim().length === 0) {
      errors.email = "неверно указан адрес электронной почты";
    }

    // Если есть ошибки — показываем алерт и возвращаем объект ошибок
    if (Object.keys(errors).length > 0) {
      alert("Ошибка валидации! " + `${Object.values(errors).join(", ")}`);
      return errors;
    }

    // Если ошибок нет — возвращаем null
    return null;
  }
}
