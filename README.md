# Ежеминутка

Публичный сайт петербургского тайм-кафе с живыми африканскими ёжиками. На первом этапе реализованы дизайн, адаптивный лендинг и информационные страницы — без базы данных, админки и работающего бронирования.

## Структура

- `src/app` — маршруты App Router, SEO-файлы и глобальные стили;
- `src/components` — шапка, подвал, логотип и переиспользуемые визуальные блоки;
- `src/config/site.ts` — название, описание, адрес и будущие контакты;
- `src/config/brand.ts` — единственная точка переключения логотипа;
- `src/content/tariffs.ts` — данные тарифных карточек;
- `public/brand` и `public/media` — будущие оригинальные материалы.

## Локальный запуск

Требуется Node.js 24.

```bash
npm install
npm run dev
```

Сайт будет доступен на `http://localhost:3000`. Для production-проверки: `npm run build`, затем `npm start`.

## Docker

```bash
docker build -t ezheminutka .
docker run --rm -p 3000:3000 ezheminutka
```

Контейнер слушает `0.0.0.0:3000`. Dockerfile использует `npm install` и не требует `package-lock.json`.

## Где менять содержимое

- Контакты, адрес и будущий URL сайта: `src/config/site.ts`. Значения `null` автоматически скрыты в интерфейсе.
- Названия, описания и будущие цены тарифов: `src/content/tariffs.ts`.
- Оригинальный логотип: положить файл `logo-original.png` в `public/brand/`, затем заменить путь в `src/config/brand.ts` на `/brand/logo-original.png`.
- Оригинальные фотографии: положить в `public/media/` под именами из `public/media/README.md`. Сейчас используются безопасные CSS-заглушки без сетевых изображений.

## Что загрузить вручную

Логотип владельца:

- `public/brand/logo-original.png`

После загрузки нужно заменить только `logoSrc` в `src/config/brand.ts` на
`/brand/logo-original.png`.

Фотографии:

- `public/media/hero.jpg`
- `public/media/interior-01.jpg`
- `public/media/interior-02.jpg`
- `public/media/hedgehog-01.jpg`
- `public/media/hedgehog-02.jpg`
- `public/media/event-01.jpg`
- `public/media/event-02.jpg`
- `public/media/og-cover.jpg`

После загрузки фотографий нужно прописать соответствующие публичные пути только в
`src/config/media.ts`. Компонент `Media` автоматически заменит CSS-заглушки на
настоящие изображения; JSX страниц менять не нужно.

## Маршруты

- `/` — основной лендинг;
- `/gallery` — будущая фотогалерея;
- `/news` — будущие новости из VK;
- `/booking` — неактивный макет формы;
- `/privacy` — заглушка политики обработки данных.
