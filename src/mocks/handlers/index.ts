import { bookHandlers } from './books';
import { userHandlers } from './users';
import { reservationHandlers } from './reservations';
import { historyHandlers } from './history';
import { recommendationHandlers } from './recommendations';

export const handlers = [
  ...bookHandlers,
  ...userHandlers,
  ...reservationHandlers,
  ...historyHandlers,
  ...recommendationHandlers,
];
