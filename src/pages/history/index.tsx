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
import { QUERY_KEYS } from "../../constants";
import type { AxiosResponse } from "axios";
import { getHistory } from "../../utils/api-services/location";
import backendInstance from "../../utils/api-services/backendInstance";
import { getFromLocalStorage } from "../../utils/local-storage-service";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";

import bgImage from "../../assets/ecoroute1.png";

type Trip = {
  id: string;
  trip_name: string;
  start_name: string;
  end_name: string;
  mode: string;
  distance_km: string;
  duration_minutes: number;
  route_co2_kg: number;
  carbon_saved_kg: number;
  created_at: string;
};

const modeIcon = (mode: string) => {
  switch (mode) {
    case "car":
      return <DirectionsCarIcon />;
    case "walk":
      return <DirectionsWalkIcon />;
    default:
      return null;
  }
};

export const History = () => {
  const user = getFromLocalStorage("user");
  const { data: trips, isFetching } = useQuery({
    queryKey: [QUERY_KEYS.HISTORY],
    queryFn: async () => {
      const response: AxiosResponse = await getHistory({
        api: backendInstance,
        url: `${user?.id}`,
      });
      return response.data;
    },
    enabled: !!user?.id,
  });

  const totalCarbonSaved =
    trips?.reduce(
      (sum: number, trip: Trip) => sum + (trip.carbon_saved_kg || 0),
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
            Total Carbon Saved
          </Typography>

          <Typography fontSize={32} fontWeight={700}>
            {totalCarbonSaved.toFixed(3)} kg
          </Typography>
        </CardContent>
      </Card>
      <Typography variant="h4" fontWeight={700} mb={3}>
        Trip History
      </Typography>

      <Grid container spacing={3}>
        {trips?.map((trip: Trip) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={trip.id}>
            <Card sx={{ borderRadius: 3, bgcolor: "#b2f3b2" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600}>
                  {trip.trip_name}
                </Typography>

                <Typography color="text.secondary" mb={2}>
                  {trip.start_name} → {trip.end_name}
                </Typography>

                <Stack direction="row" spacing={1} mb={2}>
                  {trip.mode === "car" || trip.mode === "walk" ? (
                    <Chip
                      icon={modeIcon(trip.mode) || undefined}
                      label={trip.mode.toUpperCase()}
                    />
                  ) : (
                    <Chip label={trip.mode.toUpperCase()} />
                  )}
                  <Chip label={`${trip.distance_km} km`} />
                  <Chip label={`${trip.duration_minutes} min`} />
                </Stack>

                <Typography fontSize={14}>
                  CO₂: <strong>{trip.route_co2_kg} kg</strong>
                </Typography>

                <Typography fontSize={14}>
                  Carbon Saved: <strong>{trip.carbon_saved_kg} kg</strong>
                </Typography>

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

export default History;
