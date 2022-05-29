import { FleetRepository } from '../../domain/fleet.repository';
import { Fleet } from '../../domain/fleet';

export class InMemoryFleetRepository implements FleetRepository {
  private fleets: Array<Fleet> = [];

  async get(id: string): Promise<Fleet> {
    return this.fleets.find((fleet) => fleet.getId() === id);
  }

  async save(fleet: Fleet) {
    this.fleets.push(fleet);
  }

  async getByTitle(title: string): Promise<Fleet> {
    return this.fleets.find((fleet) => fleet.getTitle() === title);
  }

  async delete(id: string) {
    this.fleets = this.fleets.filter((fleet) => fleet.getId() !== id);
  }
}
