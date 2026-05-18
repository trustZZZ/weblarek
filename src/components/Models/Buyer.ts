import { IBuyer } from "../../types";

export class Buyer implements IBuyer {
  public payment: "online" | "cash";
  public address: string;
  public phone: string;
  public email: string;
  constructor() {
    this.payment = "online";
    this.address = "";
    this.phone = "";
    this.email = "";
  }

  saveData(data: IBuyer): void {
    let errors = this.validateData(data);

    if (Object.values(errors).length > 0) {
      alert("Ошибка валидации! " + `${Object.values(errors)}`);
    }

    Object.keys(data).forEach((key) => {
      switch (key) {
        case "payment":
          if (data[key]) {
            this.payment = data[key];
          }
          break;
        case "address":
          if (data[key]) {
            this.address = data[key];
          }
          break;
        case "phone":
          if (data[key]) {
            this.phone = data[key];
          }
          break;
        case "email":
          if (data[key]) {
            this.email = data[key];
          }
          break;
      }
    });
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
    this.payment = "online";
    this.address = "";
    this.phone = "";
    this.email = "";
  }
  validateData(data: IBuyer): Object {
    const errors = {};
    if (data.address.length == 0) {
      Object.assign(errors, { address: "неверно задан адрес" });
    }
    if (data.payment.length == 0) {
      Object.assign(errors, { payment: "неверно указан способ оплаты" });
    }
    if (data.phone.length == 0) {
      Object.assign(errors, { phone: "не указан номер телефона" });
    }
    if (data.email.length == 0) {
      Object.assign(errors, {
        email: "неверно указан адрес электронной почты",
      });
    }

    return errors;
  }
}
