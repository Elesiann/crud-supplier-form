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
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthenticationPage } from "./components/pages/authentication/authentication.page.tsx";

export default function App() {
  const MantineTheme = createTheme(MANTINE_THEME_CONFIGS);
  const queryClient = new QueryClient();

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AuthenticationPage />
    },
    {
      path: "/login",
      element: <AuthenticationPage />
    },
    {
      path: "/main",
      element: <MainPage />
    }
  ]);

  return (
    <>
      <MantineProvider theme={MantineTheme}>
        <QueryClientProvider client={queryClient}>
          <ModalsProvider>
            <Notifications />
            <GlobalStyle />
            <ThemeProvider theme={theme}>
              <RouterProvider router={router} />
            </ThemeProvider>
          </ModalsProvider>
        </QueryClientProvider>
      </MantineProvider>
    </>
  );
}
