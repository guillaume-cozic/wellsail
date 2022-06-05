import { SimpleEvent } from './simple.event';
import { LinkedEvent } from './linked.event';

export interface EventRepository {
  save(event: SimpleEvent);
  saveLinkedEvent(event: LinkedEvent);
  delete(id: string);
  get(id: string): Promise<SimpleEvent>;
  getLinkedEvent(parentId: string): Promise<LinkedEvent>;
  deleteLinkedEvent(parentId: string);
}
