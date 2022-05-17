import { Internship } from '../model/internship';

export interface InternshipRepository {
  save(internship: Internship): void;
  get(id: string): Promise<Internship>;
  getByRegistration(registrationId: string): Promise<Internship>;
  delete(id: string): void;
}
