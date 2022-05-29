import { EmptyFleet } from './exception/empty.fleet';
import { FleetNotEmpty } from './specs/fleet.not.empty';

export class Fleet {
  constructor(
    private id: string,
    private boatsQty: number,
    private title: string,
  ) {
    this.checkFleetNotEmpty();
  }

  private checkFleetNotEmpty() {
    const spec = new FleetNotEmpty();
    if (!spec.isSatisfiedBy(this)) {
      throw new EmptyFleet();
    }
  }

  update(boatsQty: number, title: string) {
    this.boatsQty = boatsQty;
    this.checkFleetNotEmpty();
    this.title = title;
  }

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
