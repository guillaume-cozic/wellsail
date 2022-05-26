export class DeleteFleetRequest {
  constructor(private id: string) {}

  getId(): string {
    return this.id;
  }
}
