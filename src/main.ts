import "./scss/styles.scss";
import { Buyer } from "./components/Models/Buyer";
import { Basket } from "./components/Models/Basket";
import { Catalog } from "./components/Models/Catalog";
import { Connection } from "./components/Connection/connection";
import { API_URL, CDN_URL } from "./utils/constants";
import { IAdress, IContacts, IDelete, IPaymentCheck, IProduct } from "./types";
import { Api } from "./components/base/Api";
import { Header } from "./components/View/Header/Header";
import { EventEmitter } from "./components/base/Events";
import { Modal } from "./components/View/Modal/Modal";
import { OrderSuccessful } from "./components/View/Order/Order";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { Gallery } from "./components/View/Gallery/Gallery";
import {
  BasketCard,
  CatalogCard,
  PreviewCard,
} from "./components/View/Card/Card";
import { BasketView } from "./components/View/Basket/BasketView";
import { ContactsForm, OrderForm } from "./components/View/Forms/Forms";
const events = new EventEmitter();

const buyer = new Buyer(events);
const basket = new Basket(events);
const catalog = new Catalog(events);

// Подключение api
const api = new Api(API_URL);

const connection = new Connection(api);

// Константы для темплейтов элементов магазина
const templateCardCatalog = "#card-catalog";
const templateCardPreview = "#card-preview";
const templateModal = "#modal-container";
const templateBasketView = "#basket";
const templateBasketCard = "#card-basket";
const templateOrderFrom = "#order";
const templateContactsFrom = "#contacts";
const templateOrderSuccessful = "#success";

// Инициализация компонентов
const orderSuccessful = new OrderSuccessful(
  events,
  cloneTemplate<HTMLElement>(templateOrderSuccessful),
);
const container = ensureElement<HTMLElement>(".page__wrapper");
const orderForm = new OrderForm(
  events,
  cloneTemplate<HTMLElement>(templateOrderFrom),
);
const contactsForm = new ContactsForm(
  events,
  cloneTemplate<HTMLElement>(templateContactsFrom),
);
const gallery = new Gallery(container);
const header = new Header(events, ensureElement<HTMLElement>(".header"));
const modal = new Modal(events, ensureElement<HTMLElement>(templateModal));
const basketView = new BasketView(
  events,
  cloneTemplate<HTMLElement>(templateBasketView),
);

// Подключение к API приложения
connection
  .getProductsFromServer()
  .then((result) => {
    result.items.forEach((product) => {
      product.image = `${CDN_URL}${product.image}`;
    });
    catalog.saveProducts(result.items);
  })
  .catch(console.error);

// Обработка событий
// 1. Получение карточкек с сервера
events.on("gallery:changed", () => {
  const itemCard = catalog.getProducts().map((item) => {
    const card = new CatalogCard(
      cloneTemplate<HTMLElement>(templateCardCatalog),
      {
        onClick: () => {
          events.emit("card:selected", item);
        },
      },
    );
    return card.render(item);
  });
  gallery.render({ catalog: itemCard });
});
// 2. Выбор карточки пользователем с подробным описанием
events.on("card:selected", (product: IProduct) => {
  // поиск карточки по ID
  const cardByID = catalog.getProductById(product.id);
  // Если карточка найдена, то сохраняем ее в модели данных
  if (cardByID) {
    catalog.saveProductDetailed(cardByID);
  }
});

events.on("catalog:cardDetailedChanged", (product: IProduct) => {
  // Отображение
  const card = new PreviewCard(
    cloneTemplate<HTMLElement>(templateCardPreview),
    {
      onClick: () => {
        events.emit("card:addToBasket", product);
      },
    },
  );
  modal.render({ content: card.render(product) });
});

// 3. Пользователь добавил карточку в корзину
events.on("card:addToBasket", (product: IProduct) => {
  // Добавление карточки в модель
  basket.addToBasket(product);
});

// Если карточка добавилась, то отображаем ее
events.on("basket:productAdded", (product: IProduct) => {
  const basketCard = new BasketCard(
    cloneTemplate<HTMLLIElement>(templateBasketCard),
    {
      onClick: () =>
        events.emit("basket:deleteItem", {
          product: product,
          card: basketCard,
        }),
    },
  );
  basketCard.render({
    seqNumber: basket.countBasketProducts(),
    price: product.price ?? 0,
  });
  basketView.render({
    newCard: basketCard.render(),
    totalPrice: basket.getTotalPrice(),
  });
  header.render({ counter: basket.countBasketProducts() });
});

// 4. Пользователь открыл корзину
events.on("basket:open", () => {
  basketView.makeOrder = basket.countBasketProducts() > 0;
  modal.render({ content: basketView.render() });
});

events.on("modal:close", () => {
  modal.render().classList.remove("modal_active");
});

// 5. Пользователь удалил товар из корзины
events.on("basket:deleteItem", (event: IDelete) => {
  basket.deleteFromBasket(event.product);
  basketView.deleteItem(event.card.render());

  basketView.totalPrice = basket.getTotalPrice();
  basketView.makeOrder = basket.countBasketProducts() > 0;
});

// 6. Пользователь выбрал "Оплатить"
events.on("basket:order", () => {
  modal.render({ content: orderForm.render() });
});

// 7. Пользователь выбрал способ оплаты
events.on("form:paymentSelected", (event: IPaymentCheck) => {
  // проверка валидности формы, если да, то
  let payment = null;
  if (!buyer.getData().payment || buyer.getData().payment != event.payment) {
    payment = event.payment;
  }
  orderForm.payment = payment;
    buyer.saveData({
      payment: payment,
    });
});

// 8. Пользователь заполнил адресс
events.on("form:address", (event: IAdress) => {
  // проверка валидности формы, если да, то
  buyer.saveData({ address: event.address });
});

// 9. Пользователь заполнил контактные данные
events.on("form:contacts", (event: IContacts) => {
  // проверка валидности формы, если да, то

  if (event?.email) {
    buyer.saveData({ email: event?.email });
  }
  if (event?.phone) {
    buyer.saveData({ phone: event?.phone });
  }
});

events.on("user:dataChanged", () => {
  // Если пользователь заполнил данные, то кнопка становиться активной
  if (!buyer.validateData()?.email && !buyer.validateData()?.phone) {
    contactsForm.active = true;
  } else if (buyer.validateData()?.email || buyer.validateData()?.phone) {
    contactsForm.active = false;
  }
  if (!buyer.validateData()?.address && !buyer.validateData()?.payment) {
    orderForm.active = true;
  } else if (buyer.validateData()?.address || buyer.validateData()?.payment) {
    orderForm.active = false;
  }
});

// 10. Переход от формы с оплатой до формы с контактными данными
events.on("form:next", () => {
  modal.render({ content: contactsForm.render() });
});

// 11. Окно успешной оплаты
events.on("form:pay", () => {
  modal.render({
    content: orderSuccessful.render({ totalPrice: basket.getTotalPrice() }),
  });

  basket.clearBasket();
  header.render({ counter: 0 });
  basketView.clear();
  basketView.totalPrice = basket.getTotalPrice();
});
