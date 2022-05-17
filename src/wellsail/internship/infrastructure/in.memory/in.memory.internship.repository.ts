import { Internship } from '../../domain/model/internship';
import { Registration } from '../../domain/model/registration';
import { Sessions } from '../../domain/model/sessions';
import { Trainee } from '../../domain/model/trainee';
import { DateProvider } from '../../domain/ports/date.provider';
import { InternshipRepository } from '../../domain/ports/internship.repository';

export class InMemoryInternshipRepository implements InternshipRepository {
  private internships: Array<Internship> = [];

  private now: number;

  constructor(private readonly dateProvider: DateProvider) {
    this.now = dateProvider.now().getTime();
  }

  save(internship: Internship) {
    this.internships.push(internship);
  }

  async get(id: string): Promise<Internship> {
    return this.internships.find((internship) => internship.getId() === id);
  }

  async getByRegistration(registrationId: string): Promise<Internship> {
    if (registrationId === 'unknown_internship') {
      return undefined;
    }
    if (registrationId === 'unknown_registration') {
      const sessions: Sessions = new Sessions([
        { start: Date.now() + 100, end: Date.now() + 200, state: '' },
      ]);
      return new Internship('id', 'template_id', sessions, []);
    }
    if (registrationId === 'registration') {
      const sessions: Sessions = new Sessions([
        { start: this.now + 100, end: this.now + 200, state: '' },
      ]);
      const registration: Registration = new Registration(
        registrationId,
        new Trainee('first', 'last'),
      );
      return new Internship('internship_id', 'template_id', sessions, [
        registration,
      ]);
    }
  }

  delete(id: string): void {
    this.internships = this.internships.filter(
      (internship) => internship.getId() !== id,
    );
  }
}
