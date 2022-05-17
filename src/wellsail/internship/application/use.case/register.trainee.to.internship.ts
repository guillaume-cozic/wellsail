import { InternshipNotFound } from '../../domain/exception/internship.not.found';
import { Internship } from '../../domain/model/internship';
import { Registration } from '../../domain/model/registration';
import { Trainee } from '../../domain/model/trainee';
import { InternshipRepository } from '../../domain/ports/internship.repository';
import { TemplateInternshipRepository } from '../../domain/ports/template.internship.repository';

export class RegisterTraineeToInternship {
  constructor(
    private readonly templateInternshipRepository: TemplateInternshipRepository,
    private readonly internshipRepository: InternshipRepository,
  ) {}

  async run(
    id: string,
    trainee: { lastname: string; firstname: string },
    registrationId: string,
  ) {
    const internship: Internship = await this.internshipRepository.get(id);
    if (internship === undefined) {
      throw new InternshipNotFound();
    }
    const templateInternship = await this.templateInternshipRepository.get(
      internship.getTemplateId(),
    );
    const registration = new Registration(
      registrationId,
      new Trainee(trainee.firstname, trainee.lastname),
    );
    internship.registerTrainee(registration, templateInternship);
    this.internshipRepository.save(internship);
  }
}
