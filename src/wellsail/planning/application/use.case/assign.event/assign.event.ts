import { SimpleEvent } from '../../../domain/planning/simple.event';
import { EventNotFound } from '../../../domain/planning/exception/event.not.found';
import { EventRepository } from '../../../domain/planning/event.repository';
import { AssignEventRequest } from './assign.event.request';
import { WorkerNotFound } from '../../../domain/planning/exception/worker.not.found';
import { Worker } from '../../../domain/planning/worker';
import { WorkerRepository } from '../../../domain/planning/worker.repository';

export class AssignEvent {
  constructor(
    private eventRepository: EventRepository,
    private workerRepository: WorkerRepository,
  ) {}

  async execute(request: AssignEventRequest) {
    const eventId = request.getEventId();
    const event: SimpleEvent = await this.eventRepository.get(eventId);
    if (event === undefined) {
      throw new EventNotFound();
    }

    const workers: Array<Worker> = [];
    for (const workerId of request.getWorkersIds()) {
      const worker: Worker = await this.workerRepository.get(workerId);
      if (worker === undefined) {
        throw new WorkerNotFound();
      }
      workers.push(worker);
    }

    event.assignWorkers(workers);
    this.eventRepository.save(event);
  }
}
