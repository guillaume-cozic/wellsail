import { EventRepository } from '../../../domain/planning/event.repository';
import { CreateLinkedEventsRequest } from './create.linked.events.request';
import { LinkedEvent } from '../../../domain/planning/linked.event';
import { v4 as uuid } from 'uuid';
import { SimpleEvent } from '../../../domain/planning/simple.event';
import { DateInterval } from '../../../../internship/domain/vo/date.interval';
import { IdentityProvider } from '../../../../core/application/identity.provider';

export class CreateLinkedEvents {
  constructor(
    private eventRepository: EventRepository,
    private identityProvider: IdentityProvider,
  ) {}

  async execute(request: CreateLinkedEventsRequest): Promise<string> {
    const events: Array<SimpleEvent> = [];
    const id: string = uuid();
    request.getEvents().forEach((event) => {
      const date: DateInterval = new DateInterval(event.start, event.end);
      events.push(
        new SimpleEvent(
          this.identityProvider.id(),
          date,
          request.getTitle(),
          [],
          SimpleEvent.INTERNSHIP,
          id,
        ),
      );
    });
    const linkedEvents = new LinkedEvent(id, events);
    this.eventRepository.saveLinkedEvent(linkedEvents);
    return id;
  }
}
