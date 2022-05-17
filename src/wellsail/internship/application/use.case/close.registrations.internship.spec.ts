import { InternshipNotFound } from '../../domain/exception/internship.not.found';
import { RegistrationsAlreadyClosed } from '../../domain/exception/registrations.already.close';
import { Internship } from '../../domain/model/internship';
import { DateProvider } from '../../domain/ports/date.provider';
import { InternshipRepository } from '../../domain/ports/internship.repository';
import { InMemoryDateProvider } from '../../infrastructure/in.memory/in.memory.date.provider';
import { InMemoryInternshipRepository } from '../../infrastructure/in.memory/in.memory.internship.repository';
import { InternshipBuilder } from '../builder/internship.builder';
import { CloseRegistrationsInternship } from './close.registrations.internship';

describe('cancel an internship', () => {
  let closeRegistrationsInternship: CloseRegistrationsInternship;
  let internshipRepository: InternshipRepository;
  let dateProvider: DateProvider;
  let now: number;
  const internshipId = 'intershipId';
  const templateId = 'templateId';

  beforeEach(async () => {
    dateProvider = new InMemoryDateProvider(new Date());
    internshipRepository = new InMemoryInternshipRepository(dateProvider);
    closeRegistrationsInternship = new CloseRegistrationsInternship(
      internshipRepository,
    );

    now = dateProvider.now().getTime();
  });

  it('should not close registrations for an unknown internship', async () => {
    const internshipId = 'id404';

    try {
      await closeRegistrationsInternship.run(internshipId);
      expect(false).toEqual(true);
    } catch (error) {
      expect(error).toStrictEqual(new InternshipNotFound());
    }
  });

  it('should close registrations internship', async () => {
    const session = { start: now + 100, end: now + 3600, state: '' };
    const internship: Internship = InternshipBuilder.builder(
      internshipId,
      templateId,
    )
      .withSessions([session])
      .build();
    internshipRepository.save(internship);

    await closeRegistrationsInternship.run(internshipId);

    const internshipExpected: Internship = InternshipBuilder.builder(
      internshipId,
      templateId,
    )
      .withSessions([session])
      .withRegistrationsCloseState()
      .build();
    const intershipSaved: Internship = await internshipRepository.get(
      internshipId,
    );
    expect(internshipExpected).toEqual(intershipSaved);
  });

  it('should not close registrations twice', async () => {
    const internship: Internship = InternshipBuilder.builder(
      internshipId,
      templateId,
    )
      .withOneCommonSession(now)
      .withRegistrationsCloseState()
      .build();
    internshipRepository.save(internship);

    try {
      await closeRegistrationsInternship.run(internshipId);
      expect(false).toEqual(true);
    } catch (error) {
      expect(error).toStrictEqual(new RegistrationsAlreadyClosed());
    }
  });
});
