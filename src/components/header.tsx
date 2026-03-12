import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Slider,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { RhfAutocomplete } from "./React-hook-form";
import { useForm } from "react-hook-form";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants";
import type { AxiosResponse } from "axios";
import { searchLocation } from "../utils/api-services/location";
import { axios } from "../utils/api-services";
import { useDebounce } from "../hooks";
import { useStore } from "../store";
import { useEffect, useRef, useState } from "react";
import { mapSearchLocationOptions } from "../helper/locations";
import ecorouteLogo from "../assets/ecorouteLogo.png";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { ROUTES } from "../constants/route-constant";
import { Link, useLocation, useNavigate } from "react-router-dom";

type SearchFormInputs = {
  searchName: string;
};

const defaultLoginFormValues: SearchFormInputs = {
  searchName: "",
};

export const Header = () => {
  const isSidebarOpen = useStore((state) => state.isSidebarOpen);
  const greenPreference = useStore((state) => state.greenPreference);
  const setGreenPreference = useStore((state) => state.setGreenPreference);
  const setSelectedLocation = useStore((state) => state.setSelectedLocation);
  const clearSelectedLocation = useStore(
    (state) => state.clearSelectedLocation,
  );

  const { control, watch } = useForm<SearchFormInputs>({
    defaultValues: defaultLoginFormValues,
    mode: "onChange",
  });

  const query = watch("searchName") ?? "";
  const debouncedQuery = useDebounce(query, 400);

  const lastSelectedRef = useRef<string | null>(null);

  const { data: searchLocationData } = useQuery({
    queryKey: [QUERY_KEYS.SEARCH_LOCATION, debouncedQuery],
    queryFn: async () => {
      const response: AxiosResponse = await searchLocation({
        api: axios,
        url: "/search",
        data: {
          q: debouncedQuery,
          format: "json",
          addressdetails: 1,
          limit: 5,
        },
      });
      return response.data;
    },
    enabled: !!debouncedQuery && debouncedQuery.length >= 3,
    gcTime: Infinity,
    staleTime: Infinity,
  });

  const searchedLocationOptions = mapSearchLocationOptions(searchLocationData);

  useEffect(() => {
    if (!query) return;

    const matchedOption = searchedLocationOptions.find(
      (opt: any) => opt.value === query,
    );

    if (!matchedOption) return;
    if (lastSelectedRef.current === query) return;

    lastSelectedRef.current = query;

    setSelectedLocation({
      id: matchedOption.id,
      label: matchedOption.label,
      lat: matchedOption.lat,
      lng: matchedOption.lng,
    });
  }, [query, searchedLocationOptions, setSelectedLocation]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAnchorEl(null);
    navigate(ROUTES.LOG_IN);
    clearSelectedLocation();
    window.location.reload();
  };

  const location = useLocation();

  if (
    isSidebarOpen ||
    location.pathname === "/history" ||
    location.pathname === "/saved-routes"
  ) {
    return (
      <>
        <Box
          sx={{
            position: "fixed",
            top: 16,
            right: 16,
            zIndex: 1200,
          }}
        >
          <Avatar
            onClick={handleClick}
            sx={{
              bgcolor: "#10B981",
              cursor: "pointer",
            }}
          >
            <PersonIcon />
          </Avatar>
        </Box>

        <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
          <MenuItem
            component={Link}
            to="/"
            onClick={() => {
              navigate("/");
              window.location.reload();
            }}
          >
            Home
          </MenuItem>

          <MenuItem component={Link} to="/history">
            History
          </MenuItem>
          <MenuItem component={Link} to="/saved-routes">
            Saved routes
          </MenuItem>

          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1 }} />
            Logout
          </MenuItem>
        </Menu>
      </>
    );
  }

  return (
    <>
      <Paper
        elevation={5}
        sx={{
          position: "fixed",
          top: 16,
          left: 16,
          right: 16,
          backgroundColor: "#10B981",
          px: 2,
          py: 1,
          zIndex: 1200,
          borderRadius: 2,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
          width="100%"
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Box component={"img"} src={ecorouteLogo} width={60} />
            <Stack>
              <Typography
                sx={{ fontWeight: 700, fontSize: 32, color: "white" }}
              >
                EcoRoute
              </Typography>
              <Typography
                sx={{ fontWeight: 400, fontSize: 12, color: "white" }}
              >
                Personalized low-impact commute planner
              </Typography>
            </Stack>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 2,
              width: "60%",
            }}
          >
            <Box width="60%">
              <RhfAutocomplete
                control={control}
                freeSolo
                name="searchName"
                label="Where To?"
                options={searchedLocationOptions}
              />
            </Box>

            <Box width="40%">
              <Box
                sx={{
                  backgroundColor: "#0E3A34",
                  borderRadius: "14px",
                  p: 1,
                  width: 320,
                }}
              >
                <GradientSlider
                  min={0}
                  max={1}
                  step={0.1}
                  value={greenPreference}
                  onChange={(_, value) => {
                    if (typeof value === "number") {
                      setGreenPreference(value);
                    }
                  }}
                  sx={{ p: 0 }}
                />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#1E88E5",
                      letterSpacing: "0.5px",
                    }}
                  >
                    FASTER
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: "#00C853",
                      letterSpacing: "0.5px",
                    }}
                  >
                    GREENER
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>

          <IconButton onClick={handleClick}>
            <MenuIcon sx={{ color: "#fff" }} fontSize="large" />
          </IconButton>
        </Box>
      </Paper>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem
          component={Link}
          to="/"
          onClick={() => window.location.reload()}
        >
          Home
        </MenuItem>

        <MenuItem component={Link} to="/history">
          History
        </MenuItem>
        <MenuItem component={Link} to="/saved-routes">
          Saved routes
        </MenuItem>

        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

export default Header;

const GradientSlider = styled(Slider)(() => ({
  height: 8,
  padding: "15px 0",

  "& .MuiSlider-track": {
    border: "none",
    background: "linear-gradient(90deg, #1E88E5 0%, #00C853 100%)",
  },

  "& .MuiSlider-rail": {
    opacity: 1,
    backgroundColor: "#1E4D45",
  },

  "& .MuiSlider-thumb": {
    height: 18,
    width: 18,
    backgroundColor: "#00C853",
    border: "2px solid #0B3C34",
    boxShadow: "none",

    "&:hover, &.Mui-focusVisible, &.Mui-active": {
      boxShadow: "0 0 0 6px rgba(0, 200, 83, 0.2)",
    },
  },
}));
