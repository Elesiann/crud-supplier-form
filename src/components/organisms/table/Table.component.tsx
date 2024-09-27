import { Checkbox, SimpleGrid, Table } from "@mantine/core";
import { PenBox, Trash } from "lucide-react";
import { useState } from "react";
import { ISupplier } from "../../../types/Supplier.type";
import phone_formatter from "../../../utils/phone_formatter";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal.component";

interface TableComponentProps {
  data: ISupplier[];
  onDelete: (id: number) => void;
}

export default function TableComponent(props: TableComponentProps) {
  const { data } = props;
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const rows = data?.map((supplier) => {
    const { id, name, description, contacts, address } = supplier;
    const { street, number, city, state } = address;

    return (
      <Table.Tr
        key={id}
        bg={selectedRows.includes(id) ? "var(--mantine-color-blue-light)" : undefined}
      >
        <Table.Td>
          <Checkbox
            aria-label="Select row"
            checked={selectedRows.includes(id)}
            onChange={(event) =>
              setSelectedRows(
                event.currentTarget.checked
                  ? [...selectedRows, id]
                  : selectedRows.filter((position) => position !== id)
              )
            }
          />
        </Table.Td>
        <Table.Td>{id}</Table.Td>
        <Table.Td>{name}</Table.Td>
        <Table.Td>{description}</Table.Td>
        <Table.Td>
          {contacts
            .map((contact) => `${contact.name} - ${phone_formatter(contact.phone)}`)
            .join(", ")}
        </Table.Td>
        <Table.Td>{`${street}, ${number}, ${city} - ${state}`}</Table.Td>

        <Table.Td>
          <SimpleGrid cols={2}>
            <PenBox size={20} />

            <ConfirmationModal
              title="Delete supplier"
              text="Are you sure you want to delete this supplier? This action is irreversible."
              onCancel={() => null}
              onConfirm={() => props.onDelete(id)}
            >
              <Trash size={20} />
            </ConfirmationModal>
          </SimpleGrid>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th />
          <Table.Th>ID</Table.Th>
          <Table.Th>Name</Table.Th>
          <Table.Th>Description</Table.Th>
          <Table.Th>Contacts</Table.Th>
          <Table.Th>Address</Table.Th>
          <Table.Th>Actions</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
