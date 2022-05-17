import { TemplateInternship } from '../../../domain/model/teamplate.internship';
import { TemplateInternshipRepository } from '../../../domain/ports/template.internship.repository';
import { AgeInterval } from '../../../domain/vo/age.interval';

export class CreateTemplateInternship {
  constructor(
    private readonly templateInternshipRepository: TemplateInternshipRepository,
  ) {}

  run(
    id: string,
    title: string,
    numberTrainees: number,
    startAge?: number,
    endAge?: number,
  ) {
    const templateInternship = new TemplateInternship(
      id,
      title,
      numberTrainees,
      new AgeInterval(startAge, endAge),
    );
    this.templateInternshipRepository.save(templateInternship);
  }
}
