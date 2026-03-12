import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import mobileImage from "../../assets/ecoroute1.png";
import pegasus from "../../assets/ecoroute1.png";
import PersonIcon from "@mui/icons-material/Person";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/route-constant";
import { keyframes } from "@mui/material/styles";
import { getLoginService } from "../../utils/api-services/login";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import backendInstance from "../../utils/api-services/backendInstance";

type LoginFormInputs = {
  email: string;
  password: string;
};

const defaultLoginFormValues: LoginFormInputs = {
  email: "",
  password: "",
};

const cardEntry = keyframes`
  from { opacity: 0; transform: translateY(12px) scale(0.99); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>({
    defaultValues: defaultLoginFormValues,
  });

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  const { mutate: login, isPending } = useMutation({
    mutationFn: (credentials: LoginFormInputs) =>
      getLoginService({
        api: backendInstance,
        data: credentials,
      }),

    onSuccess: (response: AxiosResponse) => {
      const { token, user } = response.data;

      // store token
      localStorage.setItem("token", token);

      // store user info
      localStorage.setItem("user", JSON.stringify(user));

      // navigate to home
      navigate(ROUTES.HOME);
    },

    onError: (error: AxiosError) => {
      console.error( "av",error);
    },
  });

  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    login(data);
    console.log("Login data:", data);
  };

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        position: "relative",
        backgroundImage: `url(${mobileImage})`,
        backgroundSize: "fill",
        backgroundPosition: "center",
        px: 2,
      }}
    >
      {/* Login Card */}
      <Box
        sx={{
          maxWidth: "100%",
          bgcolor: "white",
          borderRadius: 3,
          boxShadow: "0 8px 30px rgba(14,81,73,0.12)",
          p: { xs: 4, sm: 6 },
          minHeight: { xs: "auto", sm: 580 },
          zIndex: 5,
          animation: `${cardEntry} 680ms ease-in`,
        }}
      >
        <Stack spacing={3} sx={{ alignItems: "center" }}>
          <Box component={"img"} src={pegasus} width={200} />

          <Typography fontWeight={700} fontSize={28} color="#0e5149">
            Welcome back
          </Typography>

          <Typography fontWeight={400} fontSize={15} color="text.secondary">
            Please log in
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ width: "100%", maxWidth: 420 }}
          >
            {/* Username */}
            <TextField
              label="Username"
              fullWidth
              margin="normal"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email address",
                },
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              sx={{
                bgcolor: "white",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "15px",
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon sx={{ color: "rgba(0,0,0,0.6)" }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* Password */}
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "rgba(0,0,0,0.6)" }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePassword} edge="end">
                        {showPassword ? (
                          <VisibilityOutlined />
                        ) : (
                          <VisibilityOffOutlined />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              {...register("password", {
                required: "Password is required",
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              sx={{
                bgcolor: "white",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "15px",
                },
              }}
            />

            {isPending ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mt: 2,
                }}
              >
                <CircularProgress size={36} color="success" />
              </Box>
            ) : (
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  mt: 2,
                  bgcolor: "#3b8d8c",
                  borderRadius: "8px",
                  color: "#fff",
                  "&:hover": { bgcolor: "#327670" },
                  boxShadow: "none",
                }}
              >
                Login
              </Button>
            )}
          </Box>
        </Stack>
        <Box display="flex" justifyContent="center" mt={3}>
          <Typography>
            Dont have an account? <a href="/registration">Sign up</a>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
