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

export type Age = "Küken" | "Jungtier" | "Ausgewachsen";
