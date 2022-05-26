import { EmptyFleet } from './exception/empty.fleet';

export class Fleet {
  constructor(
    private id: string,
    private boatsQty: number,
    private title: string,
  ) {
    if (this.boatsQty <= 0) {
      throw new EmptyFleet();
    }
  }

  getId(): string {
    return this.id;
  }

  getTitle(): string {
    return this.title;
  }
}
