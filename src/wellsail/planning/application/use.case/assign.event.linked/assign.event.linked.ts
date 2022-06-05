import { AssignEventLinkedRequest } from './assign.event.linked.request';
import { EventRepository } from '../../../domain/planning/event.repository';
import { LinkedEvent } from '../../../domain/planning/linked.event';
import { EventNotFound } from '../../../domain/planning/exception/event.not.found';
import { WorkerRepository } from '../../../domain/planning/worker.repository';
import { Worker } from '../../../domain/planning/worker';
import { WorkerNotFound } from '../../../domain/planning/exception/worker.not.found';

export class AssignEventLinked {
  constructor(
    private readonly eventRepository: EventRepository,
    private readonly workerRepository: WorkerRepository,
  ) {}

  async execute(request: AssignEventLinkedRequest) {
    const linkedEvent: LinkedEvent = await this.eventRepository.getLinkedEvent(
      request.getEventId(),
    );
    if (linkedEvent === undefined) {
      throw new EventNotFound();
    }

    const promiseWorkers: Array<Promise<Worker>> = [];
    for (const workerId of request.getWorkersId()) {
      promiseWorkers.push(this.workerRepository.get(workerId));
    }
    await Promise.all(promiseWorkers).then((workers) => {
      if (workers.includes(undefined)) {
        throw new WorkerNotFound();
      }

      linkedEvent.assignWorkers(workers);
      this.eventRepository.saveLinkedEvent(linkedEvent);
    });
  }
}
