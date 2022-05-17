import { DateInterval } from '../../vo/date.interval';
import { Worker } from './worker';
import { WorkerNotSkilled } from './exception/WorkerNotSkilled';

export class Event {
  public static INTERNSHIP = 'INTERNSHIP';
  public static PERMANENCE = 'PERMANENCE';

  constructor(
    private id: string,
    private dateInterval: DateInterval,
    private title: string,
    private workersId: Array<string>,
    private type: string,
  ) {}

  getId(): string {
    return this.id;
  }

  assignWorkers(workers: Array<Worker>) {
    workers.forEach((worker: Worker) => {
      if (!worker.isSkilled(this.type)) {
        throw new WorkerNotSkilled();
      }
      this.workersId.push(worker.getId());
    });
  }
}
