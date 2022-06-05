import { Worker } from '../../domain/planning/worker';
import { WorkerRepository } from '../../domain/planning/worker.repository';

export class InMemoryWorkerRepository implements WorkerRepository {
  private workers: Array<Worker> = [];

  save(worker: Worker) {
    this.workers.push(worker);
  }

  async get(workerId: string): Promise<Worker> {
    return this.workers.find((worker) => workerId === worker.getId());
  }
}
