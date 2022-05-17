export class AddRequest {
  constructor(
    private id: string,
    private firstname: string,
    private lastname: string,
    private email: string,
  ) {}

  getId(): string {
    return this.id;
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
