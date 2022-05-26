import { CreateFleetRequest } from './create.fleet.request';
import { Fleet } from '../../../domain/fleet';
import { FleetRepository } from '../../../domain/fleet.repository';
import { v4 as uuidv4 } from 'uuid';
import { FleetTitleAlreadyUsed } from '../../../domain/exception/fleet.title.already.used';

export class CreateFleet {
  constructor(private fleetRepository: FleetRepository) {}

  async execute(request: CreateFleetRequest) {
    const id: string = uuidv4();
    const title = request.getTitle();
    const boatsQty = request.getBoatsQty();

    const fleetWithSameTitle: Fleet = await this.fleetRepository.getByTitle(
      title,
    );
    if (fleetWithSameTitle !== undefined) {
      throw new FleetTitleAlreadyUsed();
    }

    const fleet: Fleet = new Fleet(id, boatsQty, title);
    this.fleetRepository.save(fleet);
    return id;
  }
}
