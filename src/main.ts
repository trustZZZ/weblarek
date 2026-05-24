import "./scss/styles.scss";
import { Buyer } from "./components/Models/Buyer";
import { Basket } from "./components/Models/Basket";
import { Catalog } from "./components/Models/Catalog";
import { apiProducts } from "./utils/data";
import { Connection } from "./components/Connection/connection";
import { API_URL } from "./utils/constants";
import { IOrder, IProduct } from "./types";
import { IResponse } from "./types";
import { Api } from "./components/base/Api";

const buyer = new Buyer();
const basket = new Basket();
const catalog = new Catalog();
const productsFromServer: IProduct[] = new Array<IProduct>();

// Проверка моделей
// 1. Buyer
// сохранения данных покупателя
buyer.saveData({
  phone: "2389",
  address: "Marshal street",
});
// получение данных :покупателя
console.log(
  `Проверка сохранения данных пользователя: ${JSON.stringify(Object.values(buyer.getData()))}`,
);
// Очистка данных покупателя и ее проверка
console.log("Удаление данных о пользователе...");
buyer.clearData();
console.log(`Данные после отчистки: ${Object.values(buyer.getData())}`);

// 2. Basket
// добавить в корзину товары
basket.addToBasket(apiProducts.items[0]);
basket.addToBasket(apiProducts.items[1]);
basket.addToBasket(apiProducts.items[2]);
// проверка добавления в корзину
console.log(`Товары в корзине:`);
basket.getBasketProducts().forEach((el) => console.log(el));
// удаление товара из корзины
const productToDelete: IProduct = basket.getBasketProducts()[2];
basket.deleteFromBasket(productToDelete);
console.log(`Товар с id ${productToDelete.id} удален`);
console.log(`Товары в корзине:`);
basket.getBasketProducts().forEach((el) => console.log(el));

// получение полной суммы товаров
console.log(`Сумма всех товаров в корзине: ${basket.getTotalPrice()}`);

// подсчет количества товаров в корзине
console.log(`Товаров в корзине: ${basket.countBasketProducts()}`);

// проверка наличия товара
console.log(
  `Товар с id c101ab44-ed99-4a54-990d-47aa2bb4e7d9: ${basket.isInBasketById("c101ab44-ed99-4a54-990d-47aa2bb4e7d9") ? "есть" : "нет"}`,
);

// удаление всех товаров из корзины
console.log("Очистка корзины...");
basket.clearBasket();
console.log(`Товаров в корзине: ${basket.countBasketProducts()}`);

// 3. Catalog
// сохранение товаров в каталоге
catalog.saveProducts(apiProducts.items);
// проверка получения и сохранения товаров в каталоге
console.log("Проверка получения и сохранения товаров в каталоге");
console.log(catalog.getProducts());
// получение товара по id
console.log(
  `Поиск товара по id='c101ab44-ed99-4a54-990d-47aa2bb4e7d9': описание - '${catalog.getProductById("c101ab44-ed99-4a54-990d-47aa2bb4e7d9")?.description}'`,
);
console.log(`Товар с несущействующим id='123': ${catalog.getProductById("123")}`);
// сохранение товара для детального отображения
catalog.saveProductDetailed(apiProducts.items[0]);
// проверка сохранения и получения
console.log(
  `Товар для детального просмотра: ${JSON.stringify(catalog.getProductDetailed())}`,
);

// 4. Проверка запросов через api

// асинхронная функция для обработки запроса с сервера
async function downloadData(): Promise<IResponse> {
  const response: IResponse = await connection.get();
  productsFromServer.push(...response.items);
  return response;
}

const connection = new Connection(new Api(API_URL));
await downloadData().catch(console.error);
console.log("Получение данных с сервера:");
console.log(productsFromServer);

// Добавляем товары в корзину, используя данные с сервера, предварительно фильтруем данные у которых нет цены
productsFromServer
  .filter((product) => product.price != null)
  .forEach((product) => basket.addToBasket(product));

console.log(
  "Добавление только тех товаров, у которых есть цена. Товаров в корзине: " +
    basket.getBasketProducts().length,
);

// Добавляем пользователя
buyer.saveData({
  payment: "card",
  email: "test@test.ru",
  phone: "2389",
  address: "Marshal street",
});

// Создане массива данных для отправки данных на сервер
const data: IOrder = Object.assign(
  {
    total: basket.getTotalPrice(),
    items: basket.getBasketProducts().map((product) => product.id),
  },
  buyer,
);
console.log("Отправка данных на сервер...");
// Получаем ответ в виде JSON {id: '2762bdac-3238-458c-81df-d896a78d7020', total: 119950}
console.log(`Ответ с сервера: ${JSON.stringify(await connection.post(data))}`);