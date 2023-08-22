import React from "react";
import "./CircleLoader.css";
import clsx from "clsx";

const CircleLoader = ({ rayon, options, white, width }) => {
  return (
    <svg width={width} viewBox="25 25 50 50" className={`circle-loader`}>
      <circle
        r={rayon ? rayon : 15}
        cy="50"
        cx="50"
       
        className={clsx(` stroke-gray-900 `, white)}
      ></circle>
    </svg>
  );
};

export default CircleLoader;
