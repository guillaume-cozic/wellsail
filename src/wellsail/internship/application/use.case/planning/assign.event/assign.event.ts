import { Event } from '../../../../domain/model/planning/event';
import { EventNotFound } from '../../../../domain/model/planning/exception/EventNotFound';
import { EventRepository } from '../../../../domain/model/planning/event.repository';
import { AssignEventRequest } from './assign.event.request';
import { WorkerNotFound } from '../../../../domain/model/planning/exception/worker.not.found';
import { Worker } from '../../../../domain/model/planning/worker';
import { WorkerRepository } from '../../../../domain/model/planning/worker.repository';

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
