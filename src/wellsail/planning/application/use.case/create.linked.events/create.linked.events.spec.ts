import { EventRepository } from '../../../domain/planning/event.repository';
import { CreateLinkedEvents } from './create.linked.events';
import { InMemoryEventRepository } from '../../../infrastructure/in.memory/in.memory.event.repository';
import { DateIntervalInvalid } from '../../../../internship/domain/exception/date.interval.invalid';
import { CreateLinkedEventsRequest } from './create.linked.events.request';
import { LinkedEvent } from '../../../domain/planning/linked.event';
import { NotEnoughEvents } from '../../../domain/planning/exception/not.enough.events';
import { IdentityProvider } from '../../../../core/application/identity.provider';
import { InMemoryIdentityProvider } from '../../../../core/infrastructure/in.memory/in.memory.identity.provider';
import { SimpleEvent } from '../../../domain/planning/simple.event';
import { LinkedEventBuilder } from '../../builder/linked.event.builder';

describe('create a linked events', () => {
  let eventRepository: EventRepository;
  let createLinkedEvents: CreateLinkedEvents;
  let identityProvider: IdentityProvider;

  beforeEach(async () => {
    eventRepository = new InMemoryEventRepository();
    identityProvider = new InMemoryIdentityProvider();
    createLinkedEvents = new CreateLinkedEvents(
      eventRepository,
      identityProvider,
    );
  });

  describe('should not create linked events', () => {
    it('with invalid dates', async () => {
      try {
        const request: CreateLinkedEventsRequest =
          new CreateLinkedEventsRequest('title', [
            {
              start: 86400 + 100,
              end: 86400 + 10,
            },
            {
              start: 86400 + 100,
              end: 86400 + 10,
            },
          ]);
        await createLinkedEvents.execute(request);
        expect(false).toEqual(true);
      } catch (error) {
        expect(error).toEqual(new DateIntervalInvalid());
      }
    });

    it('with only one event', async () => {
      try {
        const request: CreateLinkedEventsRequest =
          new CreateLinkedEventsRequest('title', [
            {
              start: 86400 + 100,
              end: 86400 + 1000,
            },
          ]);
        await createLinkedEvents.execute(request);
        expect(false).toEqual(true);
      } catch (error) {
        expect(error).toEqual(new NotEnoughEvents());
      }
    });
  });

  describe('should create linked events', () => {
    it('with at least two events', async () => {
      const request: CreateLinkedEventsRequest = new CreateLinkedEventsRequest(
        'title',
        [
          {
            start: 10,
            end: 100,
          },
          {
            start: 1000,
            end: 1100,
          },
        ],
      );
      const eventId: string = await createLinkedEvents.execute(request);
      const eventSaved: LinkedEvent = await eventRepository.getLinkedEvent(
        eventId,
      );

      const linkedEventExpected = LinkedEventBuilder.init(
        eventId,
        'title',
        SimpleEvent.INTERNSHIP,
      )
        .addEvent('1', 10, 100)
        .addEvent('2', 1000, 1100)
        .build();

      expect(eventSaved).toEqual(linkedEventExpected);
    });
  });
});
