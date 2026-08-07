import './scss/styles.scss';

import { Api } from './components/base/Api';
import { WebLarekApi } from './components/api/WebLarekApi';

import { ProductModel } from './components/models/ProductModel';
import { CartModel } from './components/models/CartModel';
import { BuyerModel } from './components/models/BuyerModel';

import { API_URL } from './utils/constants';
import { apiProducts } from './utils/data';

const productsModel = new ProductModel();
const cartModel = new CartModel();
const buyerModel = new BuyerModel();  

const api = new Api(API_URL);
const webLarekApi = new WebLarekApi(api);

//           ProductModel           //

productsModel.setProducts(apiProducts.items);

console.log('Все товары:', productsModel.getProducts());

productsModel.setPreview(apiProducts.items[0]);
      
console.log(
    'Товар для предпросмотра:',
    productsModel.getPreview()
);

console.log(
    'Товар по id:',
    productsModel.getProduct(apiProducts.items[0].id)
);

//           CartModel          //

cartModel.add(apiProducts.items[0]);
cartModel.add(apiProducts.items[1]);

console.log('Товары в корзине:', cartModel.getItems());

console.log(
    'Количество товаров:',
    cartModel.getCount()
);

console.log(
    'Стоимость корзины:',
    cartModel.getTotal()
);

console.log(
    'Есть ли товар в корзине:',
    cartModel.hasProduct(apiProducts.items[0].id)
);

cartModel.remove(apiProducts.items[0]);

console.log(
    'Корзина после удаления:',
    cartModel.getItems()
);

cartModel.clear();

console.log(
    'Корзина после очистки:',
    cartModel.getItems()
);

//           BuyerModel        // 

buyerModel.setData({
    payment: 'card',
    email: 'test@test.ru',
});

buyerModel.setData({
    phone: '+79999999999',
    address: 'Москва',
});

console.log(
    'Данные покупателя:',
    buyerModel.getData()
);

console.log(
    'Ошибки валидации:',
    buyerModel.validate()
);

buyerModel.clear();

console.log(
    'Покупатель после очистки:',
    buyerModel.getData()
);

//         API         //

webLarekApi.getProducts()
    .then((response) => {
        productsModel.setProducts(response.items);

        console.log(
            'Каталог с сервера:',
            productsModel.getProducts()
        );
    })
    .catch((error) => {
        console.error(
            'Ошибка загрузки товаров:',
            error
        );
    });