import "./scss/styles.scss";
import { Buyer } from "./components/Models/Buyer";
import { Basket } from "./components/Models/Basket";
import { Catalog } from "./components/Models/Catalog";
import { Connection } from "./components/Connection/connection";
import { API_URL, CDN_URL } from "./utils/constants";
import { IAdress, IContacts, IOrder, IPaymentCheck, IProduct } from "./types";
import { Api } from "./components/base/Api";
import { Header } from "./components/View/Header/Header";
import { EventEmitter } from "./components/base/Events";
import { Modal } from "./components/View/Modal/Modal";
import { OrderSuccessful } from "./components/View/Order/Order";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { Gallery } from "./components/View/Gallery/Gallery";
import { BasketView } from "./components/View/Basket/BasketView";
import { OrderForm } from "./components/View/Forms/OrderForm";
import { ContactsForm } from "./components/View/Forms/ContactsForm";
import { CatalogCard } from "./components/View/Card/CatalogCard";
import { PreviewCard } from "./components/View/Card/PreviewCard";
import { BasketCard } from "./components/View/Card/BasketCard";
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
        const selectedProduct = catalog.getProductDetailed();
        if (selectedProduct) {
          const isInBasket = basket.isInBasketById(selectedProduct.id);
          if (isInBasket) {
            basket.deleteFromBasket(selectedProduct); // удаляем из корзины
          } else {
            basket.addToBasket(selectedProduct); // добавляем в корзину
          }
          // Обновляем текст кнопки
          card.buttonText = isInBasket ? "В корзину" : "Удалить из корзины";
        }
      },
    },
  );
  // Обновляем текст кнопки
  card.buttonText = basket.isInBasketById(product.id)
    ? "Удалить из корзины"
    : "В корзину";
  modal.open(card.render(product));
});

// 3. Пользователь добавил карточку в корзину
events.on("card:addToBasket", () => {
  // Добавление карточки в модель
  const product = catalog.getProductDetailed();
  if (product) {
    basket.addToBasket(product);
  }
});

// Если карточка добавилась, то отображаем ее
events.on("basket:changed", () => {
  const basketItems = basket.getBasketProducts().map((product, index) => {
    const basketCard = new BasketCard(
      cloneTemplate<HTMLLIElement>(templateBasketCard),
      {
        onClick: () => basket.deleteFromBasket(product),
      },
    );
    return basketCard.render({
      seqNumber: index + 1,
      price: product.price ?? 0,
      title: product.title,
    });
  });
  header.render({ counter: basket.countBasketProducts() });
  basketView.render({
    items: basketItems,
    totalPrice: basket.getTotalPrice(),
  });
  basketView.orederButtonActive = basket.getBasketProducts().length != 0;
});

// 4. Пользователь открыл корзину
events.on("basket:open", () => {
  modal.open(basketView.render());
});

// 6. Пользователь выбрал "Оплатить"
events.on("basket:order", () => {
  modal.open(orderForm.render());
});

// 7. Пользователь выбрал способ оплаты
events.on("form:paymentSelected", (event: IPaymentCheck) => {
  orderForm.payment = event.payment;
  buyer.saveData({
    payment: event.payment,
  });
});

// 8. Пользователь заполнил адресс
events.on("form:address", (event: IAdress) => {
  // проверка валидности формы, если да, то
  buyer.saveData({ address: event.address });
});

// 9. Пользователь заполнил контактные данные
events.on("contacts-form:email", (event: IContacts) => {
  buyer.saveData({ email: event.email });
});
events.on("contacts-form:phone", (event: IContacts) => {
  buyer.saveData({ phone: event.phone });
});

// 10. Данные пользователя изменились
events.on("user:dataChanged", () => {
  const errors = buyer.validateData();
  // Если пользователь заполнил данные, то кнопка становиться активной
  const orderErrors = [errors?.address, errors?.payment]
    .filter(Boolean)
    .join("; ");
  if (orderErrors.length == 0) {
    orderForm.active = true;
    orderForm.addressText = buyer.getData().address;
    orderForm.error = "";
  } else {
    orderForm.error = orderErrors;
    orderForm.active = false;
  }

  const contactsErrors = [errors?.email, errors?.phone]
    .filter(Boolean)
    .join("; ");
  console.log(buyer.getData());
  if (contactsErrors.length == 0) {
    contactsForm.active = true;
    contactsForm.emailText = buyer.getData().email;
    contactsForm.phoneText = buyer.getData().phone;
    contactsForm.error = "";
  } else {
    contactsForm.error = contactsErrors;
    contactsForm.active = false;
  }
});

// 11. Переход от формы с оплатой до формы с контактными данными
events.on("form:next", () => {
  modal.open(contactsForm.render());
});

// 12. Обработка успешного заказа
events.on("success-modal:close", () => {
  buyer.clearData();
  basket.clearBasket();
  modal.close();
})

// 13. Окно успешной оплаты
events.on("form:pay", () => {
  const oreder: IOrder = {
  payment: buyer.getData().payment,
  email: buyer.getData().email,
  phone: buyer.getData().phone,
  address: buyer.getData().address,
  total: basket.getTotalPrice(),
  items: basket.getBasketProducts().map(item => item.id)
};
  connection.postOrderData(oreder).then((result) => modal.open(orderSuccessful.render({totalPrice: result.total})));
});
