import { RentalCostInvalid } from './exception/rental.cost.invalid';

export interface Cost {
  cost: number;
  time: number;
  unit: string;
}

export class RentalCosts {
  constructor(private readonly costs: Array<Cost>) {
    costs.forEach((cost: Cost) => {
      this.checkCost(cost);
      this.checkTime(cost);
      this.checkUnitTime(cost);
    });
  }

  private checkUnitTime(cost: Cost) {
    if (cost.unit !== 'hours' && cost.unit !== 'days') {
      throw new RentalCostInvalid();
    }
  }

  private checkCost(cost: Cost) {
    if (cost.cost <= 0) {
      throw new RentalCostInvalid();
    }
  }

  private checkTime(cost: Cost) {
    if (cost.time <= 0) {
      throw new RentalCostInvalid();
    }
  }
}
