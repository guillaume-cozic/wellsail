import { CreateFleet } from './create.fleet';
import { CreateFleetRequest } from './create.fleet.request';
import { EmptyFleet } from '../../../domain/exception/empty.fleet';
import { Fleet } from '../../../domain/fleet';
import { FleetRepository } from '../../../domain/fleet.repository';
import { InMemoryFleetRepository } from '../../../infrastructure/in.memory/in.memory.fleet.repository';
import { FleetTitleAlreadyUsed } from '../../../domain/exception/fleet.title.already.used';

describe('create a fleet', () => {
  let createFleet: CreateFleet;
  let fleetRepository: FleetRepository;

  beforeEach(() => {
    fleetRepository = new InMemoryFleetRepository();
    createFleet = new CreateFleet(fleetRepository);
  });

  describe('should not create a fleet ', () => {
    it('with any boats in', async () => {
      try {
        const boatsQty = 0;
        const title = 'Hobie cat 15';
        const request: CreateFleetRequest = new CreateFleetRequest(
          boatsQty,
          title,
        );
        await createFleet.execute(request);
        expect(false).toEqual(true);
      } catch (error) {
        expect(error).toEqual(new EmptyFleet());
      }
    });

    it('with the same title twice', async () => {
      const title = 'Hobie cat 15';
      const boatsQty = 5;
      await addFleet(boatsQty, title);
      try {
        const request: CreateFleetRequest = new CreateFleetRequest(
          boatsQty,
          title,
        );
        await createFleet.execute(request);
        expect(false).toEqual(true);
      } catch (error) {
        expect(error).toEqual(new FleetTitleAlreadyUsed());
      }
    });

    async function addFleet(boatsQty: number, title: string) {
      const fleet = new Fleet('123', boatsQty, title);
      await fleetRepository.save(fleet);
    }
  });

  it('should create a fleet', async () => {
    const boatsQty = 5;
    const title = 'Hobie cat 15';
    const request: CreateFleetRequest = new CreateFleetRequest(boatsQty, title);
    const fleetId = await createFleet.execute(request);

    const fleetSaved = await fleetRepository.get(fleetId);
    expect(fleetSaved).toEqual(new Fleet(fleetId, boatsQty, title));
  });
});
