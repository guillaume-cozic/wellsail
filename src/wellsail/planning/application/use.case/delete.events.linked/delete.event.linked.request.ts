export class DeleteEventLinkedRequest {
  constructor(private parentEventId: string) {}

  getParentId(): string {
    return this.parentEventId;
  }
}
