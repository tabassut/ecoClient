import { type FC, type ReactElement } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Header } from "../components/header";

type SidebarLayoutProps = {
  children?: ReactElement;
};

export const Layout: FC<SidebarLayoutProps> = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100vw",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Header />
      <Outlet />
    </Box>
  );
};

export default Layout;
