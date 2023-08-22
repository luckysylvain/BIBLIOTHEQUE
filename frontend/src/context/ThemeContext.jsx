import { createContext, useContext, useState } from "react";

export const ThemeContext = createContext();

const ThemeContextProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      document.body.classList.remove("light");
      document.body.classList.add("dark");
    } else {
      setTheme("light");
      document.body.classList.remove("dark");
      document.body.classList.add("light");
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};


export default ThemeContextProvider