import { House } from './';

export class Cage extends House {
  str() {
    return ""
  }

  name() {
    return `Cage ${this.id}`
  }

  get type(): string {
    return "Cage"
  }
}