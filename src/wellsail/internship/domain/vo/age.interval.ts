export class AgeInterval {
  constructor(private start?: number, private end?: number) {
    this.isStartLtEnd(end, start);
    this.isStartAndEndPositive(start, end);
  }

  private isStartAndEndPositive(start: number, end: number) {
    if (start <= 0 || end <= 0) throw 'age interval is wrong';
  }

  private isStartLtEnd(end: number, start: number) {
    if (typeof start !== undefined && typeof end !== undefined && end < start)
      throw 'age interval is wrong';
  }
}
