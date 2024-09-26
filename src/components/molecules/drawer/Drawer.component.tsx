import { Drawer, DrawerProps } from "@mantine/core";

const DrawerComponent = (props: DrawerProps) => {
  return (
    <Drawer
      overlayProps={{
        backgroundOpacity: 0.5,
        color: "gray"
      }}
      {...props}
    >
      {props.children}
    </Drawer>
  );
};

export default DrawerComponent;
