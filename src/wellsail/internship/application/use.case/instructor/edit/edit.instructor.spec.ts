import { Instructor } from '../../../../domain/model/instructor';
import { InstructorNotFound } from '../../../../domain/exception/instructor/instructor.not.found';
import { InMemoryInstructorRepository } from '../../../../infrastructure/in.memory/in.memory.instructor.repository';
import { EditInstructor } from './edit.instructor';
import { EditRequest } from './edit.request';
import { Identity } from '../../../../domain/model/instructor/identity';
import { Email } from '../../../../domain/vo/email';
import { EmailAlreadyUsed } from '../../../../domain/exception/email.already.used';

describe('Edit an instructor', () => {
  const instructorRepository: InMemoryInstructorRepository =
    new InMemoryInstructorRepository();
  const editInstructor: EditInstructor = new EditInstructor(
    instructorRepository,
  );
  const instructorId = 'instructorEditId';
  const unknownInstructorId = 'unknownInstructorId';
  const firstname = 'firstname';
  const lastname = 'lastname';
  const email = 'email@mail.com';
  const identity: Identity = new Identity(
    firstname,
    lastname,
    new Email(email),
  );

  it('should not edit an unknown instructor', async () => {
    try {
      const editRequest: EditRequest = new EditRequest(
        unknownInstructorId,
        firstname,
        lastname,
        email,
      );
      await editInstructor.execute(editRequest);
      expect(true).toEqual(false);
    } catch (error) {
      expect(error).toEqual(new InstructorNotFound());
    }
  });

  it('should edit an instructor', async () => {
    const editRequest: EditRequest = new EditRequest(
      instructorId,
      firstname,
      lastname,
      email,
    );

    await editInstructor.execute(editRequest);

    const instructorExpected: Instructor = new Instructor(
      instructorId,
      identity,
    );
    expect(await instructorRepository.all()).toContainEqual(instructorExpected);
  });

  it('should not edit an instructor when email is already used', async () => {
    const instructorToEdit: Instructor = new Instructor(
      'instructorToEdit',
      new Identity('firstname', 'lastname', new Email(email)),
    );
    instructorRepository.save(instructorToEdit);

    const instructorWithSameEmail: Instructor = new Instructor(
      'instructorWithSameEmail',
      new Identity('firstname', 'lastname', new Email(email)),
    );
    instructorRepository.save(instructorWithSameEmail);

    try {
      const editRequest: EditRequest = new EditRequest(
        'anotherid',
        firstname,
        lastname,
        email,
      );
      await editInstructor.execute(editRequest);
      expect(true).toEqual(false);
    } catch (error) {
      expect(error).toEqual(new EmailAlreadyUsed());
    }
  });
});
