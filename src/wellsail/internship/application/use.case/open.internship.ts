import { InternshipTemplateNotFound } from '../../domain/exception/internship.template.not.found';
import { Internship } from '../../domain/model/internship';
import { Sessions } from '../../domain/model/sessions';
import { TemplateInternship } from '../../domain/model/teamplate.internship';
import { InternshipRepository } from '../../domain/ports/internship.repository';
import { TemplateInternshipRepository } from '../../domain/ports/template.internship.repository';

export class OpenInternship {
  constructor(
    private readonly templateInternshipRepository: TemplateInternshipRepository,
    private readonly internshipRepository: InternshipRepository,
  ) {}

  async run(
    id: string,
    templateId: string,
    sessions: Array<{ end: number; start: number; state: string }>,
  ) {
    const templateInternship: TemplateInternship =
      await this.templateInternshipRepository.get(templateId);
    if (templateInternship === undefined) {
      throw new InternshipTemplateNotFound();
    }
    const internship: Internship = new Internship(
      id,
      templateId,
      new Sessions(sessions),
    );
    internship.open();
    return this.internshipRepository.save(internship);
  }
}
