import { Checkbox, Menu, Table } from "@mantine/core";
import { CircleEllipsis, MapPin, PencilLine, PhoneOutgoing, Trash } from "lucide-react";
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

  const renderMenuDropdown = (supplier: ISupplier) => {
    const baseUrl = "https://www.google.com/maps/search/?api=1";
    const query = `${supplier.address.street} ${supplier.address.number}, ${supplier.address.city}, ${supplier.address.state}`;
    const url = `${baseUrl}&query=${encodeURIComponent(query)}`;

    return (
      <Menu shadow="md" position="bottom-end" width={200}>
        <Menu.Target>
          <CircleEllipsis cursor={"pointer"} size={24} />
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            onClick={() => {
              props.onEdit(supplier);
            }}
            leftSection={<PencilLine size={18} />}
          >
            Edit supplier
          </Menu.Item>
          <Menu.Item leftSection={<PhoneOutgoing size={18} />}>
            <a
              href={`https://wa.me/${supplier.contacts[0].phone.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
            >
              Open WhatsApp
            </a>
          </Menu.Item>
          <Menu.Item
            onClick={() => {
              window.open(url, "_blank");
            }}
            leftSection={<MapPin size={18} />}
          >
            See location
          </Menu.Item>
          <Menu.Divider />

          <Menu.Item color="red" leftSection={<Trash size={18} />}>
            <ConfirmationModal
              onConfirm={() => props.onDelete(supplier.id)}
              onCancel={() => {}}
              title="Delete supplier"
              text="Are you sure you want to delete this supplier? This action is irreversible."
            >
              Delete supplier
            </ConfirmationModal>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  };

  const rows = data?.map((supplier) => {
    const { id, name, description, contacts, address } = supplier;
    const { street, number, city, state } = address;

    return (
      <Table.Tr key={id}>
        <Table.Td pl={24}>
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

        <Table.Td pr={24} align="center">
          {renderMenuDropdown(supplier)}
        </Table.Td>
      </Table.Tr>
    );
  });

  return (
    <Table.ScrollContainer minWidth={800}>
      <GlassmorphismTable verticalSpacing={"md"}>
        <Table.Thead>
          <Table.Tr>
            <Table.Th />
            <Table.Th>ID</Table.Th>
            <Table.Th>Name</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Contacts</Table.Th>
            <Table.Th>Address</Table.Th>
            <Table.Th pr={24}>Actions</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </GlassmorphismTable>
    </Table.ScrollContainer>
  );
}

const GlassmorphismTable = styled(Table)`
  border-radius: 0.5rem;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.09);

  backdrop-filter: blur(3.9px);
  -webkit-backdrop-filter: blur(3.9px);

  padding: 2rem !important;
`;
