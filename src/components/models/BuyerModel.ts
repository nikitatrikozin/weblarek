import { IBuyer, TPayment, TValidationErrors } from "../../types";

export class BuyerModel {
  private payment: TPayment | null = null;
  private email: string = "";
  private phone: string = "";
  private address: string = "";

  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) {
      this.payment = data.payment;
    }

    if (data.email !== undefined) {
      this.email = data.email;
    }

    if (data.phone !== undefined) {
      this.phone = data.phone;
    }

    if (data.address !== undefined) {
      this.address = data.address;
    }
  }

  getData(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clear(): void {
    this.payment = null;
    this.email = "";
    this.phone = "";
    this.address = "";
  }

  validate(): TValidationErrors {
    const errors: TValidationErrors = {};

    if (!this.payment) {
      errors.payment = "Не выбран способ оплаты";
    }

    if (!this.email) {
      errors.email = "Введите email";
    }

    if (!this.phone) {
      errors.phone = "Введите телефон";
    }

    if (!this.address) {
      errors.address = "Введите адрес";
    }

    return errors;
  }
}
