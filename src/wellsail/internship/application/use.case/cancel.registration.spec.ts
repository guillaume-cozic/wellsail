import { InternshipNotFound } from '../../domain/exception/internship.not.found';
import { RegistrationNotFound } from '../../domain/exception/registration.not.found';
import { Internship } from '../../domain/model/internship';
import { Sessions } from '../../domain/model/sessions';
import { DateProvider } from '../../domain/ports/date.provider';
import { InternshipRepository } from '../../domain/ports/internship.repository';
import { InMemoryDateProvider } from '../../infrastructure/in.memory/in.memory.date.provider';
import { InMemoryInternshipRepository } from '../../infrastructure/in.memory/in.memory.internship.repository';
import { CancelRegistration } from './cancel.registration';

describe('cancel a registration from an internship', () => {
  let cancelRegistration: CancelRegistration;
  let internshipRepository: InternshipRepository;
  let dateProvider: DateProvider;
  let now: number;

  beforeEach(async () => {
    dateProvider = new InMemoryDateProvider(new Date());
    internshipRepository = new InMemoryInternshipRepository(dateProvider);
    cancelRegistration = new CancelRegistration(internshipRepository);

    now = dateProvider.now().getTime();
  });

  it('should not cancel registration from an unknown internship', async () => {
    const registrationId = 'unknown_internship';

    try {
      await cancelRegistration.run(registrationId);
      expect(false).toEqual(true);
    } catch (error) {
      expect(error).toStrictEqual(new InternshipNotFound());
    }
  });

  it('should not cancel unknwon registration', async () => {
    const registrationId = 'unknown_registration';

    try {
      await cancelRegistration.run(registrationId);
      expect(false).toEqual(true);
    } catch (error) {
      expect(error).toStrictEqual(new RegistrationNotFound());
    }
  });

  it('should cancel registration', async () => {
    const registrationId = 'registration';
    await cancelRegistration.run(registrationId);

    const internshipSaved: Internship = await internshipRepository.get(
      'internship_id',
    );

    const sessions: Sessions = new Sessions([
      { start: now + 100, end: now + 200, state: '' },
    ]);
    const internshipExpected: Internship = new Internship(
      'internship_id',
      'template_id',
      sessions,
      [],
    );
    expect(internshipSaved).toStrictEqual(internshipExpected);
  });
});
