# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Vite

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/main.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run dev
```

или

```
yarn
yarn dev
```

## Сборка

```
npm run build
```

или

```
yarn build
```

# Интернет-магазин «Web-Larёk»

«Web-Larёk» — это интернет-магазин с товарами для веб-разработчиков, где пользователи могут просматривать товары, добавлять их в корзину и оформлять заказы. Сайт предоставляет удобный интерфейс с модальными окнами для просмотра деталей товаров, управления корзиной и выбора способа оплаты, обеспечивая полный цикл покупки с отправкой заказов на сервер.

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP (Model-View-Presenter), которая обеспечивает четкое разделение ответственности между классами слоев Model и View. Каждый слой несет свой смысл и ответственность:

Model - слой данных, отвечает за хранение и изменение данных.  
View - слой представления, отвечает за отображение данных на странице.  
Presenter - презентер содержит основную логику приложения и отвечает за связь представления и данных.

Взаимодействие между классами обеспечивается использованием событийно-ориентированного подхода. Модели и Представления генерируют события при изменении данных или взаимодействии пользователя с приложением, а Презентер обрабатывает эти события используя методы как Моделей, так и Представлений.

### Базовый код

#### Класс Component

Является базовым классом для всех компонентов интерфейса.
Класс является дженериком и принимает в переменной `T` тип данных, которые могут быть переданы в метод `render` для отображения.

Конструктор:  
`constructor(container: HTMLElement)` - принимает ссылку на DOM элемент за отображение, которого он отвечает.

Поля класса:  
`container: HTMLElement` - поле для хранения корневого DOM элемента компонента.

Методы класса:  
`render(data?: Partial<T>): HTMLElement` - Главный метод класса. Он принимает данные, которые необходимо отобразить в интерфейсе, записывает эти данные в поля класса и возвращает ссылку на DOM-элемент. Предполагается, что в классах, которые будут наследоваться от `Component` будут реализованы сеттеры для полей с данными, которые будут вызываться в момент вызова `render` и записывать данные в необходимые DOM элементы.  
`setImage(element: HTMLImageElement, src: string, alt?: string): void` - утилитарный метод для модификации DOM-элементов `<img>`

#### Класс Api

Содержит в себе базовую логику отправки запросов.

Конструктор:  
`constructor(baseUrl: string, options: RequestInit = {})` - В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Поля класса:  
`baseUrl: string` - базовый адрес сервера  
`options: RequestInit` - объект с заголовками, которые будут использованы для запросов.

Методы:  
`get(uri: string): Promise<object>` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер  
`post(uri: string, data: object, method: ApiPostMethods = 'POST'): Promise<object>` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.  
`handleResponse(response: Response): Promise<object>` - защищенный метод проверяющий ответ сервера на корректность и возвращающий объект с данными полученный от сервера или отклоненный промис, в случае некорректных данных.

#### Класс EventEmitter

Брокер событий реализует паттерн "Наблюдатель", позволяющий отправлять события и подписываться на события, происходящие в системе. Класс используется для связи слоя данных и представления.

Конструктор класса не принимает параметров.

Поля класса:  
`_events: Map<string | RegExp, Set<Function>>)` - хранит коллекцию подписок на события. Ключи коллекции - названия событий или регулярное выражение, значения - коллекция функций обработчиков, которые будут вызваны при срабатывании события.

Методы класса:  
`on<T extends object>(event: EventName, callback: (data: T) => void): void` - подписка на событие, принимает название события и функцию обработчик.  
`emit<T extends object>(event: string, data?: T): void` - инициализация события. При вызове события в метод передается название события и объект с данными, который будет использован как аргумент для вызова обработчика.  
`trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие с передачей в него данных из второго параметра.

## Данные

В приложении используются две сущности: товары и данные, которые описываются соответствующими интерфейсами.
`interface IProduct` - интерфейс товара, соответствующий данным, которые приходят с сервера.

Поля интерфейса
`id: string` - уникальный индентификатор товара.
`description: string` - описание товара.
`image: string` - путь к изображению товара.
`title: string` - наименование товара.
`category: string` - наименование категории, к которой отностится товар.
`price: number | null` - цена товара. Цена может отсутствовать.

