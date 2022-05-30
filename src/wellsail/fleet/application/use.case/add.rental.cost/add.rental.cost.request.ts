export class AddRentalCostRequest {
  constructor(
    private readonly fleetId: string,
    private readonly costs: Array<any>,
  ) {}

  getFleetId(): string {
    return this.fleetId;
  }

  getCosts(): Array<any> {
    return this.costs;
  }
}
