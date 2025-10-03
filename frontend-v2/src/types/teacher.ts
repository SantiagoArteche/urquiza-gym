import type { FormikErrors, FormikTouched } from "formik";
import type { FormChangeHandler, FormSubmitHandler } from "./general";

export type TeacherType = {
  id?: number;
  name: string;
  lastName: string;
  phone: string;
  countryId: string;
  emergencyPhone: string;
  assignedClasses: string[];
};

export type CreateTeacherViewType = {
  values: Omit<TeacherType, "id"> & { id?: number };
  errors: FormikErrors<Omit<TeacherType, "id"> & { id?: number }>;
  touched: FormikTouched<Omit<TeacherType, "id"> & { id?: number }>;
  handleChange: FormChangeHandler;
  handleSubmit: FormSubmitHandler;
  isSubmitting: boolean;
  showSuccess: boolean;
  showError: boolean;
  errorMessage: string;
  setShowSuccess: (v: boolean) => void;
  submittedData: TeacherType | null;
  classOptions: string[];
};

export type EditTeacherViewType = {
  values: Omit<TeacherType, "id"> & { id?: number };
  errors: FormikErrors<Omit<TeacherType, "id"> & { id?: number }>;
  touched: FormikTouched<Omit<TeacherType, "id"> & { id?: number }>;
  handleChange: FormChangeHandler;
  handleSubmit: FormSubmitHandler;
  isSubmitting: boolean;
  showSuccess: boolean;
  showError: boolean;
  errorMessage: string;
  setShowSuccess: (v: boolean) => void;
  classOptions: string[];
};

export type ListTeachersViewType = {
  teachers: TeacherType[];
  loading: boolean;
  search: string;
  setSearch: (value: string) => void;
  columns: { key: string; label: string }[];
  fetchTeachers: () => void;
  navigate: (path: string) => void;
  pendingDeleteId: string | null;
  deleting: boolean;
  requestDelete: (id: string) => void;
  cancelDelete: () => void;
  confirmDelete: () => void;
};
