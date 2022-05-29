import { DomainEvent } from './domain.event';

export class Aggregate {
  protected domainEvents: Array<DomainEvent> = [];

  protected addEvent(event: DomainEvent) {
    this.domainEvents.push(event);
  }

  getEvents(): Array<DomainEvent> {
    const events: Array<DomainEvent> = this.domainEvents;
    this.domainEvents = [];
    return events;
  }
}
