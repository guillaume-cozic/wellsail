export class AssignEventRequest {
  constructor(private eventId: string, private workersIds: Array<string>) {}

  getEventId(): string {
    return this.eventId;
  }

  getWorkersIds(): Array<string> {
    return this.workersIds;
  }
}
