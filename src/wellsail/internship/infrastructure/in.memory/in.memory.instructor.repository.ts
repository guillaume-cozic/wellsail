import { Instructor } from '../../domain/model/instructor/instructor';
import { Identity } from '../../domain/model/instructor/identity';
import { InstructorRepository } from '../../domain/ports/instructor.repository';
import { Email } from '../../domain/vo/email';

export class InMemoryInstructorRepository implements InstructorRepository {
  private instructors: Array<Instructor> = [];

  async get(id: string): Promise<Instructor> {
    if (id === 'instructorEditId') {
      const identity: Identity = new Identity(
        'oldFirstname',
        'oldLastname',
        new Email('oldEmail@mail.com'),
      );
      return new Instructor('instructorEditId', identity);
    }
    return this.instructors.find((instructor) => instructor.getId() === id);
  }

  async getByEmail(email: string): Promise<Instructor> {
    return this.instructors.find(
      (instructor) => instructor.getEmail() === email,
    );
  }

  save(instructor: Instructor) {
    this.instructors.push(instructor);
  }

  async all(): Promise<Array<Instructor>> {
    return this.instructors;
  }
}
