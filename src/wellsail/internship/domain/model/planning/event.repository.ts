import { Event } from './event';

export interface EventRepository {
  save(event: Event);
  get(id: string): Promise<Event>;
}
