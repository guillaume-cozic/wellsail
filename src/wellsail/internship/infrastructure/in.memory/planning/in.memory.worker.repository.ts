import { Worker } from '../../../domain/model/planning/worker';
import { WorkerRepository } from '../../../domain/model/planning/worker.repository';

export class InMemoryWorkerRepository implements WorkerRepository {
  private workers: Array<Worker> = [];

  save(worker: Worker) {
    this.workers.push(worker);
  }

  get(workerId: string): Worker {
    return this.workers.find((worker) => workerId === worker.getId());
  }
}
