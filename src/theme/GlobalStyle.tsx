import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        padding: 0;
        background: rgb(0,59,117);
        background: linear-gradient(45deg, rgba(0,59,117,1) 0%, rgba(0,130,245,1) 70%, rgba(74,192,255,1) 100%);
        font-family: 'Inter', sans-serif;
        min-height: 100dvh;
    }

    a, a:visited {
        text-decoration: none;
        color: inherit;

    
    }
`;
