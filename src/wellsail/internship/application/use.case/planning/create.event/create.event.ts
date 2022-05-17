import { EventRepository } from '../../../../domain/model/planning/event.repository';
import { Event } from '../../../../domain/model/planning/event';
import { DateInterval } from '../../../../domain/vo/date.interval';
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
    const event: Event = new Event(
      id,
      dateInterval,
      request.getTitle(),
      request.getInstructorsIds(),
      request.getType(),
    );
    this.eventRepository.save(event);

    return id;
  }
}
