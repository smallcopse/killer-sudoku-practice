import { House } from './house'

export class Row extends House {
  str(delimiter="-"): string {
    return ""
  }

  name() {
    return `Row ${this.id}`
  }

  get type(): string {
    return "Row"
  }
}