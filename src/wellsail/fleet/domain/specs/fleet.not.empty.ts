import { Fleet } from '../fleet';

export class FleetNotEmpty {
  isSatisfiedBy(fleet: Fleet): boolean {
    return fleet.getBoatsQty() > 0;
  }
}
