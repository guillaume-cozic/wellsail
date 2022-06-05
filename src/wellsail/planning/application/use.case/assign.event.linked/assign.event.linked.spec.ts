import { EventRepository } from '../../../domain/planning/event.repository';
import { InMemoryEventRepository } from '../../../infrastructure/in.memory/in.memory.event.repository';
import { AssignEventLinked } from './assign.event.linked';
import { EventNotFound } from '../../../domain/planning/exception/event.not.found';
import { AssignEventLinkedRequest } from './assign.event.linked.request';
import { WorkerNotFound } from '../../../domain/planning/exception/worker.not.found';
import { LinkedEventBuilder } from '../../builder/linked.event.builder';
import { SimpleEvent } from '../../../domain/planning/simple.event';
import { WorkerRepository } from '../../../domain/planning/worker.repository';
import { InMemoryWorkerRepository } from '../../../infrastructure/in.memory/in.memory.worker.repository';
import { Worker } from '../../../domain/planning/worker';

describe('assign an event linked', () => {
  let eventRepository: EventRepository;
  let workerRepository: WorkerRepository;
  let assignEventLinked: AssignEventLinked;
  const eventId = 'eventId';

  beforeEach(async () => {
    eventRepository = new InMemoryEventRepository();
    workerRepository = new InMemoryWorkerRepository();
    assignEventLinked = new AssignEventLinked(
      eventRepository,
      workerRepository,
    );
  });

  async function addLinkedEvent() {
    const linkedEvent = LinkedEventBuilder.init(
      eventId,
      'title',
      SimpleEvent.INTERNSHIP,
    )
      .addEvent('1', 10, 100)
      .addEvent('2', 1000, 1100)
      .build();
    await eventRepository.saveLinkedEvent(linkedEvent);
  }

  describe('should not assign an linked event', () => {
    it('when linked event does not exist', async () => {
      try {
        const request: AssignEventLinkedRequest = new AssignEventLinkedRequest(
          'id',
          ['worker_id_404'],
        );
        await assignEventLinked.execute(request);
        expect(false).toEqual(true);
      } catch (error) {
        expect(error).toEqual(new EventNotFound());
      }
    });

    it('when worker does not exist', async () => {
      await addLinkedEvent();

      try {
        const request: AssignEventLinkedRequest = new AssignEventLinkedRequest(
          eventId,
          ['worker_id_404'],
        );
        await assignEventLinked.execute(request);
        expect(false).toEqual(true);
      } catch (error) {
        expect(error).toEqual(new WorkerNotFound());
      }
    });
  });

  describe('should assign an linked event', () => {
    it('to workers', async () => {
      await addLinkedEvent();
      workerRepository.save(new Worker('worker_id_1', [Worker.INSTRUCTOR]));
      workerRepository.save(new Worker('worker_id_2', [Worker.INSTRUCTOR]));

      const request: AssignEventLinkedRequest = new AssignEventLinkedRequest(
        eventId,
        ['worker_id_1', 'worker_id_2'],
      );
      await assignEventLinked.execute(request);

      const linkedEventExpected = LinkedEventBuilder.init(
        eventId,
        'title',
        SimpleEvent.INTERNSHIP,
      )
        .addWorkers(['worker_id_1', 'worker_id_2'])
        .addEvent('1', 10, 100)
        .addEvent('2', 1000, 1100)
        .build();

      expect(await eventRepository.getLinkedEvent(eventId)).toEqual(
        linkedEventExpected,
      );
    });
  });
});
