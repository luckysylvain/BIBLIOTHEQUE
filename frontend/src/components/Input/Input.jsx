import React from "react";
import clsx from "clsx";
import { motion } from "framer-motion";
import { item } from "../utils/variant";

const Input = ({ label, value, setValue, type, styles, id, placeholder , error}) => {
  return (
    <motion.div variants={item} className="w-full">
      <label
        className="block text-lg mb-2 font-medium leading-6 text-gray-900 dark:text-slate-200"
        htmlFor={id}
      >
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        autoComplete={id}
        className={clsx(
          `form-input
            block
            w-full
            rounded-md
            border-0
            py-2
            text-gray-900
            dark:text-white
            shadow-sm
            ring-1
            ring-inset
            text-lg
            ring-gray-300
            dark:ring-slate-500
            bg-slate-100
            dark:bg-slate-800
            placeholder:text-gray-400
            focus:ring-2
            focus:ring-inset
            focus:ring-indigo-600`,
          styles,
          error !== "" && "ring-rose-500   focus:ring-0  focus:ring-rose-600"
        )}
      />
      <motion.p key={id} initial={{x:500}} transition={{duration:0.5}} animate={{x:0}} className="text-sm text-rose-500 text-right ">{error}</motion.p>
    </motion.div>
  );
};

export default Input;
