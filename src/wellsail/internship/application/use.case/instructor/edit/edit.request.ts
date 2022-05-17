export class EditRequest {
  constructor(
    private instructorId: string,
    private firstname: string,
    private lastname: string,
    private email: string,
  ) {}

  getInstructorId(): string {
    return this.instructorId;
  }

  getFirstname(): string {
    return this.firstname;
  }

  getLastname(): string {
    return this.lastname;
  }

  getEmail(): string {
    return this.email;
  }
}
