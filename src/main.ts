import "./scss/styles.scss";

import { Api } from "./components/base/Api";
import { EventEmitter } from "./components/base/Events";
import { WebLarekApi } from "./components/api/WebLarekApi";

import { ProductModel } from "./components/models/ProductModel";
import { CartModel } from "./components/models/CartModel";
import { BuyerModel } from "./components/models/BuyerModel";

import { Presenter } from "./components/Presenter";

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
import { apiProducts } from "./utils/data";
import { IProduct } from "./types";

const events = new EventEmitter();

const productsModel = new ProductModel();
const cartModel = new CartModel();
const buyerModel = new BuyerModel();

const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

// PRESENTER

new Presenter(events, productsModel, cartModel, buyerModel, webLarekApi);

// HEADER

const header = new Header(events, ensureElement<HTMLElement>(".header"));

header.counter = cartModel.getCount();

events.on("header:counter", (data: { count: number }) => {
    header.counter = data.count;
});

// MODAL

const modal = new Modal(events, ensureElement<HTMLElement>("#modal-container"));

events.on("modal:close", () => {
    modal.close();
});

// GALLERY

const galleryElement = ensureElement<HTMLElement>(".gallery");

const gallery = new Gallery(galleryElement);

// ОТРИСОВКА КАТАЛОГА

function renderCatalog(products: IProduct[]) {
    productsModel.setProducts(products);

    const cards = productsModel.getProducts().map((product) => {
        const card = new CatalogCard(
            events,
            cloneTemplate<HTMLElement>("#card-catalog"),
            product,
        );

        return card.render(product);
    });

    gallery.catalog = cards;
}

renderCatalog(apiProducts.items);

// ПРЕДПРОСМОТР ТОВАРА

events.on("preview:open", (data: { product: IProduct }) => {
    const card = new PreviewCard(
        events,
        cloneTemplate<HTMLElement>("#card-preview"),
        data.product,
    );

    modal.open(card.render(data.product));
});

// КОРЗИНА

events.on("basket:render", () => {
    const basket = new Basket(events, cloneTemplate<HTMLElement>("#basket"));

    const basketCards = cartModel.getItems().map((product, index) => {
        const card = new BasketCard(
            events,
            cloneTemplate<HTMLElement>("#card-basket"),
            product,
        );

        return card.render({
            title: product.title,
            price: product.price,
            index: index + 1,
        });
    });

    basket.items = basketCards;
    basket.total = cartModel.getTotal();

    modal.open(basket.render());
});

// ФОРМА ЗАКАЗА

let orderForm: OrderForm | null = null;

events.on("order:render", () => {
    orderForm = new OrderForm(events, cloneTemplate<HTMLFormElement>("#order"));

    orderForm.valid = false;
    orderForm.errors = "";

    modal.open(orderForm.render());
});

// ВАЛИДАЦИЯ ФОРМЫ ЗАКАЗА

events.on("order:valid", (data: { valid: boolean; errors: string }) => {
    if (!orderForm) {
        return;
    }

    orderForm.valid = data.valid;
    orderForm.errors = data.errors;
});

// ФОРМА КОНТАКТОВ

let contactsForm: ContactsForm | null = null;

events.on("contacts:open", () => {
    contactsForm = new ContactsForm(
        events,
        cloneTemplate<HTMLFormElement>("#contacts"),
    );

    contactsForm.valid = false;
    contactsForm.errors = "";

    modal.open(contactsForm.render());
});

// ВАЛИДАЦИЯ КОНТАКТОВ

events.on("contacts:valid", (data: { valid: boolean; errors: string }) => {
    if (!contactsForm) {
        return;
    }

    contactsForm.valid = data.valid;
    contactsForm.errors = data.errors;
});

// УСПЕШНЫЙ ЗАКАЗ

events.on("order:success", (data: { total: number }) => {
    const success = new Success(events, cloneTemplate<HTMLElement>("#success"));

    modal.open(
        success.render({
            total: data.total,
        }),
    );
});

events.on("success:close", () => {
    modal.close();
});

// ПОЛУЧЕНИЕ ТОВАРОВ С СЕРВЕРА

webLarekApi
    .getProducts()
    .then((response) => {
        renderCatalog(response.items);
    })
    .catch((error) => {
        console.error("Не удалось загрузить каталог с сервера:", error);
    });
