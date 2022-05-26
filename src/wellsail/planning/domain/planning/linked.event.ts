import { Event } from './event';

export class LinkedEvent {
  constructor(private id: string, private events: Array<Event>) {}

  getId(): string {
    return this.id;
  }
}
