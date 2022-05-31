import { SimpleEvent } from '../../domain/planning/simple.event';
import { EventRepository } from '../../domain/planning/event.repository';
import { LinkedEvent } from '../../domain/planning/linked.event';

export class InMemoryEventRepository implements EventRepository {
  private events: Array<SimpleEvent> = [];
  private linkedEvents: Array<LinkedEvent> = [];

  all(): Array<SimpleEvent> {
    return this.events;
  }

  async save(event: SimpleEvent) {
    this.events.push(event);
  }

  async get(id: string): Promise<SimpleEvent> {
    return this.events.find((event: SimpleEvent) => event.getId() === id);
  }

  delete(id: string) {
    this.events = this.events.filter((event: SimpleEvent) => event.getId() !== id);
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