`interface IBuyer` - интерфейс покупателя, соответствующий данным, которые приходят с сервера.

Поля интерфейса
`payment: IPaymentType` - тип оплаты (онлайн или наличными).
`email: string` - адрес электронной почнты.
`phone: string` - номер телефона покупателя.
`address: string` - адрес покупателя.

`interface IResponse` - интерфейс для получения данных с сервера.

Поля интерфейса:
`total: number;` - итоговая цена товаров.
`items: IProduct[]` - список всех товаров с типом IProduct.

`interface IOrder extends IBuyer` - интерфейс передающий данные на сервер (пользователя, список из id всех товаров и итоговую сумму).

Поля интерфейса:
`items: string[]` - список из id всех товаров.
`total: number` - итоговая сумма товаров в корзине.

`type IPaymentType = "card" | "cash" | null` - тип оплаты.

Все поля являются обязательными.

## Модели данных

### Класс Catalog

Хранит товары, которые которые можно купить в приложении.

Конструктор:
`constructor()` - инициализирует поля класса.

Поля класса:
`protected products: Array<IProduct>` - хранит множество товаров.
`protected productDetailed: IProduct | null` - хранит товар для подробного отображения.

Методы класса:
`saveProducts(products: IProduct[]): void` - сохранение массива товаров полученного в параметрах метода.
`getProducts(): IProduct[]` - возвращение массива товаров из модели.
`getProductById(id: string): IProduct | undefined` - возвращение товара по id, если такого товара нет, то ubderfined.
`saveProductDetailed(product: IProduct): void` - сохранение товара для подробного отображения.
`getProductDetailed(): IProduct | null` - получение товара для подробного отображения.

### Класс Basket

Хранение товаров, которые пользователь выбрал для покупки.

Конструктор:
`constructor()` - создает пустой массив корзины.

Поля класса:
`protected wishedProducts: IProduct[]` - массив товаров, выбранных покупателем для покупки.

Методы класса:
`getBasketProducts(): IProduct[]` - получение массива товаров, которые находятся в корзине.
`addToBasket(product: IProduct): void` - добавление товара, который был получен в параметре, в массив корзины.
`deleteFromBasket(product: IProduct): void` - удаление товара, полученного в параметре из массива корзины.
`clearBasket(): void` - очистка корзины.
`getTotalPrice(): number` - получение стоимости всех товаров в корзине.
`countBasketProducts(): number` - получение количества товаров в корзине.
`isInBasketById(id: number): boolean`

### Класс Buyer

данные покупателя, которые тот должен указать при оформлении заказа

Конструктор:
`constructor()` - создает пустые поля покупателя.

Поля класса:

`protected payment: IPaymentType` - вид оплаты.
`protected address: string` - адреc.
`protected phone: string` - телефон.
`protected email: string` - почта.

Методы класса:

`saveData<T>(data: Record<string, T>): void` - сохранение данных в модели, позволяет сохранять только указанные в data данные.
`getData(): IBuyer` - получение всех данных покупателя.
`clearData(): void` - очистка данных покупателя.
`validateData(data: IBuyer): Record<string, string> | null` - валидация данных.

## Слой коммуникации

### Класс Connection

Выполнение запроса на сервер и получение объекта с массивом товаров.

Поля класса:
`api: IApi` - API для обращения к серверу класса Api.

Методы класса:

`async postOrderData(data: IOrder): Promise<IOrder>` - отправка данных на сервер.
`async getProductsFromServer(): Promise<IResponse>` - получение с сервера объекта с массивом товаров.

## Представление

Для отображения данных и их измениния используются несколько сущностей: корзина, карточка товара, форма, каталог, корзина в заголовке, модальное окно

### Класс BasketView

Отображение карточек товара в корзине

Конструктор:
`constructor(protected events: IEvents, protected container: HTMLElement)` - создает темплейт корзины с товарами.

Поля класса:

`protected basketList: HTMLUListElement` - элемент ДОМ со списком товаров
`protected makeOrderButton: HTMLButtonElement` - кнопка оформления заказа
`protected basketPriceElement: HTMLElement` - элемент отображения суммы заказа в корзине

