import { useState } from "react";
import { Outlet } from "react-router-dom";
import ToasterContext from "./context/ToasterContext";

function App() {
  return <>
    <ToasterContext/>
    <Outlet/>
  </>;
}

export default App;
