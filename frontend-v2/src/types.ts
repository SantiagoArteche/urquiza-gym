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
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
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
  handleChange: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  isSubmitting: boolean;
  error: string;
  navigate: (path: string) => void;
}

export interface HomeViewProps {
  values: { dni: string };
  handleChange: React.ChangeEventHandler<HTMLInputElement>;
  handleSubmit: React.FormEventHandler<HTMLFormElement>;
  isSubmitting: boolean;
  error: string;
  client: User | null;
  handleLogout: () => void;
}
