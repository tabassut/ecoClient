import {
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { getSavedRoutes } from "../../utils/api-services/location";
import backendInstance from "../../utils/api-services/backendInstance";
import { QUERY_KEYS } from "../../constants";
import { getFromLocalStorage } from "../../utils/local-storage-service";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import DirectionsBikeIcon from "@mui/icons-material/DirectionsBike";
import bgImage from "../../assets/ecoroute1.png";

type Trip = {
  id: string;
  start_name: string;
  end_name: string;
  mode: string;
  last_co2_score: string;
  created_at: string;
};

const modeIcon = (mode: string) => {
  switch (mode) {
    case "car":
      return <DirectionsCarIcon />;
    case "walk":
      return <DirectionsWalkIcon />;
    case "bike":
      return <DirectionsBikeIcon />;
    default:
      return null;
  }
};

export const SavedRoutes = () => {
  const user = getFromLocalStorage("user");
  const { data, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.SAVED_ROUTES],
    queryFn: async () => {
      const response: AxiosResponse = await getSavedRoutes({
        api: backendInstance,
        url: `${user?.id}`,
      });
      return response.data;
    },
    enabled: !!user?.id,
  });

  const totalCarbonScore =
    data?.reduce(
      (sum: number, trip: Trip) => sum + Number(trip.last_co2_score || 0),
      0,
    ) || 0;

  if (isFetching) {
    return (
      <Box p={4}>
        <CircularProgress />
      </Box>
    );
  }
  return (
    <Box
      p={4}
      sx={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        overflowY: "auto",
      }}
    >
      {/* Summary Card */}
      <Card
        sx={{
          mb: 3,
          borderRadius: 3,
          bgcolor: "#10B981",
          color: "white",
          maxWidth: 400,
        }}
      >
        <CardContent>
          <Typography fontSize={14} fontWeight={500}>
            Total CO₂ Score
          </Typography>

          <Typography fontSize={32} fontWeight={700}>
            {totalCarbonScore.toFixed(2)}
          </Typography>
        </CardContent>
      </Card>

      <Typography variant="h4" fontWeight={700} mb={3}>
        Trip History
      </Typography>

      <Grid container spacing={3}>
        {data?.map((trip: Trip) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={trip.id}>
            <Card sx={{ borderRadius: 3, bgcolor: "#b2f3b2" }}>
              <CardContent>
                {/* Route */}
                <Typography variant="h6" fontWeight={600}>
                  {trip.start_name} → {trip.end_name}
                </Typography>

                {/* Mode */}
                <Stack direction="row" spacing={1} mt={2} mb={2}>
                  <Chip
                    icon={modeIcon(trip.mode) || undefined}
                    label={trip.mode.toUpperCase()}
                  />
                </Stack>

                {/* CO2 Score */}
                <Typography fontSize={14}>
                  CO₂ Score: <strong>{trip.last_co2_score}</strong>
                </Typography>

                {/* Created Time */}
                <Typography mt={2} fontSize={12} color="text.secondary">
                  Created: {new Date(trip.created_at).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default SavedRoutes;
