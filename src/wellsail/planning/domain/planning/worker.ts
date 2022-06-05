import { SimpleEvent } from './simple.event';

export class Worker {
  public static readonly INSTRUCTOR = 'INSTRUCTOR';
  public static readonly SECRETARY = 'SECRETARY';

  constructor(private id: string, private roles: Array<string> = []) {}

  getId(): string {
    return this.id;
  }

  isSkilled(task: string): boolean {
    if (task === SimpleEvent.INTERNSHIP) {
      return this.isInstructor();
    }
    return true;
  }

  private isInstructor(): boolean {
    return this.roles.find((role) => role === Worker.INSTRUCTOR) !== undefined;
  }
}
