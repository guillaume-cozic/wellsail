import { Identity } from '../../../../domain/model/instructor/identity';
import { InstructorNotFound } from '../../../../domain/exception/instructor/instructor.not.found';
import { Instructor } from '../../../../domain/model/instructor/instructor';
import { InstructorRepository } from '../../../../domain/ports/instructor.repository';
import { EditRequest } from './edit.request';
import { Email } from '../../../../domain/vo/email';
import { EmailAlreadyUsed } from '../../../../domain/exception/email.already.used';
import { EventBus } from '../../../../../core/infrastructure/event.bus';

export class EditInstructor {
  constructor(
    private readonly instructorRepository: InstructorRepository,
    private readonly eventBus: EventBus,
  ) {}

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
    this.eventBus.emit(instructor.getEvents());
  }

  private async checkIfEmailNotAlreadyUsed(
    editRequest: EditRequest,
    instructor: Instructor,
  ) {
    const instructorWithSameEmail: Instructor =
      await this.instructorRepository.getByEmail(editRequest.getEmail());
    if (
      instructorWithSameEmail !== undefined &&
      instructorWithSameEmail.getId() !== instructor.getId()
    ) {
      throw new EmailAlreadyUsed();
    }
  }
}
