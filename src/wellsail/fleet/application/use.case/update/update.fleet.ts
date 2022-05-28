import { FleetRepository } from '../../../domain/fleet.repository';
import { UpdateFleetRequest } from './update.fleet.request';
import { Fleet } from '../../../domain/fleet';
import { FleetNotFound } from '../../../domain/exception/fleet.not.found';
import { FleetTitleAlreadyUsed } from '../../../domain/exception/fleet.title.already.used';

export class UpdateFleet {
  constructor(private readonly fleetRepository: FleetRepository) {}

  async execute(request: UpdateFleetRequest) {
    const fleet: Fleet = await this.fleetRepository.get(request.getId());
    if (fleet === undefined) {
      throw new FleetNotFound();
    }

    const fleetWithSameTitle: Fleet = await this.fleetRepository.getByTitle(
      request.getTitle(),
    );
    if (fleetWithSameTitle !== undefined) {
      throw new FleetTitleAlreadyUsed();
    }

    fleet.update(request.getBoatsQty(), request.getTitle());
    this.fleetRepository.save(fleet);
  }
}
