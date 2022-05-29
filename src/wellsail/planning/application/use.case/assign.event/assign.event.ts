import { Event } from '../../../domain/planning/event';
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
    const event: Event = await this.eventRepository.get(request.getEventId());
    if (event === undefined) {
      throw new EventNotFound();
    }

    const workers: Array<Worker> = [];
    request.getWorkersIds().forEach((workerId: string) => {
      const worker: Worker = this.workerRepository.get(workerId);
      if (worker === undefined) {
        throw new WorkerNotFound();
      }
      workers.push(worker);
    });

    event.assignWorkers(workers);
    this.eventRepository.save(event);
  }
}
