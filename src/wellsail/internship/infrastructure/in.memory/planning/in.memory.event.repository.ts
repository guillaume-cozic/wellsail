import { Event } from '../../../domain/model/planning/event';
import { EventRepository } from '../../../domain/model/planning/event.repository';

export class InMemoryEventRepository implements EventRepository {
  private events: Array<Event> = [];

  all(): Array<Event> {
    return this.events;
  }

  async save(event: Event) {
    this.events.push(event);
  }

  async get(id: string): Promise<Event> {
    return this.events.find((event) => event.getId() === id);
  }
}
