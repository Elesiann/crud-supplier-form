import { Button, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { PlusCircle } from "lucide-react";
import styled from "styled-components";
import DrawerComponent from "../../molecules/drawer/Drawer.component";
import RegisterForm from "../../organisms/RegisterForm/RegisterForm.component";
import TableComponent from "../../organisms/table/Table.component";

const MainPage = () => {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <Container>
      <Header>
        <Button leftSection={<PlusCircle size={18} />} onClick={open}>
          New supplier
        </Button>
      </Header>
      <DrawerComponent size={rem(600)} position="right" opened={opened} onClose={close} title="New supplier form">
        <RegisterForm />
      </DrawerComponent>
      <TableComponent />
    </Container>
  );
};

const Container = styled.div`
  padding: 4rem;

  * {
    color: ${({ theme }) => theme.color.primary.white};
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: end;
  margin-bottom: 2rem;
`;

export default MainPage;
