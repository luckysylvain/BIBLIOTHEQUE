import React from "react";
import clsx from "clsx";

const Button = ({ children, onClick, styles }) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        `
        
    flex
    justify-center
    rounded-md
    px-3
    py-2
    text-xl
    font-semibold
    focus-visible:outline
    focus-visible:outline-2
    focus-visible:outline-offset-2 `,
        styles
      )}
    >
      {children}
    </button>
  );
};

export default Button;
