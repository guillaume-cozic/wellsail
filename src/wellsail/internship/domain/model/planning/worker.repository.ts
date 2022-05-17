import { Worker } from './worker';

export interface WorkerRepository {
  save(worker: Worker);
  get(workerId: string): Worker;
}
