import React, { useContext } from "react";
import clsx from "clsx";

import Navlink from "../Navlink/Navlink";
import useRoutes from "../../hooks/useRoute";
import { container } from "../utils/variant";
import { motion } from "framer-motion";
import { BiLogOut } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { WiDaySunny } from "react-icons/wi";

import { ThemeContext } from "../../context/ThemeContext";

import { useLocation } from "react-router-dom";

const Sidebar = () => {
  const routes = useRoutes();
  const dispatch = useDispatch();
  const location = useLocation().pathname;

  const { toggleTheme, theme } = useContext(ThemeContext);

  const logoutHandler = () => {
    dispatch(logout());
    console.log(logout);
  };
  return (
    <nav
      className={clsx(
        "fixed w-[300px] h-screen col-[1] bg-gray-200 dark:bg-slate-900 dark:text-white ease-in-out duration-500 "
      )}
    >
      <h1 className="text-center text-3xl py-6 text-violet-900 font-medium">
        BIBLIOTHEQUE
      </h1>
      <motion.div
        variants={container}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center px-3 space-y-2 relative h-[85%]"
      >
        {routes.map((route) => (
          <Navlink
            key={route.path}
            icon={route.icon}
            active={route.active}
            path={route.path}
          >
            {route.label}
          </Navlink>
        ))}
        <div
          className="w-full absolute bottom-12 px-3"
          onClick={toggleTheme}
          path=""
        >
          <div
            className={clsx(
              "w-full flex items-center space-x-4  p-2 rounded-lg cursor-pointer"
            )}
          >
            <WiDaySunny className="text-4xl" />
            <p className="text-xl">Changer thème</p>
          </div>
        </div>
        <div className="w-full absolute bottom-0 px-3" onClick={logoutHandler}>
          <Navlink icon={BiLogOut}>Déconnecter</Navlink>
        </div>
      </motion.div>
    </nav>
  );
};

export default Sidebar;
