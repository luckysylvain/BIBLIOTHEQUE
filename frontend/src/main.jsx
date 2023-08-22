import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";
import AuthForm from "./layout/AuthForm.jsx";
import { Provider } from "react-redux";
import store from "./redux/store.jsx";
import PrivateRoute from "./components/utils/PrivateRoute.jsx";
import AdminLayout from "./layout/admin/AdminLayout.jsx";
import MembrePage from "./layout/admin/MembrePage.jsx";
import LivrePage from "./layout/admin/LivrePage.jsx";
import EmpruntPage from "./layout/admin/EmpruntPage.jsx";
import DashboardAdmin from "./layout/admin/DashboardAdmin.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="/" element={<AuthForm />} />
      <Route path="/" element={<PrivateRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="/admin" element={<DashboardAdmin />} />
          <Route path="/admin/emprunt" element={<EmpruntPage />} />
          <Route path="/admin/livre" element={<LivrePage />} />
          <Route path="/admin/membre" element={<MembrePage />} />
        </Route>
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);
