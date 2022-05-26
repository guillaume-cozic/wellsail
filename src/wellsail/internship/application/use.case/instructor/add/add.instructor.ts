import { Identity } from '../../../../domain/model/instructor/identity';
import { EmailAlreadyUsed } from '../../../../domain/exception/email.already.used';
import { Instructor } from '../../../../domain/model/instructor/instructor';
import { InstructorRepository } from '../../../../domain/ports/instructor.repository';
import { AddRequest } from './add.request';
import { Presenter } from './presenter';
import { Email } from '../../../../domain/vo/email';

export class AddInstructor {
  constructor(private readonly instructorRepository: InstructorRepository) {}

  async execute(request: AddRequest, presenter: Presenter) {
    try {
      return this.run(request);
    } catch (error) {
      presenter.addError(error);
    }
  }

  private async run(request: AddRequest) {
    const email: Email = new Email(request.getEmail());
    const instructor: Instructor = await this.instructorRepository.getByEmail(
      request.getEmail(),
    );
    if (instructor !== undefined) {
      throw new EmailAlreadyUsed();
    }

    const identity: Identity = new Identity(
      request.getFirstname(),
      request.getLastname(),
      email,
    );
    const newInstructor: Instructor = new Instructor(request.getId(), identity);
    this.instructorRepository.save(newInstructor);
  }
}
