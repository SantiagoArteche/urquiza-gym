import Home from "./pages/home/Home";
import { Route, BrowserRouter, Routes } from "react-router-dom";
import CreateUser from "./pages/create-user/CreateUser";
import Header from "./pages/layout/Header";
import ListUsers from "./pages/list/ListUsers";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Header />}>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateUser />} />
          <Route path="/list" element={<ListUsers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
