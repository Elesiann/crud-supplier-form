import { Button, Image, LoadingOverlay, rem, TextInput } from "@mantine/core";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { FileDown, PlusCircle, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { useCSVDownloader } from "react-papaparse";
import styled from "styled-components";
import Supplier from "../../../api/Supplier";
import { ISupplier } from "../../../types/Supplier.type";
import { handleNotification } from "../../../utils/notification";
import DrawerComponent from "../../molecules/drawer/Drawer.component";
import RegisterForm from "../../organisms/RegisterForm/RegisterForm.component";
import TableComponent from "../../organisms/table/Table.component";

const MainPage = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedSupplier, setSelectedSupplier] = useState<ISupplier>();
  const [searchValue, setSearchValue] = useState("");
  const [debounced] = useDebouncedValue(searchValue, 500);
  const [selectedRows, setSelectedRows] = useState<ISupplier[]>([]);

  const { CSVDownloader } = useCSVDownloader();

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
    close();
  };

  const payloadToExport = selectedRows.length > 0 ? selectedRows : rows;

  const csvData = {
    fields: ["name", "description", "contacts", "address"],
    data: payloadToExport?.map((row) => {
      const { name, description, contacts, address } = row;
      const { street, number, city, state } = address;

      return {
        name,
        description,
        contacts: contacts.map((contact) => `${contact.name} - ${contact.phone}`).join(", "),
        address: `${street}, ${number}, ${city}, ${state}`
      };
    })
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
        <CSVDownloader data={csvData} filename="suppliers" style={{ color: "white" }}>
          <Button leftSection={<FileDown size={18} />}>
            Export CSV {selectedRows.length > 0 ? `(${selectedRows.length})` : ""}
          </Button>
        </CSVDownloader>
        <div>
          <Button leftSection={<PlusCircle size={18} />} onClick={open}>
            New supplier
          </Button>
        </div>
      </Header>
    );
  };

  const renderContent = () => {
    return (
      <Content>
        <DrawerComponent
          size={rem(600)}
          position="right"
          opened={opened}
          onClose={handleDrawerClose}
          title={selectedSupplier ? `Edit supplier` : "Register new supplier"}
        >
          <RegisterForm defaultValues={selectedSupplier} onFormSubmit={onFormSubmit} />
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
        <Image w={250} src={"/logo_white.png"} />
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
`;

const Title = styled.div`
  margin-bottom: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h1 {
    color: ${({ theme }) => theme.color.primary.white};
    text-align: start;
  }
`;

const Container = styled.div`
  padding: 2rem 4rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Content = styled.div`
  * {
    color: ${({ theme }) => theme.color.primary.white};
  }
`;

export default MainPage;
