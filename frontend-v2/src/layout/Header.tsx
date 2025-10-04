import { Outlet, Link } from "react-router-dom";

const navItems = [
  {
    to: "/",
    label: "Home",
    variant: "bg-orange-500 hover:bg-orange-600",
  },
  { to: "/create-user", label: "Alta Alumno" },
  { to: "/list-users", label: "Listado Alumnos" },
  { to: "/create-teacher", label: "Alta Profesor" },
  { to: "/list-teachers", label: "Listado Profesores" },
  { to: "/schedule", label: "Horarios" },
];

const Header = () => {
  return (
    <>
      <header className="bg-gray-900 border-b border-gray-800 shadow-l">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent mb-6">
            Gestión de Alumnos - Gimnasio
          </h1>
          <nav className="flex justify-center gap-4 flex-wrap">
            {navItems.map(({ to, label, variant }) => {
              const base =
                "text-white px-4 py-2 rounded-lg font-semibold transition-colors";
              const color = variant || "bg-blue-500 hover:bg-blue-600";
              return (
                <Link key={to} to={to} className={`${color} ${base}`}>
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
      <Outlet />
    </>
  );
};

export default Header;
