import { Identity } from './identity';
import { Aggregate } from '../../../../core/domain/aggregate';
import { InstructorEdited } from './events/instructor.edited';

export class Instructor extends Aggregate {
  constructor(private id: string, private identity: Identity) {
    super();
  }

  editIdentity(newIdentity: Identity) {
    this.identity = newIdentity;
    this.addEvent(new InstructorEdited(this.id));
  }

  getId(): string {
    return this.id;
  }

  getEmail(): string {
    return this.identity.getEmail();
  }
}
