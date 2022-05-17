import { async } from 'rxjs';
import { DateIntervalInvalid } from '../../domain/exception/date.interval.invalid';
import { InternshipTemplateNotFound } from '../../domain/exception/internship.template.not.found';
import { InternshipWith0Session } from '../../domain/exception/internship_with_0_session';
import { Internship } from '../../domain/model/internship';
import { Sessions } from '../../domain/model/sessions';
import { TemplateInternship } from '../../domain/model/teamplate.internship';
import { DateProvider } from '../../domain/ports/date.provider';
import { InternshipRepository } from '../../domain/ports/internship.repository';
import { TemplateInternshipRepository } from '../../domain/ports/template.internship.repository';
import { AgeInterval } from '../../domain/vo/age.interval';
import { InMemoryDateProvider } from '../../infrastructure/in.memory/in.memory.date.provider';
import { InMemoryInternshipRepository } from '../../infrastructure/in.memory/in.memory.internship.repository';
import { InMemoryTemplateInternship } from '../../infrastructure/in.memory/in.memory.template.internship';
import { OpenInternship } from './open.internship';

describe('open an internship', () => {
  let openInternship: OpenInternship;
  let templateInternshipRepository: TemplateInternshipRepository;
  let internshipRepository: InternshipRepository;
  let dateProvider: DateProvider;
  const now = Date.now();

  beforeEach(async () => {
    templateInternshipRepository = new InMemoryTemplateInternship();
    dateProvider = new InMemoryDateProvider(new Date());
    internshipRepository = new InMemoryInternshipRepository(dateProvider);
    openInternship = new OpenInternship(
      templateInternshipRepository,
      internshipRepository,
    );

    const templateInternship: TemplateInternship = new TemplateInternship(
      'abc',
      'title',
      10,
      new AgeInterval(10, 20),
    );
    templateInternshipRepository.save(templateInternship);
  });

  it('should not open an internship when template does not exist', async () => {
    const templateId = '404';
    const id = 'id';
    try {
      await openInternship.run(id, templateId, []);
      expect(false).toEqual(true);
    } catch (error) {
      expect(error).toEqual(new InternshipTemplateNotFound());
    }
  });

  it('should open an internship', async () => {
    const templateId = 'abc';
    const id = 'id';
    const start = now + 86400;
    const end = now + 86400 + 60 * 60;
    const sessions: Array<{ end: number; start: number; state: string }> = [
      {
        start: start,
        end: end,
        state: '',
      },
      {
        start: start + 86400 * 3,
        end: end + 86400 * 3,
        state: '',
      },
    ];
    await openInternship.run(id, templateId, sessions);

    const internshipExpected: Internship = new Internship(
      id,
      templateId,
      new Sessions(sessions),
    );
    const internshipSaved: Internship = await internshipRepository.get(id);
    expect(internshipSaved).toEqual(internshipExpected);
  });

  it('should not open an internship with 0 session', async () => {
    const templateId = 'abc';
    const id = 'id';

    const sessions: Array<{ end: number; start: number; state: string }> = [];
    try {
      await openInternship.run(id, templateId, sessions);
      expect(false).toEqual(true);
    } catch (error) {
      expect(error).toStrictEqual(new InternshipWith0Session());
    }
  });

  it('should not open an internship with invalid session, end date before start date', async () => {
    const templateId = 'abc';
    const id = 'id';

    const start = now + 86400;
    const end = now + 86400 + 60 * 60;
    const sessions: Array<{ end: number; start: number; state: string }> = [
      {
        start: end,
        end: start,
        state: '',
      },
    ];

    try {
      await openInternship.run(id, templateId, sessions);
      expect(false).toEqual(true);
    } catch (error) {
      expect(error).toEqual(new DateIntervalInvalid());
    }
  });

  it('should not open an internship with invalid session, overlaping sessions', async () => {
    const templateId = 'abc';
    const id = 'id';

    const start = now + 86400;
    const end = now + 86400 + 60 * 60;
    const sessions: Array<{ end: number; start: number; state: string }> = [
      {
        start: start,
        end: end,
        state: '',
      },
      {
        start: start + 60,
        end: end + 86400,
        state: '',
      },
    ];

    try {
      await openInternship.run(id, templateId, sessions);
      expect(false).toEqual(true);
    } catch (error) {
      expect(error).toStrictEqual(new DateIntervalInvalid());
    }
  });

  it('should not open an internship with invalid session, in the  past', async () => {
    const templateId = 'abc';
    const id = 'id';

    const start = now - 86400;
    const end = now - (86400 - 60 * 60);
    const sessions: Array<{ end: number; start: number; state: string }> = [
      {
        start: start,
        end: end,
        state: '',
      },
    ];

    try {
      await openInternship.run(id, templateId, sessions);
      expect(false).toEqual(true);
    } catch (error) {
      expect(error).toStrictEqual(new DateIntervalInvalid());
    }
  });
});
