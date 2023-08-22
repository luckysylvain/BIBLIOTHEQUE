import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import clsx from "clsx";
import { Outlet } from "react-router-dom";
import useRoutes from "../../hooks/useRoute";
import ThemeContextProvider from "../../context/ThemeContext";

const AdminLayout = () => {
  const routes = useRoutes();
  return (
    <ThemeContextProvider>
      <main className={clsx("w-full h-screen grid grid-cols-[300px,1fr]")}>
        <Sidebar />
        <div className="col-[2]">
          <div className="w-full py-2 px-6 h-auto  bg-slate-100 dark:bg-slate-900 dark:text-white ease-in-out duation-500">
            {routes.map(
              (route) =>
                route.active && (
                  <p className="text-4xl font-bold" key={route.icon}>
                    {route.label}
                  </p>
                )
            )}

            
          </div>
          <div className="w-full px-12">
            <Outlet />
          </div>
        </div>
      </main>
    </ThemeContextProvider>
  );
};

export default AdminLayout;
