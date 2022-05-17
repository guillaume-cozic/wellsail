import { DateIntervalInvalid } from '../exception/date.interval.invalid';

export class DateInterval {
  constructor(private readonly start: number, private readonly end: number) {
    if (end <= start) {
      throw new DateIntervalInvalid();
    }
  }

  getStart(): number {
    return this.start;
  }

  getEnd(): number {
    return this.end;
  }
}
