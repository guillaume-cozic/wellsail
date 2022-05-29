import { EventRepository } from '../../../domain/planning/event.repository';
import { DeleteEventRequest } from './delete.event.request';
import { Event } from '../../../domain/planning/event';
import { EventNotFound } from '../../../domain/planning/exception/event.not.found';

export class DeleteEvent {
  constructor(private eventRepository: EventRepository) {}

  async execute(request: DeleteEventRequest) {
    const event: Event = await this.eventRepository.get(request.getEventId());
    if (event === undefined) {
      throw new EventNotFound();
    }
    this.eventRepository.delete(event.getId());
  }
}
