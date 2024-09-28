import { ActionIcon, Anchor, Group, Image, Text } from "@mantine/core";
import { FileUser, Linkedin } from "lucide-react";
import styled from "styled-components";
import theme from "../../../theme/theme";

export function FooterCentered() {
  const icons = [
    {
      icon: <Linkedin strokeWidth={1.25} size={24} />,
      link: "https://www.linkedin.com/in/giovanimachado/"
    },
    {
      icon: <FileUser strokeWidth={1.25} size={24} />,
      link: "https://cvgiovanimachado.vercel.app/"
    }
  ];
  return (
    <Container>
      <Content>
        <Image w={150} src="/logo_white.png" />

        <Text className="inner" c={theme.color.primary.white}>
          Made with ❤️ by Giovani M. Corrêa
        </Text>

        <Group className="icons" gap="xs" justify="flex-end">
          {icons.map((icon, index) => (
            <Anchor key={index} target={"_blank"} href={icon.link}>
              <ActionIcon size="lg" color={theme.color.primary.white} variant="subtle" radius="md">
                {icon.icon}
              </ActionIcon>
            </Anchor>
          ))}
        </Group>
      </Content>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  align-items: center;
  background: rgb(0, 59, 117);
  background: linear-gradient(
    -45deg,
    rgba(0, 59, 117, 1) 0%,
    rgba(0, 130, 245, 1) 80%,
    rgba(74, 192, 255, 1) 100%
  );
  display: flex;
  justify-content: center;
`;

const Content = styled.div`
  display: flex;
  max-width: 1400px;
  align-items: center;
  justify-content: space-between;

  width: 100%;
  padding: 2rem;

  @media screen and (max-width: 768px) {
    flex-direction: column;

    .inner {
      text-align: center;
      margin-block: 1rem 1.5rem;
      flex-direction: column;
    }
  }
`;
