import { InternshipNotFound } from '../../domain/exception/internship.not.found';
import { Internship } from '../../domain/model/internship';
import { InternshipRepository } from '../../domain/ports/internship.repository';

export class CloseRegistrationsInternship {
  constructor(private readonly internshipRepository: InternshipRepository) {}

  async run(internshipId: string) {
    const internship: Internship = await this.internshipRepository.get(
      internshipId,
    );
    if (internship === undefined) {
      throw new InternshipNotFound();
    }
    internship.closeRegistrations();
    this.internshipRepository.save(internship);
  }
}
