import type { ComponentProps, FC } from "react";
import { lazy } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import { AuthProvider } from "./auth-provider";
import { ROUTES } from "../constants/route-constant";

const Loader = (Component: FC) => (props: ComponentProps<typeof Component>) => (
  <Component {...props} />
);

const Home = Loader(lazy(() => import("../pages/home")));
const Layout = Loader(lazy(() => import("../layout")));
const Login = Loader(lazy(() => import("../pages/login")));
const Registration = Loader(lazy(() => import("../pages/registration")));
const History = Loader(lazy(() => import("../pages/history")));
const SavedRoutes = Loader(lazy(() => import("../pages/saved-routes")));

export const RouterConfig = () => {
  const location = useLocation();

  const background =
    location.state && (location.state.background as typeof location);

  return (
    <Routes location={background || location}>
      <Route path={ROUTES.LOG_IN} element={<Login />} />
      <Route path={ROUTES.REGISTRATION} element={<Registration />} />
      <Route element={<AuthProvider />}>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path={ROUTES.HISTORY} element={<History />} />
          <Route path={ROUTES.SAVED_ROUTES} element={<SavedRoutes />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default RouterConfig;
