import { DomainEvent } from '../domain/domain.event';

export interface EventBus {
  emit(events: Array<DomainEvent>);
}
