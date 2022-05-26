import { Event } from './event';
import { LinkedEvent } from './linked.event';

export interface EventRepository {
  save(event: Event);
  saveLinkedEvent(event: LinkedEvent);
  delete(id: string);
  get(id: string): Promise<Event>;
  getLinkedEvent(parentId: string): Promise<LinkedEvent>;
  deleteLinkedEvent(parentId: string);
}
