import { Event } from '../../domain/planning/event';
import { EventRepository } from '../../domain/planning/event.repository';
import { LinkedEvent } from '../../domain/planning/linked.event';

export class InMemoryEventRepository implements EventRepository {
  private events: Array<Event> = [];
  private linkedEvents: Array<LinkedEvent> = [];

  all(): Array<Event> {
    return this.events;
  }

  async save(event: Event) {
    this.events.push(event);
  }

  async get(id: string): Promise<Event> {
    return this.events.find((event: Event) => event.getId() === id);
  }

  delete(id: string) {
    this.events = this.events.filter((event: Event) => event.getId() !== id);
  }

  async getLinkedEvent(parentId: string): Promise<LinkedEvent> {
    return this.linkedEvents.find(
      (event: LinkedEvent) => event.getId() === parentId,
    );
  }

  deleteLinkedEvent(parentId: string) {
    this.linkedEvents = this.linkedEvents.filter(
      (event: LinkedEvent) => event.getId() !== parentId,
    );
  }

  async saveLinkedEvent(event: LinkedEvent) {
    this.linkedEvents.push(event);
  }
}
