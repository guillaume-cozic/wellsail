export class CreateFleetRequest {
  constructor(private boatsQty: number, private title: string) {}

  getBoatsQty(): number {
    return this.boatsQty;
  }

  getTitle(): string {
    return this.title;
  }
}
