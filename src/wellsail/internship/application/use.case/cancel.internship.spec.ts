import { InternshipNotFound } from '../../domain/exception/internship.not.found';
import { InternshipWithActiveRegistrations } from '../../domain/exception/internship.with.active.registrations';
import { Internship } from '../../domain/model/internship';
import { Registration } from '../../domain/model/registration';
import { Trainee } from '../../domain/model/trainee';
import { DateProvider } from '../../domain/ports/date.provider';
import { InternshipRepository } from '../../domain/ports/internship.repository';
import { InMemoryDateProvider } from '../../infrastructure/in.memory/in.memory.date.provider';
import { InMemoryInternshipRepository } from '../../infrastructure/in.memory/in.memory.internship.repository';
import { InternshipBuilder } from '../builder/internship.builder';
import { CancelInternship } from './cancel.internship';

describe('cancel an internship', () => {
  let cancelInternship: CancelInternship;
  let internshipRepository: InternshipRepository;
  let dateProvider: DateProvider;
  let now: number;
  const internshipId = 'internshipId';
  const templateId = 'templateId';

  beforeEach(async () => {
    dateProvider = new InMemoryDateProvider(new Date());
    internshipRepository = new InMemoryInternshipRepository(dateProvider);
    cancelInternship = new CancelInternship(internshipRepository);
    now = dateProvider.now().getTime();
  });

  it('should cancel an internship', async () => {
    const internship: Internship = InternshipBuilder.builder(
      internshipId,
      templateId,
    )
      .withOneCommonSession(now)
      .withRegistrationsOpenState()
      .build();
    internshipRepository.save(internship);

    await cancelInternship.run(internshipId);

    const internshipShouldBeDeleted: Internship =
      await internshipRepository.get(internshipId);
    expect(internshipShouldBeDeleted).toBeUndefined();
  });

  it('should not cancel an internship when registration active', async () => {
    const internship: Internship = InternshipBuilder.builder(
      internshipId,
      templateId,
    )
      .withRegistrations([
        new Registration('registrationId', new Trainee('first', 'last')),
      ])
      .withSessions([{ start: now + 100, end: now + 200, state: '' }])
      .withRegistrationsOpenState()
      .build();
    internshipRepository.save(internship);

    try {
      await cancelInternship.run(internshipId);
      expect(false).toBe(true);
    } catch (error) {
      expect(error).toStrictEqual(new InternshipWithActiveRegistrations());
    }
  });

  it('should not cancel an unknown internship', async () => {
    const internshipId = 'id404';

    try {
      await cancelInternship.run(internshipId);
    } catch (error) {
      expect(error).toStrictEqual(new InternshipNotFound());
    }
  });
});
