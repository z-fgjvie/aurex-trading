export type Answers = {
  hasTraded: "si" | "no" | "";
  choices: Record<string, string[]>;
  age: string;
  email: string;
  name: string;
  botId: string;
};

export type FlowCtx = {
  answers: Answers;
  update: (patch: Partial<Answers>) => void;
  setChoice: (stepId: string, values: string[]) => void;
  next: () => void;
};

export const emptyAnswers: Answers = {
  hasTraded: "",
  choices: {},
  age: "",
  email: "",
  name: "",
  botId: "",
};
