export class CreateEventRequest {
  constructor(
    private eventStart: number,
    private eventEnd: number,
    private title: string,
    private workersIds: Array<string>,
    private type: string,
    private parentId: string = null,
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

  getWorkersIds(): Array<string> {
    return this.workersIds;
  }

  getType(): string {
    return this.type;
  }

  getParentId(): string {
    return this.parentId;
  }
}
