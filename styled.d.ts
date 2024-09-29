import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    color: {
      primary: {
        white: string;
        dark: string;
        darkBlue: string;
        mediumBlue: string;
        background: string;
        lightBlue: string;
      };
      secondary: {
        gray: string;
        lightGray: string;
        lighterGray: string;
        red: string;
      };
    };
    font: {
      smaller: string;
      small: string;
      default: string;
      big: string;
      bigger: string;
    };
  }
}
