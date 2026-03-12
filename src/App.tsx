import { BrowserRouter } from "react-router";
import { CssBaseline } from "@mui/material";

import RouterConfig from "./navigation/RouterConfig";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <CssBaseline />
        <RouterConfig />
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
