import { TemplateInternship } from '../model/teamplate.internship';

export interface TemplateInternshipRepository {
  save(templateInternship: TemplateInternship): void;
  get(id: string): Promise<TemplateInternship>;
}
