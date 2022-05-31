export class CreateLinkedEventsRequest {
  constructor(
    private readonly title: string,
    private readonly events: Array<{ start: number; end: number }>,
  ) {}

  getTitle(): string {
    return this.title;
  }

  getEvents(): Array<{ start: number; end: number }> {
    return this.events;
  }
}
