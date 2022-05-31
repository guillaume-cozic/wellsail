import { EventRepository } from '../../../domain/planning/event.repository';
import { SimpleEvent } from '../../../domain/planning/simple.event';
import { DateInterval } from '../../../../internship/domain/vo/date.interval';
import { CreateEventRequest } from './create.event.request';
import { v4 as uuidv4 } from 'uuid';

export class CreateEvent {
  constructor(private eventRepository: EventRepository) {}

  async execute(request: CreateEventRequest): Promise<string> {
    const dateInterval: DateInterval = new DateInterval(
      request.getEventStart(),
      request.getEventEnd(),
    );

    const id: string = uuidv4();
    const event: SimpleEvent = new SimpleEvent(
      id,
      dateInterval,
      request.getTitle(),
      request.getWorkersIds(),
      request.getType(),
      request.getParentId(),
    );
    this.eventRepository.save(event);
    return id;
  }
}
