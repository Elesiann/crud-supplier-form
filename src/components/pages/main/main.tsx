import { Button, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { PlusCircle } from "lucide-react";
import styled from "styled-components";
import Supplier from "../../../api/Supplier";
import { ISupplier } from "../../../types/Supplier.type";
import { handleNotification } from "../../../utils/notification";
import DrawerComponent from "../../molecules/drawer/Drawer.component";
import RegisterForm from "../../organisms/RegisterForm/RegisterForm.component";
import TableComponent from "../../organisms/table/Table.component";
import { useState } from "react";

const MainPage = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [selectedSupplier, setSelectedSupplier] = useState<ISupplier>();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["supplier"],
    queryFn: Supplier.getAll
  });

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

  if (isLoading && !data) return <div>Loading...</div>;

  return (
    <Container>
      <Header>
        <Button leftSection={<PlusCircle size={18} />} onClick={open}>
          New supplier
        </Button>
      </Header>
      <DrawerComponent
        size={rem(600)}
        position="right"
        opened={opened}
        onClose={handleDrawerClose}
        title="New supplier form"
      >
        <RegisterForm defaultValues={selectedSupplier} onFormSubmit={onFormSubmit} />
      </DrawerComponent>
      {data && <TableComponent data={data} onDelete={handleDelete} onEdit={handleEdit} />}
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
