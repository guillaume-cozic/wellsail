export class CreateEventRequest {
  constructor(
    private eventStart: number,
    private eventEnd: number,
    private title: string,
    private instructorsIds: Array<string>,
    private type: string,
  ) {}

  getEventStart(): number {
    return this.eventStart;
  }

  getEventEnd(): number {
    return this.eventEnd;
  }

  getTitle(): string {
    return this.title;
  }

  getInstructorsIds(): Array<string> {
    return this.instructorsIds;
  }

  getType(): string {
    return this.type;
  }
}
