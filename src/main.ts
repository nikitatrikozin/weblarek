import './scss/styles.scss';

import { Api } from './components/base/Api';
import { WebLarekApi } from './components/api/WebLarekApi';

import { ProductModel } from './components/models/ProductModel';
import { CartModel } from './components/models/CartModel';
import { BuyerModel } from './components/models/BuyerModel';

import { API_URL } from './utils/constants';

const productsModel = new ProductModel();
const cartModel = new CartModel();
const buyerModel = new BuyerModel();

const api = new Api(API_URL);

const webLarekApi = new WebLarekApi(api);

console.log('Корзина:', cartModel.getItems());

console.log('Покупатель:', buyerModel.getData());

webLarekApi.getProducts()
    .then((response) => {
        productsModel.setProducts(response.items);

        console.log(
            'Каталог с сервера:',
            productsModel.getProducts()
        );
    })
    .catch((error) => {
        console.error('Ошибка загрузки товаров:', error);
    });