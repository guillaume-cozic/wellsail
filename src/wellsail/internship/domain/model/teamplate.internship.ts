import { AgeInterval } from '../vo/age.interval';

export class TemplateInternship {
  constructor(
    private id: string,
    private title: string,
    private numberTraineesMax: number,
    private ageInterval: AgeInterval,
  ) {}

  getId(): string {
    return this.id;
  }

  getMaxTrainees(): number {
    return this.numberTraineesMax;
  }
}
