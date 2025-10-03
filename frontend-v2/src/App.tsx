import { Route, BrowserRouter, Routes } from "react-router-dom";
import Header from "./layout/Header";
import { appRoutes } from "./router/routes";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Header />}>
          {appRoutes.map(({ path, Element }) => (
            <Route key={path} path={path} element={<Element />} />
          ))}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
