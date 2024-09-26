import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { ThemeProvider } from "styled-components";
import MainPage from "./components/pages/main/main";
import { GlobalStyle } from "./theme/GlobalStyle";
import theme from "./theme/theme";

export default function App() {
  return (
    <>
      <MantineProvider>
        <GlobalStyle />
        <ThemeProvider theme={theme}>
          <MainPage />
        </ThemeProvider>
      </MantineProvider>
    </>
  );
}
