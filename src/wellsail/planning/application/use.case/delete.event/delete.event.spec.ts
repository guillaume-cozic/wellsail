import { InMemoryEventRepository } from '../../../infrastructure/in.memory/in.memory.event.repository';
import { DeleteEvent } from './delete.event';
import { EventNotFound } from '../../../domain/planning/exception/event.not.found';
import { DeleteEventRequest } from './delete.event.request';
import { DateInterval } from '../../../../internship/domain/vo/date.interval';
import { SimpleEvent } from '../../../domain/planning/simple.event';

describe('delete an event', () => {
  const eventId = 'eventId';
  let deleteEvent: DeleteEvent;
  let eventRepository: InMemoryEventRepository;

  beforeEach(async () => {
    eventRepository = new InMemoryEventRepository();
    deleteEvent = new DeleteEvent(eventRepository);
  });

  it('should not delete an unknown event', async () => {
    try {
      const request: DeleteEventRequest = new DeleteEventRequest(
        'unknown_event_id',
      );
      await deleteEvent.execute(request);
      expect(false).toEqual(true);
    } catch (error) {
      expect(error).toEqual(new EventNotFound());
    }
  });

  it('should delete an event', async () => {
    await addEvent();

    const request: DeleteEventRequest = new DeleteEventRequest(eventId);

    await deleteEvent.execute(request);
    const eventDeleted: SimpleEvent = await eventRepository.get(eventId);
    expect(eventDeleted).toBeUndefined();
  });

  async function addEvent() {
    const start: number = Date.now() + 100;
    const end: number = Date.now() + 86400;
    const dateInterval: DateInterval = new DateInterval(start, end);
    const event: SimpleEvent = new SimpleEvent(
      eventId,
      dateInterval,
      'title',
      [],
      SimpleEvent.INTERNSHIP,
    );
    await eventRepository.save(event);
  }
});
