import { TemplateInternship } from '../../domain/model/teamplate.internship';
import { TemplateInternshipRepository } from '../../domain/ports/template.internship.repository';

export class InMemoryTemplateInternship
  implements TemplateInternshipRepository
{
  private templates: Array<TemplateInternship> = [];

  async get(id: string): Promise<TemplateInternship> {
    return this.templates.find((template) => template.getId() === id);
  }

  save(templateInternship: TemplateInternship): void {
    this.templates.push(templateInternship);
  }
}
