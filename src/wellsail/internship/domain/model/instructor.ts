import { Identity } from './instructor/identity';

export class Instructor {
  constructor(private id: string, private identity: Identity) {}

  editIdentity(newIdentity: Identity) {
    this.identity = newIdentity;
  }

  getId(): string {
    return this.id;
  }

  getEmail(): string {
    return this.identity.getEmail();
  }
}
