export type LogEntry = {
  id: number;
  date: Date;
  age: Age;
  birdSpecies: string;
  takenInDate: Date | undefined;
  takenInBy: string;
  zipFoundAt: string | undefined;
  circumstance: string;
  redirectedTo: string | undefined;
  letFreeDate: Date | undefined;
  diedDate: Date | undefined;
  euthanasiaDate: Date | undefined;
};

export type BirdSpecies = {
  name: string;
};

export type Circumstance = {
  id: number;
  name: string;
};

export type Age = "Küken" | "Jungtier" | "Ausgewachsen";
