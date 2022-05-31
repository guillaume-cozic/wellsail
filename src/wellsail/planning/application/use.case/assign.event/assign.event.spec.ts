import { SimpleEvent } from '../../../domain/planning/simple.event';
import { DateInterval } from '../../../../internship/domain/vo/date.interval';
import { InMemoryEventRepository } from '../../../infrastructure/in.memory/in.memory.event.repository';
import { AssignEvent } from './assign.event';
import { AssignEventRequest } from './assign.event.request';
import { EventNotFound } from '../../../domain/planning/exception/event.not.found';
import { WorkerNotFound } from '../../../domain/planning/exception/worker.not.found';
import { InMemoryWorkerRepository } from '../../../infrastructure/in.memory/in.memory.worker.repository';
import { Worker } from '../../../domain/planning/worker';
import { WorkerNotSkilled } from '../../../domain/planning/exception/worker.not.skilled';

describe('assign an event to workers', () => {
  const eventId = 'eventId';
  const workersId: Array<string> = ['workerId'];
  let assignEvent: AssignEvent;
  let eventRepository: InMemoryEventRepository;
  let workerRepository: InMemoryWorkerRepository;

  beforeEach(async () => {
    eventRepository = new InMemoryEventRepository();
    workerRepository = new InMemoryWorkerRepository();
    assignEvent = new AssignEvent(eventRepository, workerRepository);
  });

  it('should not assign an event if event does not exists', async () => {
    try {
      const request: AssignEventRequest = new AssignEventRequest(
        'unknown_id',
        workersId,
      );
      await assignEvent.execute(request);
      expect(false).toEqual(true);
    } catch (error) {
      expect(error).toEqual(new EventNotFound());
    }
  });

  it('should not assign an event if worker does not exists', async () => {
    try {
      await addEvent();

      const request: AssignEventRequest = new AssignEventRequest(eventId, [
        'unknown_worker_id',
      ]);
      await assignEvent.execute(request);
      expect(false).toEqual(true);
    } catch (error) {
      expect(error).toEqual(new WorkerNotFound());
    }
  });

  it('should assign an event', async () => {
    const dateInterval = await addEvent();
    await addInstructor();

    const request: AssignEventRequest = new AssignEventRequest(
      eventId,
      workersId,
    );
    await assignEvent.execute(request);

    const eventSaved: SimpleEvent = await eventRepository.get(eventId);
    const eventExpected: SimpleEvent = new SimpleEvent(
      eventId,
      dateInterval,
      'title',
      workersId,
      SimpleEvent.INTERNSHIP,
    );
    expect(eventSaved).toEqual(eventExpected);
  });

  it('should assign an permanence event to a secretary', async () => {
    const dateInterval = await addPermanenceEvent();
    await addSecretary();

    const request: AssignEventRequest = new AssignEventRequest(
      eventId,
      workersId,
    );
    await assignEvent.execute(request);

    const eventSaved: SimpleEvent = await eventRepository.get(eventId);
    const eventExpected: SimpleEvent = new SimpleEvent(
      eventId,
      dateInterval,
      'title',
      workersId,
      SimpleEvent.PERMANENCE,
    );
    expect(eventSaved).toEqual(eventExpected);
  });

  it('should not assign an event when worker not skilled to handle the task', async () => {
    await addEvent();
    await addSecretary();

    const request: AssignEventRequest = new AssignEventRequest(
      eventId,
      workersId,
    );
    try {
      await assignEvent.execute(request);
      expect(false).toEqual(true);
    } catch (error) {
      expect(error).toEqual(new WorkerNotSkilled());
    }
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
    return dateInterval;
  }

  async function addPermanenceEvent() {
    const start: number = Date.now() + 100;
    const end: number = Date.now() + 86400;
    const dateInterval: DateInterval = new DateInterval(start, end);
    const event: SimpleEvent = new SimpleEvent(
      eventId,
      dateInterval,
      'title',
      [],
      SimpleEvent.PERMANENCE,
    );
    await eventRepository.save(event);
    return dateInterval;
  }

  async function addSecretary() {
    const worker: Worker = new Worker('workerId', [Worker.SECRETARY]);
    await workerRepository.save(worker);
  }

  async function addInstructor() {
    const worker: Worker = new Worker('workerId', [Worker.INSTRUCTOR]);
    workerRepository.save(worker);
  }
});
