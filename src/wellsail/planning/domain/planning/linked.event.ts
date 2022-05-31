import { SimpleEvent } from './simple.event';
import { NotEnoughEvents } from './exception/not.enough.events';

export class LinkedEvent {
  constructor(private id: string, private events: Array<SimpleEvent>) {
    if (events.length < 2) {
      throw new NotEnoughEvents();
    }
  }

  getId(): string {
    return this.id;
  }
}
