import { Button, Image, LoadingOverlay, rem, Text, TextInput } from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { FileDown, LogOut, PlusCircle, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useCSVDownloader } from "react-papaparse";
import styled from "styled-components";
import Supplier from "../../../api/Supplier";
import { useAuth } from "../../../hooks/useAuth";
import { ISupplier } from "../../../types/Supplier.type";
import handle_csv_export from "../../../utils/handle_csv_export";
import { handleNotification } from "../../../utils/notification";
import DrawerComponent from "../../molecules/drawer/Drawer.component";
import SupplierRegisterForm from "../../organisms/RegisterForm/SupplierRegisterForm.component";
import TableComponent from "../../organisms/Table/Table.component";

const MainPage = () => {
  const { user, logout } = useAuth();
  const { CSVDownloader } = useCSVDownloader();
  const [openedDrawer, { open: openDrawer, close: closeDrawer }] = useDisclosure(false);
  const [selectedSupplier, setSelectedSupplier] = useState<ISupplier>();
  const [selectedRows, setSelectedRows] = useState<ISupplier[]>([]);
  const [searchValue, setSearchValue] = useState("");

  const [debounced] = useDebouncedValue(searchValue, 500);

  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["supplier"],
    queryFn: Supplier.getAll
  });

  const rows = useMemo(() => {
    if (!data) return [];

    return data.filter((supplier: ISupplier) => {
      const { name, description, contacts, address } = supplier;
      const { street, number, city, state } = address;

      return (
        name.toLowerCase().includes(debounced.toLowerCase()) ||
        description.toLowerCase().includes(debounced.toLowerCase()) ||
        contacts.some((contact) => contact.name.toLowerCase().includes(debounced.toLowerCase())) ||
        `${street}, ${number}, ${city}, ${state}`.toLowerCase().includes(debounced.toLowerCase())
      );
    });
  }, [data, debounced]);

  const mutate = () => {
    queryClient.invalidateQueries({
      queryKey: ["supplier"]
    });
  };

  const onFormSubmit = async (data: ISupplier) => {
    const handleSuccess = (action: string) => {
      handleNotification(`Supplier ${action}`, `Supplier ${action} successfully`, "green");
      mutate();
      handleDrawerClose();
    };

    const handleError = (err: unknown, action: string) => {
      if (isAxiosError(err)) {
        handleNotification(err.code as string, `Failed to ${action} supplier`, "red");
      } else {
        handleNotification(
          `Unknown error occurred while ${action} supplier`,
          `Failed to ${action} supplier`,
          "red"
        );
      }
    };

    try {
      if (selectedSupplier) {
        await Supplier.update(data);
        handleSuccess("updated");
      } else {
        await Supplier.register(data);
        handleSuccess("registered");
      }
    } catch (err) {
      handleError(err, selectedSupplier ? "update" : "register");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await Supplier.delete(id);

      handleNotification("Supplier deleted", "Supplier deleted successfully", "green");
      mutate();
    } catch (err) {
      if (isAxiosError(err)) {
        handleNotification(err.code as string, "Failed to delete supplier", "red");
      } else {
        handleNotification(
          "Unknown error occurred while deleting supplier",
          "Failed to delete supplier",
          "red"
        );
      }
    }
  };

  const handleEdit = (supplier: ISupplier) => {
    setSelectedSupplier(supplier);
    open();
  };

  const handleDrawerClose = () => {
    setSelectedSupplier(undefined);
    closeDrawer();
  };

  if (isLoading && !data)
    return <LoadingOverlay visible zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />;

  const renderHeader = () => {
    return (
      <Header>
        <TextInput
          w={"100%"}
          leftSection={<Search size={18} />}
          placeholder="Search by name, description, contact or address"
          value={searchValue}
          onChange={(event) => setSearchValue(event.currentTarget.value)}
        />
        <ButtonContainer>
          <CSVDownloader
            data={() => handle_csv_export({ selectedRows, rows })}
            filename="suppliers"
          >
            <Button leftSection={<FileDown size={18} />}>
              Export CSV {selectedRows.length > 0 ? `(${selectedRows.length})` : ""}
            </Button>
          </CSVDownloader>
          <div>
            <Button leftSection={<PlusCircle size={18} />} onClick={openDrawer}>
              New supplier
            </Button>
          </div>
        </ButtonContainer>
      </Header>
    );
  };

  const renderContent = () => {
    return (
      <Content>
        <DrawerComponent
          size={rem(600)}
          position="right"
          opened={openedDrawer}
          onClose={handleDrawerClose}
          title={selectedSupplier ? `Edit supplier` : "Register new supplier"}
        >
          <SupplierRegisterForm defaultValues={selectedSupplier} onFormSubmit={onFormSubmit} />
        </DrawerComponent>
        {data && (
          <TableComponent
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            data={rows}
            onDelete={handleDelete}
            onEdit={handleEdit}
          />
        )}
      </Content>
    );
  };

  return (
    <Container>
      <Title>
        <Image w={250} visibleFrom="sm" src={"/logo_white.png"} />
        <LoggedContainer>
          <Text lh={1.25}>
            Logged as <br /> <b>{user?.name}</b>
          </Text>
          <Button leftSection={<LogOut size={18} />} onClick={() => logout()}>
            Logout
          </Button>
        </LoggedContainer>
      </Title>
      <Title>
        <h1>Suppliers</h1>
      </Title>
      {renderHeader()}
      {renderContent()}
    </Container>
  );
};

const Header = styled.div`
  display: flex;
  gap: 1.25rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column-reverse;
    gap: 1rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;

  button {
    width: 100%;
  }

  @media (max-width: 768px) {
    gap: 1rem;

    a,
    div {
      width: 100%;
    }

    button {
      background-color: ${({ theme }) => theme.color.primary.lightBlue};
      color: ${({ theme }) => theme.color.primary.white};
    }
  }

  @media (max-width: 380px) {
    flex-direction: column;
  }
`;

const LoggedContainer = styled.div`
  @media (max-width: 480px) {
    p {
      display: block;
    }
    display: flex;
    width: 100%;
    justify-content: space-between;
  }
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  h1 {
    color: ${({ theme }) => theme.color.primary.white};
    text-align: start;
  }

  div {
    display: flex;
    align-items: center;
    gap: 1rem;
    * {
      color: ${({ theme }) => theme.color.primary.white};
    }

    b {
      text-transform: capitalize;
    }
  }

  @media (max-width: 768px) {
    gap: 1;

    div {
      display: flex;
      justify-content: space-between;
    }
  }
`;

const Container = styled.div`
  padding: 2rem 4rem;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100dvh;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }
`;

const Content = styled.div`
  * {
    color: ${({ theme }) => theme.color.primary.white};
  }
`;

export default MainPage;
