import { InternshipNotFound } from '../../domain/exception/internship.not.found';
import { SessionAlreadyCanceled } from '../../domain/exception/session.already.canceled';
import { SessionAlreadyPast } from '../../domain/exception/session.already.past';
import { SessionNotFound } from '../../domain/exception/session.not.found';
import { Internship } from '../../domain/model/internship';
import { DateProvider } from '../../domain/ports/date.provider';
import { InternshipRepository } from '../../domain/ports/internship.repository';
import { InMemoryDateProvider } from '../../infrastructure/in.memory/in.memory.date.provider';
import { InMemoryInternshipRepository } from '../../infrastructure/in.memory/in.memory.internship.repository';
import { InternshipBuilder } from '../builder/internship.builder';
import { CancelSessionInternship } from './cancel.session.internship';

describe('cancel a session from an internship', () => {
  let cancelSessionInternship: CancelSessionInternship;
  let internshipRepository: InternshipRepository;
  let dateProvider: DateProvider;
  let now: number;
  const internshipId = 'intershipId';
  const templateId = 'templateId';
  const sessionId = 2;

  beforeEach(async () => {
    dateProvider = new InMemoryDateProvider(new Date());
    internshipRepository = new InMemoryInternshipRepository(dateProvider);
    cancelSessionInternship = new CancelSessionInternship(internshipRepository);

    now = dateProvider.now().getTime();
  });

  it('should not cancel session from an unknown internship', async () => {
    const sessionId = 1;

    try {
      await cancelSessionInternship.run(internshipId, sessionId);
      expect(false).toBe(true);
    } catch (error) {
      expect(error).toStrictEqual(new InternshipNotFound());
    }
  });

  it('should not cancel a unknown session from an internship', async () => {
    const internship: Internship = InternshipBuilder.builder(
      internshipId,
      templateId,
    )
      .withOneCommonSession(now)
      .build();

    internshipRepository.save(internship);

    try {
      await cancelSessionInternship.run(internshipId, sessionId);
      expect(false).toBe(true);
    } catch (error) {
      expect(error).toStrictEqual(new SessionNotFound());
    }
  });

  it('should cancel session from an internship', async () => {
    const session1 = { start: now + 100, end: now + 3600, state: '' };
    const session2 = { start: now + 3700, end: now + 3800, state: '' };
    const internship: Internship = InternshipBuilder.builder(
      internshipId,
      templateId,
    )
      .withSessions([session1, session2])
      .build();

    internshipRepository.save(internship);

    await cancelSessionInternship.run(internshipId, sessionId);

    const session2Expected = { ...session2, state: 'canceled' };
    const internshipExpected: Internship = InternshipBuilder.builder(
      internshipId,
      templateId,
    )
      .withSessions([session1, session2Expected])
      .build();

    const internshipSaved: Internship = await internshipRepository.get(
      internshipId,
    );
    expect(internshipExpected).toEqual(internshipSaved);
  });

  it('should not cancel session from an internship twice', async () => {
    const sessionId = 1;

    const session = { start: now + 3700, end: now + 3800, state: 'canceled' };
    const internship: Internship = InternshipBuilder.builder(
      internshipId,
      templateId,
    )
      .withSessions([session])
      .build();

    internshipRepository.save(internship);

    try {
      await cancelSessionInternship.run(internshipId, sessionId);
      expect(false).toEqual(true);
    } catch (error) {
      expect(error).toStrictEqual(new SessionAlreadyCanceled());
    }
  });

  it('should not cancel session already past', async () => {
    const sessionId = 1;

    const session = { start: now - 3700, end: now - 1, state: '' };
    const internship: Internship = InternshipBuilder.builder(
      internshipId,
      templateId,
    )
      .withSessions([session])
      .build();

    internshipRepository.save(internship);

    try {
      await cancelSessionInternship.run(internshipId, sessionId);
      expect(false).toEqual(true);
    } catch (error) {
      expect(error).toStrictEqual(new SessionAlreadyPast());
    }
  });
});
