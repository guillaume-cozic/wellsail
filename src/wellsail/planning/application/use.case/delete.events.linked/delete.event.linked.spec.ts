import { InMemoryEventRepository } from '../../../infrastructure/in.memory/in.memory.event.repository';
import { EventNotFound } from '../../../domain/planning/exception/event.not.found';
import { DateInterval } from '../../../../internship/domain/vo/date.interval';
import { Event } from '../../../domain/planning/event';
import { DeleteEventLinked } from './delete.event.linked';
import { DeleteEventLinkedRequest } from './delete.event.linked.request';
import { v4 as uuidv4 } from 'uuid';
import { LinkedEvent } from '../../../domain/planning/linked.event';

describe('delete an linked event', () => {
  const parentEventId = 'parentEventId';
  let deleteEventLinked: DeleteEventLinked;
  let eventRepository: InMemoryEventRepository;

  beforeEach(async () => {
    eventRepository = new InMemoryEventRepository();
    deleteEventLinked = new DeleteEventLinked(eventRepository);
  });

  it('should not delete an unknown parent event', async () => {
    try {
      const request: DeleteEventLinkedRequest = new DeleteEventLinkedRequest(
        parentEventId,
      );
      await deleteEventLinked.execute(request);
      expect(false).toEqual(true);
    } catch (error) {
      expect(error).toEqual(new EventNotFound());
    }
  });

  it('should delete an parent event with childs event', async () => {
    await addParentEvent();

    const request: DeleteEventLinkedRequest = new DeleteEventLinkedRequest(
      parentEventId,
    );
    await deleteEventLinked.execute(request);

    const event: LinkedEvent = await eventRepository.getLinkedEvent(
      parentEventId,
    );
    expect(event).toBeUndefined();
  });

  async function addParentEvent() {
    for (let i = 0; i < 5; i++) {
      const start: number = Date.now() + 100 + 86400 * i;
      const end: number = Date.now() + 200 + 86400 * i;
      const dateInterval: DateInterval = new DateInterval(start, end);
      const events: Array<Event> = [];
      events.push(
        new Event(
          uuidv4(),
          dateInterval,
          'title',
          [],
          Event.INTERNSHIP,
          parentEventId,
        ),
      );
      const linkedEvent: LinkedEvent = new LinkedEvent(parentEventId, events);
      await eventRepository.saveLinkedEvent(linkedEvent);
    }
  }
});
