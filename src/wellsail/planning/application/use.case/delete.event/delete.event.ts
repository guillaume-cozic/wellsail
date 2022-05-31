import { EventRepository } from '../../../domain/planning/event.repository';
import { DeleteEventRequest } from './delete.event.request';
import { SimpleEvent } from '../../../domain/planning/simple.event';
import { EventNotFound } from '../../../domain/planning/exception/event.not.found';

export class DeleteEvent {
  constructor(private eventRepository: EventRepository) {}

  async execute(request: DeleteEventRequest) {
    const event: SimpleEvent = await this.eventRepository.get(
      request.getEventId(),
    );
    if (event === undefined) {
      throw new EventNotFound();
    }
    this.eventRepository.delete(event.getId());
  }
}
