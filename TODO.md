# TODO LIST

*Пропоную використовувати при назві гілок таку конвенцію - [назва_автора_гілки]/[назва_гілки].
 Наприклад finkord/angular-feature*

1. Реалізувати підтримку пошуку місця знаходження за геолокацією
2. Покращити компонент weather-forecast - добавити відображення п'яти днів та відображення десяти днів при нажатті на кнопку
3. Покращити візуальне відображення інформації компонентом weather-forecast
4. Добавити профіль користувача - можливість добавляти свої локації в закладки
5. Показувати годину на сайті (створити для цього компонент?)
6. Добавити компонент - меню
7. Добавити компонент - про нас (при переході відображати наприклад інформацію про нас)

Референс для натхнення - [maplemap.github.io/weather-app-angular](https://maplemap.github.io/weather-app-angular/London)

## Project Structure

```text
src/
├── app/
│   ├── core/                   (Всі сервісні - "бекендні" штуки тут, переважно виклики api)
│   │   ├── interceptors/     # HTTP interceptors for API key handling
│   │   ├── models/          # Data models and interfaces
│   │   └── services/        # Core services for weather and places
│   └── features/               (Всі графічні штуки тут)
│       ├── location-search/  # Location search functionality
│       └── weather-forecast/ # Weather forecast display
└── environments/            # Environment configuration files 
```
