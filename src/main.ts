import "./scss/styles.scss";

import { Api } from "./components/base/Api";
import { EventEmitter } from "./components/base/Events";
import { WebLarekApi } from "./components/api/WebLarekApi";

import { ProductModel } from "./components/models/ProductModel";
import { CartModel } from "./components/models/CartModel";
import { BuyerModel } from "./components/models/BuyerModel";

import { Modal } from "./components/view/Modal";
import { Header } from "./components/view/Header";
import { Gallery } from "./components/view/Gallery";
import { CatalogCard } from "./components/view/CatalogCard";
import { PreviewCard } from "./components/view/PreviewCard";
import { Basket } from "./components/view/Basket";
import { BasketCard } from "./components/view/BasketCard";
import { OrderForm } from "./components/view/OrderForm";
import { ContactsForm } from "./components/view/ContactsForm";
import { Success } from "./components/view/Success";

import { ensureElement, cloneTemplate } from "./utils/utils";
import { API_URL } from "./utils/constants";

const events = new EventEmitter();

const productsModel = new ProductModel(events);
const cartModel = new CartModel(events);
const buyerModel = new BuyerModel(events);

const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

/*
   HEADER
*/
const header = new Header(ensureElement<HTMLElement>(".header"), events);

header.counter = cartModel.getCount();

events.on("header:counter", (data: { count: number }) => {
    header.counter = data.count;
});

/*
   MODAL
*/
const modal = new Modal(ensureElement<HTMLElement>("#modal-container"), events);

events.on("modal:close", () => {
    modal.close();
});

/*
   GALLERY
*/
const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"));

events.on("products:changed", () => {
    const cards = productsModel.getProducts().map((product) => {
        const card = new CatalogCard(
            cloneTemplate<HTMLElement>("#card-catalog"),
            events,
        );

        return card.render(product);
    });

    gallery.catalog = cards;
});

/*
   ВЫБОР ТОВАРА
*/
events.on("card:select", (data: { id: string }) => {
    const product = productsModel.getProduct(data.id);

    if (!product) {
        return;
    }

    productsModel.setPreview(product);
});

/*
   ПРЕДПРОСМОТР ТОВАРА
*/
events.on("preview:changed", () => {
    const product = productsModel.getPreview();

    if (!product) {
        return;
    }

    const card = new PreviewCard(
        cloneTemplate<HTMLElement>("#card-preview"),
        events,
    );

    modal.open(card.render(product));
});

/*
   ДОБАВЛЕНИЕ В КОРЗИНУ
*/
events.on("card:buy", (data: { id: string }) => {
    const product = productsModel.getProduct(data.id);

    if (!product) {
        return;
    }

    cartModel.add(product);
    modal.close();
});

/*
   КОРЗИНА
*/
events.on("basket:open", () => {
    const basket = new Basket(cloneTemplate<HTMLElement>("#basket"), events);

    const basketCards = cartModel.getItems().map((product, index) => {
        const card = new BasketCard(
            cloneTemplate<HTMLElement>("#card-basket"),
            events,
            product,
        );

        return card.render({
            id: product.id,
            title: product.title,
            price: product.price,
            index: index + 1,
        });
    });

    basket.items = basketCards;
    basket.total = cartModel.getTotal();

    modal.open(basket.render());
});

/*
   УДАЛЕНИЕ ИЗ КОРЗИНЫ
*/
events.on("basket:remove", (data: { id: string }) => {
    const product = productsModel.getProduct(data.id);

    if (!product) {
        return;
    }

    cartModel.remove(product);
    events.emit("basket:render");
});

/*
   ИЗМЕНЕНИЕ КОРЗИНЫ
*/
events.on("cart:changed", () => {
    events.emit("header:counter", {
        count: cartModel.getCount(),
    });
});

/*
   ФОРМА ЗАКАЗА
*/
let orderForm: OrderForm | null = null;

events.on("order:render", () => {
    orderForm = new OrderForm(cloneTemplate<HTMLFormElement>("#order"), events);

    const buyer = buyerModel.getData();

    orderForm.payment = buyer.payment;
    orderForm.address = buyer.address;

    const errors = buyerModel.validate();

    const orderErrors = [errors.payment, errors.address].filter(Boolean);

    orderForm.valid = orderErrors.length === 0;
    orderForm.errors = orderErrors.join(", ");

    modal.open(orderForm.render());
});

