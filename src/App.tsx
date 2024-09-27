import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { ThemeProvider } from "styled-components";
import MainPage from "./components/pages/main/main";
import { GlobalStyle } from "./theme/GlobalStyle";
import theme, { MANTINE_THEME_CONFIGS } from "./theme/theme";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";

export default function App() {
  const MantineTheme = createTheme(MANTINE_THEME_CONFIGS);

  return (
    <>
      <MantineProvider theme={MantineTheme}>
        <Notifications />
        <GlobalStyle />
        <ThemeProvider theme={theme}>
          <MainPage />
        </ThemeProvider>
      </MantineProvider>
    </>
  );
}
