import { MantineThemeOverride } from "@mantine/core";

export const theme = {
  color: {
    primary: {
      white: "#ffffff",
      dark: "#3a3a3a",
      darkBlue: "#003b75",
      mediumBlue: "#0082f5",
      background: "#505569",
      lightBlue: "#4ac0ff"
    },
    secondary: {
      gray: "#666666",
      lightGray: "#efefef",
      lighterGray: "#f9f9f9",
      red: "#f34141"
    }
  },

  font: {
    smaller: "0.5rem",
    small: "0.875rem",
    default: "1rem",
    big: "2rem",
    bigger: "3rem"
  }
};

export const MANTINE_THEME_CONFIGS: MantineThemeOverride = {
  primaryColor: "medium-blue",
  colors: {
    // https://mantine.dev/theming/colors/#adding-extra-colors
    // https://mantine.dev/colors-generator/?color=0082f5
    "medium-blue": [
      "#e4f6ff",
      "#cde9ff",
      "#9cd0ff",
      "#66b6fe",
      "#3da0fc",
      "#2593fc",
      "#0078e3",
      "#148cfe",
      "#006bcb",
      "#005cb4"
    ]
  }
};

export default theme;