/*
   СПОСОБ ОПЛАТЫ
*/
events.on("payment:change", (data: { payment: "card" | "cash" }) => {
    buyerModel.setData({
        payment: data.payment,
    });
});

/*
   АДРЕС
*/
events.on("order:change", (data: { address: string }) => {
    buyerModel.setData({
        address: data.address,
    });
});

/*
   ВАЛИДАЦИЯ ЗАКАЗА
*/
events.on("order:valid", (data: { valid: boolean; errors: string }) => {
    if (!orderForm) {
        return;
    }

    orderForm.valid = data.valid;
    orderForm.errors = data.errors;
});

/*
   ОТПРАВКА ФОРМЫ ЗАКАЗА
*/
events.on("order:submit", () => {
    const errors = buyerModel.validate();

    const orderErrors = [errors.payment, errors.address].filter(Boolean);

    if (orderErrors.length > 0) {
        events.emit("order:valid", {
            valid: false,
            errors: orderErrors.join(", "),
        });

        return;
    }

    events.emit("contacts:open");
});

/*
   ФОРМА КОНТАКТОВ
*/
let contactsForm: ContactsForm | null = null;

events.on("contacts:open", () => {
    contactsForm = new ContactsForm(
        cloneTemplate<HTMLFormElement>("#contacts"),
        events,
    );

    const buyer = buyerModel.getData();

    contactsForm.email = buyer.email;
    contactsForm.phone = buyer.phone;

    const errors = buyerModel.validate();

    const contactsErrors = [errors.email, errors.phone].filter(Boolean);

    contactsForm.valid = contactsErrors.length === 0;
    contactsForm.errors = contactsErrors.join(", ");

    modal.open(contactsForm.render());
});

/*
   EMAIL / PHONE
*/
events.on("contacts:change", (data: { email?: string; phone?: string }) => {
    buyerModel.setData(data);
});

/*
   ВАЛИДАЦИЯ КОНТАКТОВ
*/
events.on("contacts:valid", (data: { valid: boolean; errors: string }) => {
    if (!contactsForm) {
        return;
    }

    contactsForm.valid = data.valid;
    contactsForm.errors = data.errors;
});

/*
   ОТПРАВКА КОНТАКТОВ
*/
events.on("contacts:submit", () => {
    const errors = buyerModel.validate();

    const contactsErrors = [errors.email, errors.phone].filter(Boolean);

    if (contactsErrors.length > 0) {
        events.emit("contacts:valid", {
            valid: false,
            errors: contactsErrors.join(", "),
        });

        return;
    }

    events.emit("order:send");
});

/*
   ИЗМЕНЕНИЕ ДАННЫХ ПОКУПАТЕЛЯ
*/
events.on("buyer:changed", () => {
    const errors = buyerModel.validate();

    const orderErrors = [errors.payment, errors.address].filter(Boolean);

    const contactsErrors = [errors.email, errors.phone].filter(Boolean);

    events.emit("order:valid", {
        valid: orderErrors.length === 0,
        errors: orderErrors.join(", "),
    });

    events.emit("contacts:valid", {
        valid: contactsErrors.length === 0,
        errors: contactsErrors.join(", "),
    });
});

/*
   ОТПРАВКА ЗАКАЗА
*/
events.on("order:send", () => {
    const buyer = buyerModel.getData();
    const items = cartModel.getItems();

    if (!buyer.payment) {
        return;
    }

    webLarekApi
        .createOrder({
            payment: buyer.payment,
            email: buyer.email,
            phone: buyer.phone,
            address: buyer.address,
            total: cartModel.getTotal(),
            items: items.map((item) => item.id),
        })
        .then((response) => {
            const total = response.total;

            cartModel.clear();
            buyerModel.clear();

            modal.open(
                new Success(cloneTemplate<HTMLElement>("#success"), events).render({
                    total,
                }),
            );
        })
        .catch((error) => {
            console.error("Не удалось оформить заказ:", error);
        });
});

/*
   УСПЕШНЫЙ ЗАКАЗ
*/
events.on("success:close", () => {
    modal.close();
});

/*
   ПОЛУЧЕНИЕ ТОВАРОВ С СЕРВЕРА
*/
webLarekApi
    .getProducts()
    .then((response) => {
        productsModel.setProducts(response.items);
    })
    .catch((error) => {
        console.error("Не удалось загрузить каталог с сервера:", error);
    });
