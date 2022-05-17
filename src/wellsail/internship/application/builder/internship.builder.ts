import { Internship } from '../../domain/model/internship';
import { Registration } from '../../domain/model/registration';
import { SessionPrimitives, Sessions } from '../../domain/model/sessions';
import { Trainee } from '../../domain/model/trainee';

export interface RegistrationPrimitives {
  registrationId: string;
  traineeFirstname: string;
  traineeLastname: string;
}

export class InternshipBuilder {
  private sessions: Sessions;
  private registrations: Array<Registration>;

  private constructor(
    private id: string,
    private templateId: string,
    private registrationsState: string = Internship.openRegistrationStatus,
  ) {}

  static builder(id: string, templateId: string): InternshipBuilder {
    return new InternshipBuilder(id, templateId);
  }

  withSessions(sessions: Array<SessionPrimitives>): InternshipBuilder {
    this.sessions = new Sessions(sessions);
    return this;
  }

  withRegistrations(registrations: Array<Registration>): InternshipBuilder {
    this.registrations = registrations;
    return this;
  }

  withRegistrationsPrimitives(
    registrationsPrimitives: Array<RegistrationPrimitives>,
  ): InternshipBuilder {
    this.registrations = registrationsPrimitives.map(
      (registrationPrimitive: RegistrationPrimitives) => {
        return new Registration(
          registrationPrimitive.registrationId,
          new Trainee(
            registrationPrimitive.traineeFirstname,
            registrationPrimitive.traineeLastname,
          ),
        );
      },
    );
    return this;
  }

  withOneCommonSession(now: number): InternshipBuilder {
    this.sessions = new Sessions([
      { start: now + 100, end: now + 200, state: '' },
    ]);
    return this;
  }

  withRegistrationsOpenState(): InternshipBuilder {
    this.registrationsState = Internship.openRegistrationStatus;
    return this;
  }

  withRegistrationsCloseState(): InternshipBuilder {
    this.registrationsState = Internship.closedRegistrationStatus;
    return this;
  }

  build(): Internship {
    return new Internship(
      this.id,
      this.templateId,
      this.sessions,
      this.registrations,
      this.registrationsState,
    );
  }
}
