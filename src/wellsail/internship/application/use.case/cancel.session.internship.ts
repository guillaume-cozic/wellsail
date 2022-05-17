import { InternshipNotFound } from '../../domain/exception/internship.not.found';
import { Internship } from '../../domain/model/internship';
import { InternshipRepository } from '../../domain/ports/internship.repository';

export class CancelSessionInternship {
  constructor(private readonly internshipRepository: InternshipRepository) {}

  async run(id: string, sessionId: number) {
    const internship: Internship = await this.internshipRepository.get(id);
    if (internship === undefined) {
      throw new InternshipNotFound();
    }
    internship.cancelSession(sessionId);
    this.internshipRepository.save(internship);
  }
}
