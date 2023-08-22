import React from "react";
import clsx from "clsx";
import { Link, useLocation } from "react-router-dom";
import { item } from "../utils/variant";
import { motion } from "framer-motion";
const Navlink = ({ children, icon: Icon, active, path , styles}) => {

    

  return (
    <Link  className={clsx("block w-full", styles)} to={path}>
      <motion.div variants={item} 
        className={clsx(
          "w-full flex items-center space-x-4  p-2 rounded-lg",
          active && "text-violet-600 bg-slate-100 dark:bg-slate-700 dark:text-slate-300"
        )}
      >
        <Icon className="text-4xl" />
        <p className="text-xl">{children}</p>
      </motion.div>
    </Link>
  );
};

export default Navlink;
