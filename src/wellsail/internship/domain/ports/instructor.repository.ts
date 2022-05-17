import { Instructor } from '../model/instructor';

export interface InstructorRepository {
  get(id: string): Promise<Instructor>;
  getByEmail(email: string): Promise<Instructor>;
  save(instructor: Instructor);
}
