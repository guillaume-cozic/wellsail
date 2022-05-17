import { Trainee } from './trainee';

export class Registration {
  constructor(private id: string, private trainee: Trainee) {}

  getId(): string {
    return this.id;
  }
}
