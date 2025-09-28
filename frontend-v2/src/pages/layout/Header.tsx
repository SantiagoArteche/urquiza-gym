import { Outlet, Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      <header className="bg-gray-900 border-b border-gray-800 shadow-l">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent mb-6">
            Gestión de Alumnos - Gimnasio
          </h1>
          <nav className="flex justify-end gap-4">
            <Link
              to="/"
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Home
            </Link>
            <Link
              to="/create"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Alta Alumno
            </Link>
            <Link
              to="/list"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              Listado Alumnos
            </Link>
          </nav>
        </div>
      </header>
      <Outlet />
    </>
  );
};

export default Header;
