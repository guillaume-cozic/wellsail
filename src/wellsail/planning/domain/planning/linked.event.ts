import { SimpleEvent } from './simple.event';
import { NotEnoughEvents } from './exception/not.enough.events';
import { Worker } from './worker';

export class LinkedEvent {
  constructor(private id: string, private events: Array<SimpleEvent>) {
    if (events.length < 2) {
      throw new NotEnoughEvents();
    }
  }

  assignWorkers(workers: Array<Worker>) {
    /*for (const simpleEvent of this.events) {
      console.log(simpleEvent);
      simpleEvent.assignWorkers(workers);
    }*/

    this.events[0].assignWorkers(workers);
    this.events[1].assignWorkers(workers);
    //console.log(this.events);
    /*this.events.forEach((event: SimpleEvent) => {
    });*/
  }

  getId(): string {
    return this.id;
  }
}
