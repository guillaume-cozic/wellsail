import { FleetRepository } from '../../../domain/fleet.repository';
import { DeleteFleetRequest } from './delete.fleet.request';
import { Fleet } from '../../../domain/fleet';
import { FleetNotFound } from '../../../domain/exception/fleet.not.found';

export class DeleteFleet {
  constructor(private readonly fleetRepository: FleetRepository) {}

  async execute(request: DeleteFleetRequest) {
    const fleet: Fleet = await this.fleetRepository.get(request.getId());
    if (fleet === undefined) {
      throw new FleetNotFound();
    }
    this.fleetRepository.delete(fleet.getId());
  }
}
