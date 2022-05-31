import { LinkedEvent } from '../../domain/planning/linked.event';
import { SimpleEvent } from '../../domain/planning/simple.event';
import { DateInterval } from '../../../internship/domain/vo/date.interval';

export class LinkedEventBuilder {
  private events: Array<SimpleEvent> = [];
  private workers: Array<string> = [];

  private constructor(
    private readonly id: string,
    private readonly titleEvent: string,
    private readonly type: string,
  ) {}

  static init(id: string, titleEvent: string, type: string) {
    return new LinkedEventBuilder(id, titleEvent, type);
  }

  addEvent(
    simpleEventId: string,
    start: number,
    end: number,
  ): LinkedEventBuilder {
    this.events = [
      ...this.events,
      new SimpleEvent(
        simpleEventId,
        new DateInterval(start, end),
        this.titleEvent,
        this.workers,
        this.type,
        this.id,
      ),
    ];
    return this;
  }

  build(): LinkedEvent {
    return new LinkedEvent(this.id, this.events);
  }
}
