import { Event } from '../../../../domain/model/planning/event';
import { DateInterval } from '../../../../domain/vo/date.interval';
import { DateIntervalInvalid } from '../../../../domain/exception/date.interval.invalid';
import { CreateEvent } from './create.event';
import { CreateEventRequest } from './create.event.request';
import { InMemoryEventRepository } from '../../../../infrastructure/in.memory/planning/in.memory.event.repository';

describe('create an event', () => {
  const eventRepository: InMemoryEventRepository =
    new InMemoryEventRepository();
  const createEvent: CreateEvent = new CreateEvent(eventRepository);
  const title = 'Cours Muniez';
  const type = 'cours';
  const instructorsIds: Array<string> = ['instructorId'];

  it('should create an event', async () => {
    const start: number = Date.now() + 100;
    const end: number = Date.now() + 200;
    const createEventRequest: CreateEventRequest = new CreateEventRequest(
      start,
      end,
      title,
      instructorsIds,
      type,
    );

    const eventId = await createEvent.execute(createEventRequest);

    const date: DateInterval = new DateInterval(start, end);
    const event: Event = new Event(eventId, date, title, instructorsIds, type);

    const eventsSaved: Array<Event> = await eventRepository.all();
    expect(eventsSaved.pop()).toEqual(event);
  });

  it('should not create an event when date invalid', async () => {
    const start: number = Date.now() + 86400;
    const end: number = Date.now() + 100;
    const createEventRequest: CreateEventRequest = new CreateEventRequest(
      start,
      end,
      title,
      instructorsIds,
      type,
    );
    try {
      await createEvent.execute(createEventRequest);
      expect(false).toBe(true);
    } catch (error) {
      expect(error).toEqual(new DateIntervalInvalid());
    }
  });
});
