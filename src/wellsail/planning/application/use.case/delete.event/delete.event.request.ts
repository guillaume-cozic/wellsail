export class DeleteEventRequest {
  constructor(private eventId: string) {}

  getEventId(): string {
    return this.eventId;
  }
}
