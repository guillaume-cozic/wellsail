import { EventBus } from '../event.bus';
import { DomainEvent } from '../../domain/domain.event';

export class InMemoryEventBus implements EventBus {
  private domainEvents: Array<DomainEvent> = [];

  emit(events: Array<DomainEvent>) {
    events.forEach((event: DomainEvent) => {
      this.domainEvents.push(event);
    });
  }

  all(): Array<DomainEvent> {
    return this.domainEvents;
  }
}
