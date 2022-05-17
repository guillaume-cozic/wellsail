import { SessionAlreadyCanceled } from '../exception/session.already.canceled';
import { SessionAlreadyPast } from '../exception/session.already.past';
import { DateInterval } from '../vo/date.interval';

export class Session {
  private readonly statusCanceled: string = 'canceled';
  private dateInterval: DateInterval;

  constructor(
    private index: number,
    start: number,
    end: number,
    private state: string = '',
  ) {
    this.dateInterval = new DateInterval(start, end);
  }

  cancel() {
    if (this.state === this.statusCanceled) {
      throw new SessionAlreadyCanceled();
    }
    if (this.isPast()) {
      throw new SessionAlreadyPast();
    }
    this.state = this.statusCanceled;
  }

  getIndex(): number {
    return this.index;
  }

  isOverlapWith(session: Session): boolean {
    return (
      this !== session &&
      (session.isDuringSession(this.getStart()) ||
        session.isDuringSession(this.getEnd()))
    );
  }

  isPast(): boolean {
    return this.getStart() < Date.now();
  }

  private getStart(): number {
    return this.dateInterval.getStart();
  }

  private getEnd(): number {
    return this.dateInterval.getEnd();
  }

  isDuringSession(moment: number): boolean {
    return moment >= this.getStart() && moment <= this.getEnd();
  }
}
