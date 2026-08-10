import { IEvents } from "./base/Events";
import { ProductModel } from "./models/ProductModel";
import { CartModel } from "./models/CartModel";
import { BuyerModel } from "./models/BuyerModel";
import { WebLarekApi } from "./api/WebLarekApi";
import { IProduct, IBuyer } from "../types";
export class Presenter {
    constructor(
        private events: IEvents,
        private productsModel: ProductModel,
        private cartModel: CartModel,
        private buyerModel: BuyerModel,
        private api: WebLarekApi,
    ) {
        // Предпросмотр товара
        this.events.on("card:select", (data: { product: IProduct }) => {
            this.productsModel.setPreview(data.product);
            this.events.emit("preview:open", {
                product: data.product,
            });
        });
        // Добавление товара в корзину
        this.events.on("card:buy", (data: { product: IProduct }) => {
            this.cartModel.add(data.product);
            this.events.emit("basket:changed");
        });
        // Удаление товара из корзины
        this.events.on("basket:remove", (data: { product: IProduct }) => {
            this.cartModel.remove(data.product);
            this.events.emit("basket:changed");
        });
        // Очистка корзины
        this.events.on("basket:clear", () => {
            this.cartModel.clear();
            this.events.emit("basket:changed");
        });
        // Открытие корзины
        this.events.on("basket:open", () => {
            this.events.emit("basket:render");
        });
        // Изменение корзины
        this.events.on("basket:changed", () => {
            this.events.emit("header:counter", {
                count: this.cartModel.getCount(),
            });
            this.events.emit("basket:render");
        });
        // Открытие формы заказа
        this.events.on("order:open", () => {
            this.events.emit("order:render");
        });
        // Изменение адреса
        this.events.on("order:change", (data: Partial<IBuyer>) => {
            this.buyerModel.setData(data);
            const buyer = this.buyerModel.getData();
            const valid = buyer.payment !== null && buyer.address.trim() !== "";
            this.events.emit("order:valid", {
                valid,
                errors: valid ? "" : "Выберите способ оплаты и введите адрес",
            });
        });
        // Выбор способа оплаты
        this.events.on("payment:change", (data: { payment: "card" | "cash" }) => {
            this.buyerModel.setData({
                payment: data.payment,
            });
            const buyer = this.buyerModel.getData();
            const valid = buyer.payment !== null && buyer.address.trim() !== "";
            this.events.emit("order:valid", {
                valid,
                errors: valid ? "" : "Выберите способ оплаты и введите адрес",
            });
        });
        // Отправка формы заказа
        this.events.on("order:submit", (data: Partial<IBuyer>) => {
            this.buyerModel.setData(data);
            const buyer = this.buyerModel.getData();
            if (buyer.payment === null || buyer.address.trim() === "") {
                this.events.emit("form:errors", {
                    errors: "Выберите способ оплаты и введите адрес",
                });
                return;
            }
            this.events.emit("contacts:open");
        });
        // Изменение контактных данных
        this.events.on("contacts:change", (data: Partial<IBuyer>) => {
            this.buyerModel.setData(data);
            const buyer = this.buyerModel.getData();
            const valid = buyer.email.trim() !== "" && buyer.phone.trim() !== "";
            this.events.emit("contacts:valid", {
                valid,
                errors: valid ? "" : "Введите email и телефон",
            });
        });
        // Отправка контактной формы
        this.events.on("contacts:submit", (data: Partial<IBuyer>) => {
            this.buyerModel.setData(data);
            const buyer = this.buyerModel.getData();
            if (buyer.email.trim() === "" || buyer.phone.trim() === "") {
                this.events.emit("form:errors", {
                    errors: "Введите email и телефон",
                });
                return;
            }
            this.events.emit("order:send");
        });
        // Отправка заказа на сервер
        this.events.on("order:send", () => {
            const buyer = this.buyerModel.getData();
            const items = this.cartModel.getItems();

            if (buyer.payment === null) {
                console.error("Не выбран способ оплаты");
                return;
            }

            const order = {
                payment: buyer.payment,
                email: buyer.email,
                phone: buyer.phone,
                address: buyer.address,
                total: this.cartModel.getTotal(),
                items: items.map((item) => item.id),
            };

            this.api
                .createOrder(order)
                .then((response) => {
                    this.cartModel.clear();
                    this.buyerModel.clear();

                    this.events.emit("header:counter", {
                        count: this.cartModel.getCount(),
                    });

                    this.events.emit("order:success", response);
                })
                .catch((error) => {
                    console.error("Ошибка оформления заказа:", error);
                });
        });
    }
}
