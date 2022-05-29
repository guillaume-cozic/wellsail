export class UpdateFleetRequest {
  constructor(
    private id: string,
    private boatsQty: number,
    private title: string,
  ) {}

  getId(): string {
    return this.id;
  }

  getBoatsQty(): number {
    return this.boatsQty;
  }

  getTitle(): string {
    return this.title;
  }
}
