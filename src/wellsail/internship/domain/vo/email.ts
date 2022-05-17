import { EmailInvalid } from '../exception/email.invalid';

export class Email {
  private pattern = new RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  );

  constructor(private email: string) {
    if (!this.email.match(this.pattern)) {
      throw new EmailInvalid();
    }
  }

  toString(): string {
    return this.email;
  }
}
