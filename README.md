# Ежеминутка

Публичный сайт единой сети тайм-кафе с ёжиками. Это **один бренд и одно Next.js-приложение**, а Москва, Санкт-Петербург и Казань представлены как три независимых `location`. Backend, база, API бронирования и админка на этом этапе отсутствуют.

## Мультигородская структура

- общая страница сети: `/`;
- городские лендинги: `/moscow`, `/spb`, `/kazan`;
- городские разделы: `/{city}/gallery`, `/{city}/news`, `/{city}/booking`;
- общие страницы выбора города: `/gallery`, `/news`, `/booking`;
- общая политика: `/privacy`.

Динамические маршруты используют единый набор компонентов. Не создавайте отдельные приложения или копии JSX для городов. Будущие сущности backend должны связываться с location (`location_id`).

## Где обновлять данные

- `src/config/locations.ts` — адреса, телефоны, email, часы и другие данные кафе;
- `src/content/tariffs.ts` — отдельная гибкая тарифная модель каждого города;
- `src/content/services.ts` — доступность услуг по городам;
- `src/config/media.ts` — отдельные media-пути каждого города;
- `public/media/moscow/`, `public/media/spb/`, `public/media/kazan/` — фотографии кафе.

Пока media-значения равны `null`, интерфейс показывает placeholders. Рекомендуемые имена файлов перечислены в README каждой media-папки.

## Локальный запуск и production

Требуется Node.js 24.

```bash
npm install
npm run dev
```

Сайт будет доступен на `http://localhost:3000`. Production-проверка и запуск:

```bash
npm run build
npm start
```

Дополнительные проверки:

```bash
npm run typecheck
npm run format:check
```

## Docker

```bash
docker build -t ezheminutka .
docker run --rm -p 3000:3000 ezheminutka
```

Контейнер слушает `0.0.0.0:3000`.

## Материалы владельца

Оригинальный логотип нужно вручную положить в `public/brand/logo-original.png`, затем заменить
`logoSrc` в `src/config/brand.ts` на `/brand/logo-original.png`.

Реальные фотографии также загружаются вручную в media-папку соответствующего города. После
загрузки пути указываются в `src/config/media.ts`; JSX менять не требуется.
