export * from "./user";
export * from "./teacher";
export * from "./general";
export * from "./schedule";

export type FormChangeHandler = React.ChangeEventHandler<
  HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
>;
export type FormSubmitHandler = React.FormEventHandler<HTMLFormElement>;