Сеттеры класса:

`set items(items: HTMLLIElement[])` - отображение данных в корзине.
`set totalPrice(value: number)` - установление суммы заказа в корзине.
`set orederButtonActive(value: boolean)` - включение и отключение кнопки оформления заказа.

### Класс Card

Базовый класс для карточек с товаром

Конструктор:
`constructor(protected container: HTMLElement)` - создает темплейт карточки с товаром.

Поля класса:

`protected titleElement: HTMLElement` - элемент ДОМ с заголовком товара
`protected priceElement: HTMLElement` - элемент ДОМ с ценой товара

Сеттеры класса:

`set price(value: number)` - установка цены товара.
`set title(value: string)` - установка заголовка карточки товара.

### Класс BasketCard

Класс для карточек с товаром в корзине

Конструктор:
`constructor(protected container: HTMLElement, protected actions?: ICardActions)` - создает темплейт карточки с товаром.

Поля класса:

`protected seqNumberElement: HTMLElement` - элемент с номером товара в корзине.
`protected actionButton: HTMLButtonElement` - кнопка удаления товара из корзины.

Сеттеры класса:

`set seqNumber(value: number)` - установка номера товара в корзине.

### Класс CatalogCard

Класс для карточек с товаром в каталоге

Конструктор:
`constructor(protected container: HTMLElement, protected actions?: ICardActions)` - создает темплейт карточки с товаром.

Поля класса:

`protected categoryElement: HTMLElement` - элемент с категорией товара в каталоге.
`protected imageElement: HTMLImageElement` - изображение товара.

Сеттеры класса:

`set category(value: string)` - установка категории товара в каталоге.
`set image(value: string)` - установка изображения товара в каталоге.

### Класс PreviewCard

Класс для карточки с детальным описанием.

Конструктор:
`constructor(protected container: HTMLElement, protected actions?: ICardActions)` - создает темплейт карточки с товаром.

Поля класса:

`protected descriptionElement: HTMLElement` - элемент описания товара.
`protected actionButton: HTMLButtonElement` - кнопка покупки (удаления из корзины) товара.
`protected categoryElement: HTMLElement` - элемент категории товара.
`protected imageElement: HTMLImageElement` - изображение товара.

Сеттеры класса:

`set description(value: string)` - установка описания товара.
`set image(value: string)` - установка изображения товара в каталоге.
`set category(value: string)` - установка категории товара.
`set buttonText(text: string)` - установка надписи на кнопке в зависимости от наличия товара в корзине.
`set buttonActive(active: boolean)` - установкеа состояния кнопки.

### Класс Form<T> extends Component<T>

Класс для карточки с детальным описанием.

Конструктор:
`constructor(protected container: HTMLElement, protected events: IEvents)` - создает темплейт формы.

Поля класса:

`protected modalActionButtonElement: HTMLElement` - элемент расположения кнопки действия.
`protected buttonActionElement: HTMLButtonElement` - кнопка действия.
`protected errorElement: HTMLElement` - элемент описания ошибки валидации.

Сеттеры класса:

`set error(text: string)` - установка ошибки при валидации формы.
`set active(value: boolean)` - установкеа состояния кнопки.

интерфейс:

`IFormSelectionButton` - интерфейс взаимодействия с формой, устанавливает состояние кнопки действия и выбирает способ оплаты.

поля интерфейса:
`select: TPayment` - выбор способа оплаты.
`active: boolean` - определение состояния кнопки действия.

### class OrderForm extends Form<IFormSelectionButton>

Класс формы заполнения данных для заказа.

Конструктор:
`constructor(protected container: HTMLElement, protected events: IEvents)` - создает темплейт формы.

Поля класса:

`protected cardButton: HTMLButtonElement` - кнопка выбора оплаты картой.
`protected cashButton: HTMLButtonElement` - кнопка выбора оплаты наличными.
`protected addressElement: HTMLInputElement` - инпут заполнения адреса.

Сеттеры класса:

`set payment(payment: TPayment | null)` - установка оплаты пользователя.
`set addressText(value: string)` - установкеа тейкста в инпут формы адреса.

### class ContactsForm extends Form<IFormSelectionButton>

