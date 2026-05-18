import './scss/styles.scss';
import { Buyer } from "./components/Models/Buyer";
import { Basket } from "./components/Models/Basket";
import { Catalog } from "./components/Models/Catalog";
import { apiProducts } from "./utils/data";
import { Connection } from './components/Connection/connection';
import { API_URL } from './utils/constants';
import { IProduct } from './types';
import { IResponse } from './types';

const buyer = new Buyer();
const basket = new Basket();
const catalog = new Catalog();



catalog.saveProducts(apiProducts.items);
// console.log(catalog.getProducts());

catalog.saveProductDetailed(apiProducts.items[0]);
// console.log(catalog.getProductDetailed());

buyer.saveData({
  payment: "online",
  email: "y@e.ru",
  phone: "2389",
  address: "ut ts aas",
});

// console.log(buyer.getData());

// проверка запросов через api
const connection = new Connection(API_URL);
const response: IResponse = await connection.get('/product/');
const products: IProduct[] = response.items;


// Добавляем товары в корзину, используя данные с сервера, предварительно фильтруем данные у которых нет цены
products.filter(product => product.price != null).forEach(product => basket.addToBasket(product));

// Формируем данные для отправки на сервер, ${total} - общая сумма товаров в корзине, ${items} - массив id товаров из корзины
const productData: Object = basket.getBasketProducts().reduce((acc, item) => {
  if (item.price) {
    acc.total += item.price;
  }
  acc.items.push(item.id);
  return acc
}, {"total": 0, "items": new Array()});
// console.log(`Price: ${Object.values(productData)}`)

// Получаем ответ в виде JSON {id: '2762bdac-3238-458c-81df-d896a78d7020', total: 119950}
console.log(await connection.post(Object.assign(buyer, productData)));
