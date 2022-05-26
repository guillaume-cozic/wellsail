import { Fleet } from './fleet';

export interface FleetRepository {
  get(id: string): Promise<Fleet>;
  getByTitle(title: string): Promise<Fleet>;
  save(fleet: Fleet);
  delete(id:string);
}
