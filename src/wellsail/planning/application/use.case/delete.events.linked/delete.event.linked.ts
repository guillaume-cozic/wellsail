import { EventRepository } from '../../../domain/planning/event.repository';
import { DeleteEventLinkedRequest } from './delete.event.linked.request';
import { EventNotFound } from '../../../domain/planning/exception/event.not.found';
import { LinkedEvent } from '../../../domain/planning/linked.event';

export class DeleteEventLinked {
  constructor(private eventRepository: EventRepository) {}

  async execute(request: DeleteEventLinkedRequest) {
    const parentEvent: LinkedEvent = await this.eventRepository.getLinkedEvent(
      request.getParentId(),
    );
    if (parentEvent === undefined) {
      throw new EventNotFound();
    }
    this.eventRepository.deleteLinkedEvent(request.getParentId());
  }
}
