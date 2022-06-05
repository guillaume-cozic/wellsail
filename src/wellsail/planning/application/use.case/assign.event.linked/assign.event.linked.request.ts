export class AssignEventLinkedRequest {
  constructor(
    private readonly eventId: string,
    private readonly workersId: Array<string>,
  ) {}

  getEventId(): string {
    return this.eventId;
  }

  getWorkersId(): Array<string> {
    return this.workersId;
  }
}
