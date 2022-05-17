import { Email } from '../../vo/email';

export class Identity {
  constructor(
    private firstname: string,
    private lastname: string,
    private email: Email,
  ) {}

  getEmail(): string {
    return this.email.toString();
  }
}
