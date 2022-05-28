import { FleetRepository } from '../../../domain/fleet.repository';
import { InMemoryFleetRepository } from '../../../infrastructure/in.memory/in.memory.fleet.repository';
import { FleetNotFound } from '../../../domain/exception/fleet.not.found';
import { UpdateFleet } from './update.fleet';
import { UpdateFleetRequest } from './update.fleet.request';
import { FleetTitleAlreadyUsed } from '../../../domain/exception/fleet.title.already.used';
import { Fleet } from '../../../domain/fleet';
import { EmptyFleet } from '../../../domain/exception/empty.fleet';

describe('update a fleet', () => {
  let updateFleet: UpdateFleet;
  let fleetRepository: FleetRepository;

  beforeEach(() => {
    fleetRepository = new InMemoryFleetRepository();
    updateFleet = new UpdateFleet(fleetRepository);
  });

  describe('should not update a fleet', () => {
    it('when fleet not found', async () => {
      try {
        const fleetId = 'fleetId';
        const request: UpdateFleetRequest = new UpdateFleetRequest(
          fleetId,
          5,
          'title',
        );
        await updateFleet.execute(request);
        expect(false).toEqual(true);
      } catch (error) {
        expect(error).toEqual(new FleetNotFound());
      }
    });

    it('with the same name used twice', async () => {
      try {
        const fleetId = 'fleetId';
        fleetRepository.save(new Fleet(fleetId, 10, 'title'));
        const request: UpdateFleetRequest = new UpdateFleetRequest(
          fleetId,
          5,
          'title',
        );
        await updateFleet.execute(request);
        expect(false).toEqual(true);
      } catch (error) {
        expect(error).toEqual(new FleetTitleAlreadyUsed());
      }
    });

    it('with any boats', async () => {
      try {
        const fleetId = 'fleetId';
        fleetRepository.save(new Fleet(fleetId, 10, 'title'));
        const request: UpdateFleetRequest = new UpdateFleetRequest(
          fleetId,
          0,
          'anothertitle',
        );
        await updateFleet.execute(request);
        expect(false).toEqual(true);
      } catch (error) {
        expect(error).toEqual(new EmptyFleet());
      }
    });
  });

  describe('should update a fleet', () => {
    it('should update a fleet', async () => {
      const fleetId = 'fleetId';
      fleetRepository.save(new Fleet(fleetId, 10, 'title'));

      const request: UpdateFleetRequest = new UpdateFleetRequest(
        fleetId,
        4,
        'newtitle',
      );
      await updateFleet.execute(request);

      const fleetUpdated: Fleet = await fleetRepository.get(fleetId);
      expect(fleetUpdated).toEqual(new Fleet(fleetId, 4, 'newtitle'));
    });
  });
});
