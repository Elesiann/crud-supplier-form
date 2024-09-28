import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { Route, Routes } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { AuthenticationPage } from "./components/pages/authentication/authentication.page.tsx";
import MainPage from "./components/pages/main/main";
import { ProtectedRoute } from "./components/templates/ProtectedRoute/ProtectedRoute.template.tsx";
import { AuthProvider } from "./hooks/useAuth.tsx";
import { GlobalStyle } from "./theme/GlobalStyle";
import theme, { MANTINE_THEME_CONFIGS } from "./theme/theme";

export default function App() {
  const MantineTheme = createTheme(MANTINE_THEME_CONFIGS);
  const queryClient = new QueryClient();

  const AuthPageElement = () => {
    return (
      <AuthProvider>
        <Helmet>
          <meta charSet="utf-8" />
          <title>supp.li | Authentication</title>
        </Helmet>
        <AuthenticationPage />
      </AuthProvider>
    );
  };

  const ProtectedMainPage = () => {
    return (
      <AuthProvider>
        <Helmet>
          <meta charSet="utf-8" />
          <title>supp.li | Suppliers</title>
        </Helmet>
        <ProtectedRoute>
          <MainPage />
        </ProtectedRoute>
      </AuthProvider>
    );
  };

  return (
    <>
      <MantineProvider theme={MantineTheme}>
        <QueryClientProvider client={queryClient}>
          <ModalsProvider>
            <Notifications />
            <GlobalStyle />
            <ThemeProvider theme={theme}>
              <GoogleOAuthProvider clientId="799220823568-fvbfpqbk4qbotee2r2fshiaocpslu85u.apps.googleusercontent.com">
                <AuthProvider>
                  <Routes>
                    <Route path="/" element={<AuthPageElement />} />
                    <Route path="/login" element={<AuthPageElement />} />
                    <Route path="/main" element={<ProtectedMainPage />} />
                  </Routes>
                </AuthProvider>
              </GoogleOAuthProvider>
            </ThemeProvider>
          </ModalsProvider>
        </QueryClientProvider>
      </MantineProvider>
    </>
  );
}
