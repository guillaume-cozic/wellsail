import { DateIntervalInvalid } from '../exception/date.interval.invalid';
import { InternshipWith0Session } from '../exception/internship_with_0_session';
import { SessionNotFound } from '../exception/session.not.found';
import { Session } from './session';

export interface SessionPrimitives {
  end: number;
  start: number;
  state: string;
}

export class Sessions {
  private sessions: Array<Session> = [];

  constructor(sessions: Array<SessionPrimitives>) {
    sessions.forEach((session: SessionPrimitives, index: number) => {
      this.sessions.push(
        new Session(index + 1, session.start, session.end, session.state),
      );
    });
    this.checkIfNotEmpty();
    this.checkIfNoOverlaping();
  }

  cancelSession(sessionId: number) {
    const session: Session = this.sessions.find(
      (s: Session) => s.getIndex() === sessionId,
    );
    if (session === undefined) {
      throw new SessionNotFound();
    }
    session.cancel();
  }

  validateNoSessionIsInThePast() {
    this.sessions.forEach((session: Session) => {
      if (session.isPast()) {
        throw new DateIntervalInvalid();
      }
    });
  }

  private checkIfNoOverlaping() {
    this.sessions.forEach((currentSession: Session) => {
      this.sessions.forEach((session: Session) => {
        if (currentSession.isOverlapWith(session)) {
          throw new DateIntervalInvalid();
        }
      });
    });
  }

  private checkIfNotEmpty() {
    if (this.sessions.length === 0) {
      throw new InternshipWith0Session();
    }
  }
}
