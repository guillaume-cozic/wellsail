import { InternshipFull } from '../../domain/exception/internship.full';
import { InternshipNotFound } from '../../domain/exception/internship.not.found';
import { Internship } from '../../domain/model/internship';
import { Registration } from '../../domain/model/registration';
import { Sessions } from '../../domain/model/sessions';
import { TemplateInternship } from '../../domain/model/teamplate.internship';
import { Trainee } from '../../domain/model/trainee';
import { DateProvider } from '../../domain/ports/date.provider';
import { InternshipRepository } from '../../domain/ports/internship.repository';
import { TemplateInternshipRepository } from '../../domain/ports/template.internship.repository';
import { AgeInterval } from '../../domain/vo/age.interval';
import { InMemoryDateProvider } from '../../infrastructure/in.memory/in.memory.date.provider';
import { InMemoryInternshipRepository } from '../../infrastructure/in.memory/in.memory.internship.repository';
import { InMemoryTemplateInternship } from '../../infrastructure/in.memory/in.memory.template.internship';
import { InternshipBuilder } from '../builder/internship.builder';
import { RegisterTraineeToInternship } from './register.trainee.to.internship';

describe('register trainee to an internship', () => {
  let registerTraineeToInternship: RegisterTraineeToInternship;
  let templateInternshipRepository: TemplateInternshipRepository;
  let dateProvider: DateProvider;
  let internshipRepository: InternshipRepository;
  const now = Date.now();
  const templateId = 'templateid';

  beforeEach(async () => {
    templateInternshipRepository = new InMemoryTemplateInternship();
    dateProvider = new InMemoryDateProvider(new Date());
    internshipRepository = new InMemoryInternshipRepository(dateProvider);
    registerTraineeToInternship = new RegisterTraineeToInternship(
      templateInternshipRepository,
      internshipRepository,
    );

    const templateInternship: TemplateInternship = new TemplateInternship(
      templateId,
      'title',
      1,
      new AgeInterval(10, 20),
    );
    templateInternshipRepository.save(templateInternship);

    const internship: Internship = new Internship(
      'id',
      templateId,
      new Sessions([{ start: now + 100, end: now + 3600, state: '' }]),
    );
    internshipRepository.save(internship);
  });

  it('should not register trainee to unknown internship', async () => {
    const internshipId = 'id404';
    const trainee = { firstname: 'frank', lastname: 'dupont' };
    const registrationId = 'registrationId';

    try {
      await registerTraineeToInternship.run(
        internshipId,
        trainee,
        registrationId,
      );
      expect(false).toEqual(true);
    } catch (error) {
      expect(error).toStrictEqual(new InternshipNotFound());
    }
  });

  it('should register trainee to internship', async () => {
    const internshipId = 'id';
    const trainee = { firstname: 'frank', lastname: 'dupont' };
    const registrationId = 'registrationId';

    await registerTraineeToInternship.run(
      internshipId,
      trainee,
      registrationId,
    );

    const internshipSaved: Internship = await internshipRepository.get(
      internshipId,
    );

    const internshipExpected: Internship = InternshipBuilder.builder(
      internshipId,
      templateId,
    )
      .withSessions([{ start: now + 100, end: now + 3600, state: '' }])
      .withRegistrations([
        new Registration(
          registrationId,
          new Trainee(trainee.firstname, trainee.lastname),
        ),
      ])
      .build();

    expect(internshipExpected).toEqual(internshipSaved);
  });

  it('should not register trainee to full internship', async () => {
    const internshipId = 'intershipIdFull';
    const trainee = { firstname: 'enzo', lastname: 'dupont' };
    const registrationId = 'registrationId';

    const registration: Registration = new Registration(
      registrationId,
      new Trainee(trainee.firstname, trainee.lastname),
    );
    const internshipFull: Internship = InternshipBuilder.builder(
      internshipId,
      templateId,
    )
      .withOneCommonSession(now)
      .withRegistrations([registration])
      .build();

    internshipRepository.save(internshipFull);
    try {
      await registerTraineeToInternship.run(
        internshipId,
        trainee,
        registrationId,
      );
      expect(false).toEqual(true);
    } catch (error) {
      expect(error).toStrictEqual(new InternshipFull());
    }
  });
});
