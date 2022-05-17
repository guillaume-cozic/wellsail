import { InternshipFull } from '../exception/internship.full';
import { InternshipWithActiveRegistrations } from '../exception/internship.with.active.registrations';
import { RegistrationNotFound } from '../exception/registration.not.found';
import { RegistrationsAlreadyClosed } from '../exception/registrations.already.close';
import { Registration } from './registration';
import { Sessions } from './sessions';
import { TemplateInternship } from './teamplate.internship';

export class Internship {
  static readonly openRegistrationStatus = 'open';
  static readonly closedRegistrationStatus = 'closed';

  constructor(
    private id: string,
    private templateId: string,
    private sessions: Sessions,
    private registrations: Array<Registration> = [],
    private status: string = Internship.openRegistrationStatus,
  ) {}

  getId(): string {
    return this.id;
  }

  open() {
    this.sessions.validateNoSessionIsInThePast();
  }

  registerTrainee(
    registration: Registration,
    templateInternship: TemplateInternship,
  ) {
    if (this.isFull(templateInternship)) {
      throw new InternshipFull();
    }
    this.registrations.push(registration);
  }

  private isFull(templateInternship: TemplateInternship): boolean {
    return this.registrations.length >= templateInternship.getMaxTrainees();
  }

  cancelRegistration(registrationId: string) {
    const registration: Registration = this.registrations.find(
      (registration) => registration.getId() === registrationId,
    );
    if (registration === undefined) {
      throw new RegistrationNotFound();
    }
    this.registrations = this.registrations.filter(
      (registration) => registration.getId() !== registrationId,
    );
  }

  cancel() {
    if (this.registrations.length > 0) {
      throw new InternshipWithActiveRegistrations();
    }
  }

  closeRegistrations() {
    if (this.isRegistrationsClosed()) {
      throw new RegistrationsAlreadyClosed();
    }
    this.status = Internship.closedRegistrationStatus;
  }

  cancelSession(sessionId: number) {
    this.sessions.cancelSession(sessionId);
  }

  private isRegistrationsClosed(): boolean {
    return this.status === Internship.closedRegistrationStatus;
  }

  getTemplateId(): string {
    return this.templateId;
  }
}
