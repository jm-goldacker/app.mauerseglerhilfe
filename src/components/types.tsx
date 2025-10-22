export type LogEntry = {
  id: number;
  date: Date;
  age: Age;
  birdSpecies: BirdSpecies;
  takenInDate: Date | undefined;
  takenInBy: string;
  zipFoundAt: string | undefined;
  description: string | undefined;
  redirectedTo: string | undefined;
  letFreeDate: Date | undefined;
  diedDate: Date | undefined;
  euthanasiaDate: Date | undefined;
};

export type BirdSpecies = {
  id: number;
  description: string;
};

export type Age = "chick" | "young" | "old";
