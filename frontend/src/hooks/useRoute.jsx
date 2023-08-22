import { useMemo } from "react";
import { BiBookReader, BiBookOpen, BiBookAdd, BiGridAlt } from "react-icons/bi";
import { useLocation } from "react-router-dom";


const useRoutes = () => {
  const pathname = useLocation().pathname;

  const routes = useMemo(
    () => [
      {
        label: "Dashboard",
        path: "/admin",
        icon: BiGridAlt,
        active: pathname === "/admin",
      },
      {
        label: "Membres",
        path: "/admin/membre",
        icon: BiBookReader,
        active: pathname === "/admin/membre",
      },
      {
        label: "Livre",
        path: "/admin/livre",
        icon: BiBookOpen,
        active: pathname === "/admin/livre",
      },
      {
        label: "Emprunt des livres",
        path: "/admin/emprunt",
        icon: BiBookAdd,
        active: pathname === "/admin/emprunt",
      },
    ],
    [pathname]
  );
  return routes;
};

export default useRoutes;
