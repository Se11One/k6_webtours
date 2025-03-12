import http from 'k6/http';
import { check, group } from 'k6';

export const options = {
  discardResponseBodies: true,
  scenarios: {
    yandex: {
      exec: 'yandex',
      executor: 'ramping-arrival-rate', // Запросы в минуту
      startRate: 0, // Начальная скорость (0)
      timeUnit: '1m', // Время измерения - 1 минута
      preAllocatedVUs: 10, // Минимальное число VU
      maxVUs: 100, // Максимальное число VU
      stages: [
        { duration: '5m', target: 60 },  // Разгон до 60 запросов в минуту
        { duration: '10m', target: 60 }, // Подаём 60 запросов в минуту
        { duration: '5m', target: 72 },  // Разгон до 72 запросов в минуту
        { duration: '10m', target: 72 }, // Подаём 72 запроса в минуту
      ],
    },
    someRU: {
      exec: 'someRU',
      executor: 'ramping-arrival-rate', // Запросы в минуту
      startRate: 0, // Начальная скорость (0)
      timeUnit: '1m', // Время измерения - 1 минута
      preAllocatedVUs: 20, // Минимальное число VU
      maxVUs: 200, // Максимальное число VU
      stages: [
        { duration: '5m', target: 120 }, // Разгон до 120 запросов в минуту
        { duration: '10m', target: 120 }, // Подаём 120 запросов в минуту
        { duration: '5m', target: 144 }, // Разгон до 144 запросов в минуту
        { duration: '10m', target: 144 }, // Подаём 144 запроса в минуту
      ],
    },
  },
};

const YANDEX_URL = 'http://ya.ru';
const SOME_RU_URL = 'http://www.ru';

export function getYandex() {
  const res = http.get(YANDEX_URL);
  check(res, {
    'status code is 200': (r) => r.status === 200,
  });
}

export function getSomeRU() {
  const res = http.get(SOME_RU_URL);
  check(res, {
    'status code is 200': (r) => r.status === 200,
  });
}

export function yandex() {
  group('getYandex', () => { getYandex(); });
}

export function someRU() {
  group('getSomeRU', () => { getSomeRU(); });
}
