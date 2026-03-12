import { Box, CircularProgress } from "@mui/material";
import { Navigate, Outlet } from "react-router-dom";
import { ROUTES } from "../constants/route-constant";

export const AuthProvider = () => {
  const token = localStorage.getItem("token");

  const checkingAuth = false;
  const isAuthenticated = !!token;

  if (checkingAuth)
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress size="6rem" color="success" />
      </Box>
    );

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOG_IN} replace />;
  }

  return <Outlet />;
};

export default AuthProvider;
