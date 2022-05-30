import { EmptyFleet } from './exception/empty.fleet';
import { FleetNotEmpty } from './specs/fleet.not.empty';
import {RentalCosts} from "./rental.costs";

export class Fleet {
  constructor(
    private id: string,
    private boatsQty: number,
    private title: string,
    private rentalCosts: RentalCosts = null,
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

  defineRentalCosts(rentalCosts: RentalCosts) {
    this.rentalCosts = rentalCosts;
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
