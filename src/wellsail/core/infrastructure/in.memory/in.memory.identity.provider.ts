import { IdentityProvider } from '../../application/identity.provider';

export class InMemoryIdentityProvider implements IdentityProvider {
  private count = 0;
  id(): string {
    this.count++;
    return this.count.toString();
  }
}
