import { Identity } from '../../../../domain/model/instructor/identity';
import { InstructorNotFound } from '../../../../domain/exception/instructor/instructor.not.found';
import { Instructor } from '../../../../domain/model/instructor';
import { InstructorRepository } from '../../../../domain/ports/instructor.repository';
import { EditRequest } from './edit.request';
import { Email } from '../../../../domain/vo/email';
import { EmailAlreadyUsed } from '../../../../domain/exception/email.already.used';

export class EditInstructor {
  constructor(private readonly instructorRepository: InstructorRepository) {}

  async execute(editRequest: EditRequest) {
    const email: Email = new Email(editRequest.getEmail());
    const instructor: Instructor = await this.instructorRepository.get(
      editRequest.getInstructorId(),
    );
    if (instructor === undefined) {
      throw new InstructorNotFound();
    }

    await this.checkIfEmailNotAlreadyUsed(editRequest, instructor);

    const identity: Identity = new Identity(
      editRequest.getFirstname(),
      editRequest.getLastname(),
      email,
    );
    instructor.editIdentity(identity);
    this.instructorRepository.save(instructor);
  }

  private async checkIfEmailNotAlreadyUsed(
    editRequest: EditRequest,
    instructor: Instructor,
  ) {
    const instructorWithsameEmail: Instructor =
      await this.instructorRepository.getByEmail(editRequest.getEmail());
    if (
      instructorWithsameEmail !== undefined &&
      instructorWithsameEmail.getId() !== instructor.getId()
    ) {
      throw new EmailAlreadyUsed();
    }
  }
}
