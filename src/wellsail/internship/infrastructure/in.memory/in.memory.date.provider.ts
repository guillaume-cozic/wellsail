import { DateProvider } from '../../domain/ports/date.provider';

export class InMemoryDateProvider implements DateProvider {
  constructor(private dateNow: Date) {}

  now(): Date {
    return this.dateNow;
  }
}
