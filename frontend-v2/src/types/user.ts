import type { FormChangeHandler, FormSubmitHandler } from "./general";

export type User = {
  id?: string;
  name: string;
  lastName: string;
  phone: string;
  countryId: string;
  emergencyPhone: string;
  expirement: string;
  debtType: string;
};

export type Column = {
  key: string;
  label: string;
};

export type CreateUserViewType = {
  values: User;
  handleChange: FormChangeHandler;
  handleSubmit: FormSubmitHandler;
  isSubmitting: boolean;
  showSuccess: boolean;
  showError: boolean;
  errorMessage: string;
  setShowSuccess: (value: boolean) => void;
  submittedData?: User;
};

export type ListUsersViewType = {
  users: User[];
  loading: boolean;
  search: string;
  setSearch: (value: string) => void;
  columns: Column[];
  fetchUsers: () => void;
  navigate: (path: string) => void;
  pendingDeleteId: string | null;
  deleting: boolean;
  requestDelete: (id: string) => void;
  cancelDelete: () => void;
  confirmDelete: () => void;
};

export interface EditUserViewProps {
  values: {
    name: string;
    lastName: string;
    countryId: string;
    phone: string;
    emergencyPhone: string;
    expirement: string;
    debtType: string;
  };
  handleChange: FormChangeHandler;
  handleSubmit: FormSubmitHandler;
  isSubmitting: boolean;
  error: string;
  navigate: (path: string) => void;
}
