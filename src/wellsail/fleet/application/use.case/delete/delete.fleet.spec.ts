import { FleetRepository } from '../../../domain/fleet.repository';
import { InMemoryFleetRepository } from '../../../infrastructure/in.memory/in.memory.fleet.repository';
import { DeleteFleet } from './delete.fleet';
import { DeleteFleetRequest } from './delete.fleet.request';
import { FleetNotFound } from '../../../domain/exception/fleet.not.found';
import { Fleet } from '../../../domain/fleet';

describe('delete a fleet', () => {
  let deleteFleet: DeleteFleet;
  let fleetRepository: FleetRepository;

  beforeEach(() => {
    fleetRepository = new InMemoryFleetRepository();
    deleteFleet = new DeleteFleet(fleetRepository);
  });

  describe('should not delete a fleet', () => {
    it('when fleet not found', async () => {
      try {
        const fleetId = 'fleetId';
        const request: DeleteFleetRequest = new DeleteFleetRequest(fleetId);
        await deleteFleet.execute(request);
        expect(false).toEqual(true);
      } catch (error) {
        expect(error).toEqual(new FleetNotFound());
      }
    });
  });

  describe('should delete a fleet', () => {
    it('should delete a fleet', async () => {
      const fleetId = 'fleetId';
      const fleet: Fleet = new Fleet(fleetId, 5, 'fleet');
      fleetRepository.save(fleet);

      const request: DeleteFleetRequest = new DeleteFleetRequest(fleetId);
      await deleteFleet.execute(request);

      expect(await fleetRepository.get(fleetId)).toBeUndefined();
    });
  });
});
