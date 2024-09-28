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
import { Helmet } from "react-helmet";

export default function App() {
  const MantineTheme = createTheme(MANTINE_THEME_CONFIGS);
  const queryClient = new QueryClient();

  const AuthPageElement = () => {
    return (
      <>
        <Helmet>
          <meta charSet="utf-8" />
          <title>supp.li | Authentication</title>
        </Helmet>
        <AuthenticationPage />
      </>
    );
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <AuthPageElement />
    },
    {
      path: "/login",
      element: <AuthPageElement />
    },
    {
      path: "/main",
      element: (
        <>
          <Helmet>
            <meta charSet="utf-8" />
            <title>supp.li | Suppliers</title>
          </Helmet>
          <MainPage />
        </>
      )
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
