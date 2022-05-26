import { DateInterval } from '../../../internship/domain/vo/date.interval';
import { Worker } from './worker';
import { WorkerNotSkilled } from './exception/worker.not.skilled';

export class Event {
  public static INTERNSHIP = 'INTERNSHIP';
  public static PERMANENCE = 'PERMANENCE';

  constructor(
    private id: string,
    private dateInterval: DateInterval,
    private title: string,
    private workersId: Array<string>,
    private type: string,
    private parentId: string = null,
  ) {}

  getId(): string {
    return this.id;
  }

  getParentId(): string {
    return this.parentId;
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
