import Home from "./pages/home/Home";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import CreateUser from "./pages/create-user/CreateUser";
import Header from "./pages/layout/Header";
import ListUsers from "./pages/list/ListUsers";
import EditUser from "./pages/edit-user/EditUser";
import CreateTeacher from "./pages/create-teacher/CreateTeacher";
import EditTeacher from "./pages/edit-teacher/EditTeacher";
import ListTeachers from "./pages/list-teachers/ListTeachers";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Header />}>
          <Route path="/" element={<Home />} />
          <Route path="/create-user" element={<CreateUser />} />
          <Route path="/list-users" element={<ListUsers />} />
          <Route path="/edit-user/:id" element={<EditUser />} />
          <Route path="/create-teacher" element={<CreateTeacher />} />
          <Route path="/edit-teacher/:id" element={<EditTeacher />} />
          <Route path="/list-teachers" element={<ListTeachers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
