export abstract class Puzzle {
  version: string = ""
  author: string = ""
  date: string = ""
  name: string = ""
  description: string = ""
  comment: string = ""
  source: string = ""
  level: string = ""
  score: number = 0

  abstract isSolved(): boolean;
}