Класс формы заполнения данных покупателя.

Конструктор:
`constructor(protected container: HTMLElement, protected events: IEvents)` - создает темплейт формы.

Поля класса:

`protected emailElement: HTMLInputElement` - инпут заполнения почты.
`protected phoneElement: HTMLInputElement` - инпут заполнения телефона.

Сеттеры класса:

`set emailText(value: string)` - установка почты пользователя.
`set phoneText(value: string)` - установкеа телефона пользователя.

интерфейс:
`IGallery` - интерфейс взаимодействия с каталогом товаров.

поля интерфейса:

`catalog: HTMLElement[]` - все элементы (товары) каталога.

### class Gallery extends Component<IGallery>

Класс каталога товаров.

Конструктор:
`constructor(protected container: HTMLElement)` - создает темплейт формы.

Поля класса:

`protected catalogElement: HTMLElement` - элемент каталога.

Сеттеры класса:

`set catalog(items: HTMLElement[])` - заполенение каталога товарами.

интерфейс:
`IHeader` - интерфейс взаимодействия с корзиной в заголовке.

поля интерфейса:

`counter: number` - количество товаров в корзине.

### class Header extends Component<IHeader>

Класс каталога товаров.

Конструктор:
`constructor(protected events: IEvents, protected container: HTMLElement)` - создает элемент управления открытием/закрытием корзины в заголовеке страницы.

Поля класса:

`protected basketButton: HTMLButtonElement` - кнопка открытия корзины с товарами.
`protected counterElement: HTMLElement` - элемент количества товаров в корзине.

Сеттеры класса:

`set counter(value: number)` - установка количества товаров в корзине.

интерфейс:
`IModal` - интерфейс взаимодействия с модальным окном.

поля интерфейса:

`content: HTMLElement` - контент, отображаемый в модальном окне.

### class Modal extends Component<IModal>

Класс модального окна.

Конструктор:
`constructor(protected events: IEvents, protected container: HTMLElement)` - создает элемент управления открытием/закрытием модальным окном.

Поля класса:

`protected closeButton: HTMLButtonElement` - кнопка закрытия модального окна.
`protected modalContent: HTMLElement` - элемент контента, отображаемого в модальном окне.

Методы класса:

`close(): void` - закрывает модальное окно.
`open(value: HTMLElement)` - отображает контент в модальном окне.

интерфейс:
`IOrder` - интерфейс взаимодействия с окном успешного оформления заказа.

поля интерфейса:

`totalPrice: number` - сумма заказа.

### class OrderSuccessful extends Component<IOrder>

Класс модального окна с успешной оплатой.

Конструктор:
`constructor(protected events: IEvents, protected container: HTMLElement)` - создает элемент управления открытием/закрытием модальным окном.

Поля класса:

`protected closeButton: HTMLButtonElement` - кнопка закрытия модального окна.
`protected modalContent: HTMLElement` - элемент контента, отображаемого в модальном окне.

Сеттеры класса:

`set totalPrice(value: number)` - установка суммы заказа.


## События:
`gallery:changed` - изменение содержимого страницы.
`card:selected` - пользователь выбрал карточку с товаром из каталога.
`catalog:cardDetailedChanged` - выбранная карточка попала в модель данных для детального отображения.
`card:addToBasket` - пользователь нажал кнопку "в корзину", для добавления в корзину выбранного товара.
`basket:changed` - каждый раз, когда меняется корзина, перерисовывается представление.
`basket:open` - пользователь нажал на иконку корзины и она открылась.
`basket:order` - пользователь нажал кнопку оформления заказа.
`form:paymentSelected` - пользователь выбрал способ оплаты.
`form:address` - пользователь ввел дынные в поле адресса заказа.
`contacts-form:email` - пользователь ввел данные в поле почты.
`contacts-form:phone` - пользователь ввел данные в поле телефона.
`user:dataChanged` - изменение данных пользователя.
`form:next` - пользователь нажал на кнопку для продолжения заказа в форме.
`success-modal:close` - событие на ответ успешный ответ сервера, все данные удаляются.
`form:pay` - пользователь нажал на кнопку оплатить заказ.