import { FleetRepository } from '../../../domain/fleet.repository';
import { AddRentalCostRequest } from './add.rental.cost.request';
import { Fleet } from '../../../domain/fleet';
import { FleetNotFound } from '../../../domain/exception/fleet.not.found';
import { RentalCosts } from '../../../domain/rental.costs';

export class AddRentalCost {
  constructor(private readonly fleetRepository: FleetRepository) {}

  async execute(request: AddRentalCostRequest) {
    const fleet: Fleet = await this.fleetRepository.get(request.getFleetId());
    if (fleet === undefined) {
      throw new FleetNotFound();
    }

    const rentalCosts: RentalCosts = new RentalCosts(request.getCosts());
    fleet.defineRentalCosts(rentalCosts);
    this.fleetRepository.save(fleet);
  }
}
