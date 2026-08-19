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
import { API_URL, CDN_URL } from "./utils/constants";
import { IProduct } from "./types";

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

/*
   MODAL
*/

const modal = new Modal(ensureElement<HTMLElement>("#modal-container"));
/*
   GALLERY
*/

const gallery = new Gallery(ensureElement<HTMLElement>(".gallery"));

/*
   КАРТОЧКА ПРЕДПРОСМОТРА
*/

events.on("preview:toggle", () => {
    const product = productsModel.getPreview();

    if (!product) {
        return;
    }

    if (cartModel.hasProduct(product.id)) {
        cartModel.remove(product);
    } else {
        cartModel.add(product);
    }

    modal.close();
});

const previewCard = new PreviewCard(
    cloneTemplate<HTMLElement>("#card-preview"),
    () => events.emit("preview:toggle"),
);

/*
   КОРЗИНА
*/

const basket = new Basket(cloneTemplate<HTMLElement>("#basket"), events);

/*
   ФОРМА ЗАКАЗА
*/

const orderForm = new OrderForm(
    cloneTemplate<HTMLFormElement>("#order"),
    events,
);

/*
   ФОРМА КОНТАКТОВ
*/

const contactsForm = new ContactsForm(
    cloneTemplate<HTMLFormElement>("#contacts"),
    events,
);

/*
   УСПЕШНЫЙ ЗАКАЗ
*/

const success = new Success(cloneTemplate<HTMLElement>("#success"), events);

/*
   ЗАГРУЗКА КАТАЛОГА
*/

events.on("products:changed", () => {
    const cards = productsModel.getProducts().map((product) => {
        const card = new CatalogCard(
            cloneTemplate<HTMLElement>("#card-catalog"),
            () => events.emit("card:select", product),
        );

        return card.render(product);
    });

    gallery.catalog = cards;
});

events.on("card:select", (product: IProduct) => {
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

    previewCard.buttonText = cartModel.hasProduct(product.id)
        ? "Удалить из корзины"
        : "В корзину";

    previewCard.buttonDisabled = product.price === null;

    modal.open(previewCard.render(product));
});

/*
   КОРЗИНА
*/

events.on("basket:open", () => {
    modal.open(basket.render());
});

/*
   ИЗМЕНЕНИЕ КОРЗИНЫ
*/

events.on("cart:changed", () => {
    const basketCards = cartModel.getItems().map((product, index) => {
        const card = new BasketCard(
            cloneTemplate<HTMLElement>("#card-basket"),
            () => events.emit("basket:remove", product),
        );

        return card.render({
            title: product.title,
            price: product.price,
            index: index + 1,
        });
    });

    basket.items = basketCards;
    basket.total = cartModel.getTotal();
    header.counter = cartModel.getCount();
});

events.on("basket:remove", (product: IProduct) => {
    cartModel.remove(product);
});

/*
   ФОРМА ЗАКАЗА
*/

events.on("order:render", () => {
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
   ИЗМЕНЕНИЕ ДАННЫХ ЗАКАЗА
*/

events.on("payment:change", (data: { payment: "card" | "cash" }) => {
    buyerModel.setData({
        payment: data.payment,
    });
});

events.on("order:change", (data: { address: string }) => {
    buyerModel.setData({
        address: data.address,
    });
});

/*
   ФОРМА КОНТАКТОВ
*/

events.on("order:submit", () => {
    const buyer = buyerModel.getData();

    contactsForm.email = buyer.email;
    contactsForm.phone = buyer.phone;

    modal.open(contactsForm.render());
});

/*
   ИЗМЕНЕНИЕ КОНТАКТОВ
*/

events.on("contacts:change", (data: { email?: string; phone?: string }) => {
    buyerModel.setData(data);
});

/*
   ОТПРАВКА КОНТАКТОВ
*/

events.on("contacts:submit", () => {
    const buyer = buyerModel.getData();

    webLarekApi
        .createOrder({
            payment: buyer.payment!,
            email: buyer.email,
            phone: buyer.phone,
            address: buyer.address,
            total: cartModel.getTotal(),
            items: cartModel.getItems().map((item) => item.id),
        })
        .then((response) => {
            cartModel.clear();
            buyerModel.clear();

            success.total = response.total;

            modal.open(
                success.render({
                    total: response.total,
                }),
            );
        })
        .catch((error) => {
            console.error("Не удалось оформить заказ:", error);
        });
});

/*
   ИЗМЕНЕНИЕ ДАННЫХ ПОКУПАТЕЛЯ
*/

events.on("buyer:changed", () => {
    const buyer = buyerModel.getData();

    orderForm.payment = buyer.payment;
    orderForm.address = buyer.address;

    contactsForm.email = buyer.email;
    contactsForm.phone = buyer.phone;

    const errors = buyerModel.validate();

    const orderErrors = [errors.payment, errors.address].filter(Boolean);

    const contactsErrors = [errors.email, errors.phone].filter(Boolean);

    orderForm.valid = orderErrors.length === 0;
    orderForm.errors = orderErrors.join(", ");

    contactsForm.valid = contactsErrors.length === 0;

    contactsForm.errors = contactsErrors.join(", ");
});

/*
   ЗАКРЫТИЕ МОДАЛЬНОГО ОКНА
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
        const products = response.items.map((product) => ({
            ...product,
            image: product.image.startsWith("http")
                ? product.image
                : `${CDN_URL}${product.image}`,
        }));

        productsModel.setProducts(products);
    })
    .catch((error) => {
        console.error("Не удалось загрузить каталог с сервера:", error);
    });
