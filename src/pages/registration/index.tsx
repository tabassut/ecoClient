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
import mobileImage from "../../assets/ecoroute1.png";
import pegasus from "../../assets/ecoroute1.png";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";
import { VisibilityOffOutlined, VisibilityOutlined } from "@mui/icons-material";
import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../constants/route-constant";
import { keyframes } from "@mui/material/styles";
import { useMutation } from "@tanstack/react-query";
import type { AxiosError, AxiosResponse } from "axios";
import backendInstance from "../../utils/api-services/backendInstance";
import {
  setInLocalStorage,
  STORAGE_KEY,
} from "../../utils/local-storage-service";

type RegisterFormInputs = {
  name: string;
  email: string;
  password: string;
};

const defaultValues: RegisterFormInputs = {
  name: "",
  email: "",
  password: "",
};

const cardEntry = keyframes`
  from { opacity: 0; transform: translateY(12px) scale(0.99); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

export const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormInputs>({
    defaultValues,
  });

  const { mutate: registerUser, isPending } = useMutation({
    mutationFn: (data: RegisterFormInputs) =>
      backendInstance.post("/api/register", data),

    onSuccess: (response: AxiosResponse) => {
      const { token, user } = response.data;

      setInLocalStorage(STORAGE_KEY.ACCESS_TOKEN, token);
      localStorage.setItem("user", JSON.stringify(user));

      navigate(ROUTES.HOME);
    },

    onError: (error: AxiosError<any>) => {
      console.log("REGISTER ERROR:", error.response?.data);
    },
  });

  const onSubmit: SubmitHandler<RegisterFormInputs> = (data) => {
    registerUser(data);
  };

  const handleTogglePassword = () => setShowPassword((prev) => !prev);

  return (
    <Box
      sx={{
        width: "100vw",
        minHeight: "100vh",
        position: "relative",
        backgroundImage: `url(${mobileImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        px: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        sx={{
          maxWidth: 560,
          width: "100%",
          bgcolor: "white",
          borderRadius: 3,
          boxShadow: "0 8px 30px rgba(14,81,73,0.12)",
          p: { xs: 4, sm: 6 },
          animation: `${cardEntry} 680ms ease-in`,
        }}
      >
        <Stack spacing={3} sx={{ alignItems: "center" }}>
          <Box component={"img"} src={pegasus} width={200} />

          <Typography fontWeight={700} fontSize={28} color="#0e5149">
            Create Account
          </Typography>

          <Typography fontSize={15} color="text.secondary">
            Register to continue
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ width: "100%", maxWidth: 420 }}
          >
            {/* Name */}
            <TextField
              label="Name"
              fullWidth
              margin="normal"
              {...register("name", {
                required: "Name is required",
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />

            {/* Email */}
            <TextField
              label="Email"
              fullWidth
              margin="normal"
              {...register("email", {
                required: "Email is required",
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon />
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
              {...register("password", {
                required: "Password is required",
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePassword}>
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
            />

            {isPending ? (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
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
                  "&:hover": { bgcolor: "#327670" },
                  boxShadow: "none",
                }}
              >
                Register
              </Button>
            )}

            <Box display="flex" justifyContent="center" mt={3}>
              <Typography>
                Already have an account? <a href="/login">Sign in</a>
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default Register;
