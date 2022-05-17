import { Identity } from '../../../domain/model/instructor/identity';
import { EmailAlreadyUsed } from '../../../domain/exception/email.already.used';
import { Instructor } from '../../../domain/model/instructor';
import { InMemoryInstructorRepository } from '../../../infrastructure/in.memory/in.memory.instructor.repository';
import { AddInstructor } from './add.instructor';
import { AddRequest } from './add.request';
import { Presenter } from './presenter';
import { EmailInvalid } from '../../../domain/exception/email.invalid';
import { Email } from '../../../domain/vo/email';

describe('add an instructor', () => {
  const instructorRepository: InMemoryInstructorRepository =
    new InMemoryInstructorRepository();
  const addInstructor: AddInstructor = new AddInstructor(instructorRepository);
  const instructorId = 'instructorId';
  const addRequest = new AddRequest(
    instructorId,
    'guillaume',
    'cozic',
    'guillaume.cozic@gmail.com',
  );
  const presenter: Presenter = new Presenter();
  const firstname = 'guillaume';
  const lastname = 'cozic';
  const email = 'guillaume.cozic@gmail.com';
  const identity: Identity = new Identity(
    firstname,
    lastname,
    new Email(email),
  );

  it('should create an instructor', async () => {
    await addInstructor.execute(addRequest, presenter);

    const instructorExpected: Instructor = new Instructor(
      instructorId,
      identity,
    );
    expect(await instructorRepository.all()).toContainEqual(instructorExpected);
  });

  it('should not create an instructor when email duplicate', async () => {
    addExistingInstructor();
    await assertInstructorNotCreated();
  });

  it('should not create an instructor with an incorrect email address', async () => {
    try {
      const addRequest = new AddRequest(
        instructorId,
        'guillaume',
        'cozic',
        'guillaume.cozic',
      );
      await addInstructor.execute(addRequest, presenter);
      expect(false).toEqual(true);
    } catch (error) {
      expect(error).toEqual(new EmailInvalid());
    }
  });

  function addExistingInstructor() {
    const instructor: Instructor = new Instructor('instructorId', identity);
    instructorRepository.save(instructor);
  }

  async function assertInstructorNotCreated() {
    try {
      await addInstructor.execute(addRequest, presenter);
      expect(false).toEqual(true);
    } catch (error) {
      expect(error).toEqual(new EmailAlreadyUsed());
    }
  }
});
