export type LogEntry = {
  id: number;
  date: Date;
  age: Age;
  birdSpecies: string;
  takenInDate: string | undefined;
  takenInBy: string;
  zipFoundAt: string | undefined;
  circumstance: string;
  redirectedTo: string | undefined;
  letFreeDate: string | undefined;
  diedDate: string | undefined;
  euthanasiaDate: string | undefined;
};

export type BirdSpecies = {
  name: string;
};

export type Circumstance = {
  name: string;
};

export type Age = "chick" | "young" | "old";
