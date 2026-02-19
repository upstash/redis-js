import { ReactNode } from "react";

export type StepConfig = {
  title: string;
  description: ReactNode;
  code?: string;
  result?: ReactNode;
};
