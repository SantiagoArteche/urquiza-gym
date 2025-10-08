import type { User } from "./user";

export interface HomeViewProps {
  values: { dni: string };
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  isSubmitting: boolean;
  error: string;
  client: User | null;
  handleLogout: () => void;
  onOpenSchedule: () => void;
  scheduleLoading: boolean;
}

export type FormChangeHandler = React.ChangeEventHandler<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>;
export type FormSubmitHandler = React.FormEventHandler<HTMLFormElement>;
