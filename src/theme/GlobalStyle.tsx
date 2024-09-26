import { createGlobalStyle } from "styled-components";
import theme from "./theme";

export const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        padding: 0;
        background: ${theme.color.primary.darkBlue};
        font-family: 'Inter', sans-serif;

        * {
            color: ${theme.color.primary.white};
        }
    }

    h1, h2, h3, h4, h5, h6 {
        color: ${theme.color.primary.white};
    }

`;
