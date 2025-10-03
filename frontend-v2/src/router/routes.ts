import Home from "../pages/home/Home";
import CreateUser from "../pages/create-user/CreateUser";
import ListUsers from "../pages/list-users/ListUsers";
import EditUser from "../pages/edit-user/EditUser";
import CreateTeacher from "../pages/create-teacher/CreateTeacher";
import EditTeacher from "../pages/edit-teacher/EditTeacher";
import ListTeachers from "../pages/list-teachers/ListTeachers";
import Schedule from "../pages/schedule/Schedule";

export const appRoutes = [
  { path: "/", Element: Home },
  { path: "/create-user", Element: CreateUser },
  { path: "/list-users", Element: ListUsers },
  { path: "/edit-user/:id", Element: EditUser },
  {
    path: "/create-teacher",
    Element: CreateTeacher,
  },
  {
    path: "/edit-teacher/:id",
    Element: EditTeacher,
  },
  { path: "/list-teachers", Element: ListTeachers },
  { path: "/schedule", Element: Schedule },
];

export default appRoutes;
