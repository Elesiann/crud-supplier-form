import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "styled-components";
import MainPage from "./components/pages/main/main";
import { GlobalStyle } from "./theme/GlobalStyle";
import theme, { MANTINE_THEME_CONFIGS } from "./theme/theme";
import { ModalsProvider } from "@mantine/modals";

export default function App() {
  const MantineTheme = createTheme(MANTINE_THEME_CONFIGS);
  const queryClient = new QueryClient();

  return (
    <>
      <MantineProvider theme={MantineTheme}>
        <QueryClientProvider client={queryClient}>
          <ModalsProvider>
            <Notifications />
            <GlobalStyle />
            <ThemeProvider theme={theme}>
              <MainPage />
            </ThemeProvider>
          </ModalsProvider>
        </QueryClientProvider>
      </MantineProvider>
    </>
  );
}
