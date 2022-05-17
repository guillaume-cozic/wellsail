import { InternshipNotFound } from '../../domain/exception/internship.not.found';
import { Internship } from '../../domain/model/internship';
import { InternshipRepository } from '../../domain/ports/internship.repository';

export class CancelRegistration {
  constructor(private internshipRepository: InternshipRepository) {}

  async run(registrationId: string) {
    const internship: Internship =
      await this.internshipRepository.getByRegistration(registrationId);
    if (internship === undefined) {
      throw new InternshipNotFound();
    }
    internship.cancelRegistration(registrationId);
    this.internshipRepository.save(internship);
  }
}
