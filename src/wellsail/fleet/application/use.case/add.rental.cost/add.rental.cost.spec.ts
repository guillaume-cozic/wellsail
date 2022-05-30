import { InMemoryFleetRepository } from '../../../infrastructure/in.memory/in.memory.fleet.repository';
import { AddRentalCost } from './add.rental.cost';
import { AddRentalCostRequest } from './add.rental.cost.request';
import { FleetNotFound } from '../../../domain/exception/fleet.not.found';
import { Fleet } from '../../../domain/fleet';
import { RentalCostInvalid } from '../../../domain/exception/RentalCostInvalid';
import { RentalCosts } from '../../../domain/rental.costs';

describe('add a rental cost to a fleet', () => {
  let fleetRepository: InMemoryFleetRepository;
  let addRentalCost: AddRentalCost;
  const fleetId = 'fleetId';

  beforeEach(async () => {
    fleetRepository = new InMemoryFleetRepository();
    addRentalCost = new AddRentalCost(fleetRepository);

    await fleetRepository.save(new Fleet(fleetId, 10, 'title'));
  });

  const validCosts = [
    {
      cost: 1,
      time: 1,
      unit: 'hours',
    },
    {
      cost: 1,
      time: 1,
      unit: 'days',
    },
    {
      cost: 15,
      time: 0.5,
      unit: 'days',
    },
  ];

  describe('should add a rental cost', () => {
    it('to a fleet', async () => {
      const request: AddRentalCostRequest = new AddRentalCostRequest(
        fleetId,
        validCosts,
      );
      await addRentalCost.execute(request);

      const fleetSaved: Fleet = await fleetRepository.get(fleetId);
      expect(fleetSaved).toEqual(
        new Fleet(fleetId, 10, 'title', new RentalCosts(validCosts)),
      );
    });
  });

  describe('should not add a rental cost', () => {
    it('to unknown fleet', async () => {
      const fleetId = 'fleetIdUnknown';
      try {
        const request: AddRentalCostRequest = new AddRentalCostRequest(
          fleetId,
          [],
        );
        await addRentalCost.execute(request);
        expect(false).toEqual(true);
      } catch (error) {
        expect(error).toEqual(new FleetNotFound());
      }
    });

    const invalidCosts = [
      {
        cost: -1,
        time: 1,
        unit: 'hours',
      },
      {
        cost: 0,
        time: 1,
        unit: 'hours',
      },
    ];

    describe.each(invalidCosts)(
      `when rental cost per unit of time`,
      (invalidCost) => {
        it(`with cost ${invalidCost.cost}`, async () => {
          try {
            const costs: Array<any> = [];
            costs.push(invalidCost);
            const request: AddRentalCostRequest = new AddRentalCostRequest(
              fleetId,
              costs,
            );
            await addRentalCost.execute(request);
            expect(false).toEqual(true);
          } catch (error) {
            expect(error).toEqual(new RentalCostInvalid());
          }
        });
      },
    );

    const invalidCostsTime = [
      {
        cost: 10,
        time: -1,
        unit: 'hours',
      },
      {
        cost: 1,
        time: 0,
        unit: 'hours',
      },
    ];

    describe.each(invalidCostsTime)(
      `when rental cost per unit of time`,
      (invalidCost) => {
        it(`with time ${invalidCost.time}`, async () => {
          try {
            const costs: Array<any> = [];
            costs.push(invalidCost);
            const request: AddRentalCostRequest = new AddRentalCostRequest(
              fleetId,
              costs,
            );
            await addRentalCost.execute(request);
            expect(false).toEqual(true);
          } catch (error) {
            expect(error).toEqual(new RentalCostInvalid());
          }
        });
      },
    );

    const invalidCostUnitTime = [
      {
        cost: 10,
        time: 1,
        unit: 'kl',
      },
      {
        cost: 1,
        time: 1,
        unit: 'fda',
      },
    ];

    describe.each(invalidCostUnitTime)(
      `when rental cost per unit of time is not in days or hours`,
      (invalidCost) => {
        it(`with unit time ${invalidCost.unit}`, async () => {
          try {
            const costs: Array<any> = [];
            costs.push(invalidCost);
            const request: AddRentalCostRequest = new AddRentalCostRequest(
              fleetId,
              costs,
            );
            await addRentalCost.execute(request);
            expect(false).toEqual(true);
          } catch (error) {
            expect(error).toEqual(new RentalCostInvalid());
          }
        });
      },
    );
  });
});
