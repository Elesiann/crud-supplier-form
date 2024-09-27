import { Checkbox, SimpleGrid, Table } from "@mantine/core";
import { PenBox, Trash } from "lucide-react";
import styled from "styled-components";
import { ISupplier } from "../../../types/Supplier.type";
import phone_formatter from "../../../utils/phone_formatter";
import ConfirmationModal from "../ConfirmationModal/ConfirmationModal.component";

interface TableComponentProps {
  data: ISupplier[];
  onDelete: (id: number) => void;
  onEdit: (supplier: ISupplier) => void;
  setSelectedRows: (rows: ISupplier[]) => void;
  selectedRows: ISupplier[];
}

export default function TableComponent(props: TableComponentProps) {
  const { data, setSelectedRows, selectedRows } = props;

  const rows = data?.map((supplier) => {
    const { id, name, description, contacts, address } = supplier;
    const { street, number, city, state } = address;

    return (
      <Table.Tr
        key={id}
        bg={selectedRows.includes(supplier) ? "var(--mantine-color-blue-light)" : undefined}
      >
        <Table.Td>
          <Checkbox
            aria-label="Select row"
            checked={selectedRows.includes(supplier)}
            onChange={(event) =>
              setSelectedRows(
                event.target.checked
                  ? [...selectedRows, supplier]
                  : selectedRows.filter((row) => row.id !== id)
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
          <Grid cols={2}>
            <PenBox className="edit" size={24} onClick={() => props.onEdit(supplier)} />

            <ConfirmationModal
              title="Delete supplier"
              text="Are you sure you want to delete this supplier? This action is irreversible."
              onCancel={() => null}
              onConfirm={() => props.onDelete(id)}
            >
              <Trash className="delete" size={24} />
            </ConfirmationModal>
          </Grid>
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Table.ScrollContainer minWidth={800}>
      <GlassmorphismTable horizontalSpacing="xl" verticalSpacing="lg">
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
      </GlassmorphismTable>
    </Table.ScrollContainer>
  );
}

const Grid = styled(SimpleGrid)`
  .edit {
    &:hover {
      stroke: ${({ theme }) => theme.color.primary.lightBlue};
    }
  }

  .delete {
    &:hover {
      stroke: ${({ theme }) => theme.color.secondary.red};
    }
  }

  svg {
    cursor: pointer;
  }
`;

const GlassmorphismTable = styled(Table)`
  border-radius: 1rem;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.09);

  backdrop-filter: blur(3.9px);
  -webkit-backdrop-filter: blur(3.9px);

  padding: 2rem !important;
`;
