import { House } from './house'

export class Column extends House {
  str(delimiter="-"): string {
    return ""
  }

  name() {
    return `Column ${this.id}`
  }

  get type(): string {
    return "Column"
  }
}
